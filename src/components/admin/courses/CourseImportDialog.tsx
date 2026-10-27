"use client";

import { useId, useMemo, useState } from "react";

import { Alert, Button, Dialog, adminFetch, apiMessage, focusRing, selectClass } from "@/components/admin/ui";
import { codeKey, matchCategory, modulesFrom, prettyDuration } from "@/lib/data/import-rules";
import { cn } from "@/lib/cn";

type FieldKey = "ignore" | "name" | "code" | "category" | "duration" | "level" | "modules" | "eligibility";

const FIELDS: { value: FieldKey; label: string }[] = [
  { value: "ignore", label: "Don’t import" },
  { value: "name", label: "Course name" },
  { value: "code", label: "Course code" },
  { value: "category", label: "Category" },
  { value: "duration", label: "Duration" },
  { value: "level", label: "Level" },
  { value: "modules", label: "Syllabus / modules" },
  { value: "eligibility", label: "Eligibility" },
];

const STEPS = ["Upload", "Match columns", "Confirm", "Done"];
const MAX_BYTES = 10 * 1024 * 1024;

function guessField(header: string): FieldKey {
  const h = header.toLowerCase();
  if (/eligib/.test(h)) return "eligibility";
  if (/categ/.test(h)) return "category";
  if (/code/.test(h)) return "code";
  if (/name|title/.test(h)) return "name";
  if (/dur/.test(h)) return "duration";
  if (/level/.test(h)) return "level";
  if (/desc|syllab|module|detail|content|topic/.test(h)) return "modules";
  return "ignore";
}

type Parsed = { fileName: string; headers: string[]; rows: string[][] };

export function CourseImportDialog({
  open,
  onClose,
  existingCodes,
  categories,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  existingCodes: string[];
  categories: string[];
  onImported: (message: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [mapping, setMapping] = useState<FieldKey[]>([]);
  const [mode, setMode] = useState<"update" | "skip">("update");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const fileId = useId();

  function reset() {
    setStep(1);
    setParsed(null);
    setMapping([]);
    setMode("update");
    setError("");
    setBusy(false);
    setDone("");
  }

  function close() {
    reset();
    onClose();
  }

  async function onFile(file: File | undefined) {
    setError("");
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) return setError("Choose an Excel .xlsx file.");
    if (file.size > MAX_BYTES) return setError("That file is larger than 10 MB.");
    setBusy(true);
    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) throw new Error("no sheet");
      const table = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "" });
      const headers = (table[0] ?? []).map((cell) => String(cell ?? "").trim());
      const rows = table
        .slice(1)
        .map((row) => headers.map((_, i) => String(row[i] ?? "").trim()))
        .filter((row) => row.some(Boolean));
      if (!headers.some(Boolean) || rows.length === 0) throw new Error("empty");
      setParsed({ fileName: file.name, headers, rows });
      setMapping(headers.map((header) => guessField(header)));
      setStep(2);
    } catch {
      setError("This file couldn’t be read. Use an .xlsx file whose first row holds the column headings.");
    }
    setBusy(false);
  }

  const mapped = useMemo(() => {
    if (!parsed) return [];
    const index = (key: FieldKey) => mapping.indexOf(key);
    const get = (row: string[], key: FieldKey) => (index(key) >= 0 ? row[index(key)] ?? "" : "");
    return parsed.rows.map((row) => ({
      name: get(row, "name").replace(/\s+/g, " ").slice(0, 200),
      code: get(row, "code").replace(/\s+/g, " ").slice(0, 40),
      category: matchCategory(get(row, "category"), categories).slice(0, 80),
      duration: prettyDuration(get(row, "duration")).slice(0, 80),
      level: get(row, "level").replace(/\s+/g, " ").slice(0, 60),
      modules: modulesFrom(get(row, "modules")).slice(0, 200),
      eligibility: get(row, "eligibility").replace(/\s+/g, " ").trim().slice(0, 200),
    }));
  }, [parsed, mapping, categories]);

  const codeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const code of existingCodes) counts.set(codeKey(code), (counts.get(codeKey(code)) ?? 0) + 1);
    return counts;
  }, [existingCodes]);
  const valid = mapped.filter((row) => row.name && row.code);
  // Same rule as the server: the n-th row with a code matches the n-th course with it.
  const existing = (() => {
    const seen = new Map<string, number>();
    return valid.filter((row) => {
      const key = codeKey(row.code);
      const n = seen.get(key) ?? 0;
      seen.set(key, n + 1);
      return n < (codeCounts.get(key) ?? 0);
    }).length;
  })();
  const newCategories = [...new Set(valid.map((row) => row.category || "Uncategorised"))].filter((name) => !categories.includes(name));
  const duplicateMapping = FIELDS.filter((field) => field.value !== "ignore" && mapping.filter((m) => m === field.value).length > 1);
  const canContinue = mapping.includes("name") && mapping.includes("code") && duplicateMapping.length === 0;

  async function confirmImport() {
    setBusy(true);
    setError("");
    const res = await adminFetch<{ added?: number; updated?: number; skipped?: number }>("/api/admin/courses/import", "POST", {
      mode,
      rows: valid,
    });
    setBusy(false);
    if (!res.ok) return setError(apiMessage(res.data, "The import failed. Nothing was changed."));
    const { added = 0, updated = 0, skipped = 0 } = res.data;
    const text = `Import complete: ${added} added as unpublished, ${updated} updated, ${skipped + (mapped.length - valid.length)} skipped.`;
    setDone(text);
    setStep(4);
    onImported(text);
  }

  const footer = (
    <>
      {step > 1 && step < 4 ? (
        <Button onClick={() => setStep(step - 1)} disabled={busy}>
          ← Back
        </Button>
      ) : null}
      <span className="flex-1" />
      <Button onClick={close}>{step === 4 ? "Close" : "Cancel"}</Button>
      {step === 2 ? (
        <Button variant="primary" disabled={!canContinue} onClick={() => setStep(3)}>
          Continue
        </Button>
      ) : null}
      {step === 3 ? (
        <Button variant="primary" disabled={busy || valid.length === 0} onClick={confirmImport}>
          {busy ? "Importing…" : `Import ${valid.length} rows`}
        </Button>
      ) : null}
    </>
  );

  return (
    <Dialog open={open} onClose={close} title="Import courses from Excel" size="lg" footer={footer}>
      <ol aria-label="Import steps" className="m-0 mb-4 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={step === i + 1 ? "step" : undefined} className={cn("flex items-center gap-2 text-[14px]", step === i + 1 ? "font-semibold text-rd-ink" : "text-rd-soft")}>
            <span className={cn("flex size-6 items-center justify-center rounded-full text-[12.5px] font-bold", step > i ? "bg-rd-inverse text-rd-inverse-text" : "bg-ad-line-soft text-rd-soft")}>
              {i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {error ? <Alert className="mb-4">{error}</Alert> : null}

      {step === 1 ? (
        <div className="flex flex-col gap-3">
          <label
            htmlFor={fileId}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-ad-field bg-ad-bg px-5 py-10 text-center hover:border-rd-ink",
              "focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-rd-focus",
            )}
          >
            <span className="text-[16px] font-semibold text-rd-ink">{busy ? "Reading file…" : "Choose an Excel file"}</span>
            <span className="text-[13.5px] text-rd-soft">.xlsx only · the first row should hold column headings · up to 10 MB</span>
            <input
              id={fileId}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              onChange={(e) => {
                void onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <p className="m-0 text-[13.5px] text-rd-soft">
            The file is read in your browser. Only the mapped course fields are sent when you confirm. Rows are matched to existing
            courses by course code.
          </p>
        </div>
      ) : null}

      {step === 2 && parsed ? (
        <div className="flex flex-col gap-5">
          <span className="text-[14px] text-rd-soft">
            {parsed.fileName} · {parsed.rows.length} rows
          </span>
          <section aria-labelledby="im-map" className="flex flex-col gap-3">
            <h3 id="im-map" className="m-0 text-[16px] font-semibold text-rd-ink">
              Match your columns to course fields
            </h3>
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))]">
              {parsed.headers.map((header, i) => (
                <div key={`${header}-${i}`} className="flex min-w-0 flex-col gap-1 rounded-xl border border-ad-line p-3">
                  <label htmlFor={`im-col-${i}`} className="truncate text-[14px] font-semibold text-rd-ink">
                    {header || `Column ${i + 1}`}
                  </label>
                  <span className="truncate text-[12.5px] text-rd-soft">e.g. {parsed.rows[0]?.[i] || "—"}</span>
                  <select
                    id={`im-col-${i}`}
                    value={mapping[i]}
                    onChange={(e) => setMapping((prev) => prev.map((m, j) => (j === i ? (e.target.value as FieldKey) : m)))}
                    className={cn(selectClass, "h-10")}
                  >
                    {FIELDS.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {!mapping.includes("name") || !mapping.includes("code") ? (
              <p className="m-0 text-[14px] text-rd-danger">Map a column to Course name and one to Course code to continue.</p>
            ) : null}
            {duplicateMapping.length ? (
              <p className="m-0 text-[14px] text-rd-danger">
                {duplicateMapping.map((field) => field.label).join(", ")} {duplicateMapping.length === 1 ? "is" : "are"} mapped twice.
              </p>
            ) : null}
          </section>
          <section aria-labelledby="im-prev" className="flex flex-col gap-3">
            <h3 id="im-prev" className="m-0 text-[16px] font-semibold text-rd-ink">
              Preview (first 5 rows)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-ad-line">
              <table className="w-full min-w-[640px] border-collapse text-[14px]">
                <thead>
                  <tr className="bg-ad-head text-left text-[12px] tracking-[0.06em] text-rd-soft">
                    {["COURSE NAME", "CODE", "CATEGORY", "DURATION", "LEVEL", "TOPICS"].map((h) => (
                      <th key={h} scope="col" className="border-b border-ad-line px-3 py-2.5 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mapped.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-ad-line-soft">
                      <td className="px-3 py-2 font-semibold text-rd-ink">{row.name || "—"}</td>
                      <td className="px-3 py-2 font-mono text-[13px]">{row.code || "—"}</td>
                      <td className="px-3 py-2">{row.category || "—"}</td>
                      <td className="px-3 py-2">{row.duration || "—"}</td>
                      <td className="px-3 py-2">{row.level || "—"}</td>
                      <td className="px-3 py-2">{row.modules.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-4">
          <dl className="m-0 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr))]">
            {[
              ["Rows read", mapped.length],
              ["Ready to import", valid.length],
              ["New courses", valid.length - existing],
              ["Match existing codes", existing],
              ["Skipped (no name or code)", mapped.length - valid.length],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 rounded-xl border border-ad-line p-3">
                <dt className="text-[13px] text-rd-soft">{label}</dt>
                <dd className="m-0 font-rd-display text-[26px] text-rd-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <fieldset className="m-0 flex flex-col gap-2 rounded-xl border border-ad-line p-3.5">
            <legend className="px-1 text-[14.5px] font-semibold text-rd-ink">When a course code already exists</legend>
            <label className="flex min-h-9 items-center gap-2.5 text-[14.5px]">
              <input type="radio" name="im-mode" checked={mode === "update"} onChange={() => setMode("update")} className={cn("size-[18px] accent-[var(--rd-inverse)]", focusRing)} />
              Update the existing course with the spreadsheet values
            </label>
            <label className="flex min-h-9 items-center gap-2.5 text-[14.5px]">
              <input type="radio" name="im-mode" checked={mode === "skip"} onChange={() => setMode("skip")} className={cn("size-[18px] accent-[var(--rd-inverse)]", focusRing)} />
              Skip it and keep the current course
            </label>
          </fieldset>
          {newCategories.length ? (
            <p className="m-0 text-[14px] text-rd-body">
              New categories will be created: <strong>{newCategories.join(", ")}</strong>.
            </p>
          ) : null}
          <p className="m-0 text-[13.5px] text-rd-soft">
            New courses are added as unpublished, so nothing appears on the website until you publish them. Updates keep each
            course&rsquo;s URL, description, image and publish status; empty cells leave the current value.
          </p>
        </div>
      ) : null}

      {step === 4 ? <Alert tone="ok">{done}</Alert> : null}
    </Dialog>
  );
}
