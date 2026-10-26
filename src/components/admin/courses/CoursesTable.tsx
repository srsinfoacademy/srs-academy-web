"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CourseImportDialog } from "@/components/admin/courses/CourseImportDialog";
import { durationMonths, type AdminCourseRow } from "@/components/admin/courses/types";
import { dateStamp, downloadCsv } from "@/components/admin/csv";
import { Alert, Button, ButtonLink, Dialog, Pill, adminFetch, apiMessage, focusRing, inputClass, selectClass } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

type SortKey = "name" | "code" | "category" | "duration" | "level" | "status" | "updated";
type StatusFilter = "all" | "published" | "unpublished";
type TypeFilter = "all" | "catalogue" | "srs";

const PER_PAGE_OPTIONS = [25, 50, 100];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "name:1", label: "Name (A–Z)" },
  { value: "name:-1", label: "Name (Z–A)" },
  { value: "code:1", label: "Code" },
  { value: "category:1", label: "Category" },
  { value: "duration:1", label: "Duration (shortest)" },
  { value: "duration:-1", label: "Duration (longest)" },
  { value: "status:1", label: "Status" },
  { value: "updated:-1", label: "Recently updated" },
];

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "code", label: "CODE" },
  { key: "name", label: "COURSE NAME" },
  { key: "category", label: "CATEGORY" },
  { key: "duration", label: "DURATION" },
  { key: "level", label: "LEVEL" },
  { key: "status", label: "STATUS" },
];

function compare(a: AdminCourseRow, b: AdminCourseRow, key: SortKey): number {
  switch (key) {
    case "duration":
      return durationMonths(a.duration) - durationMonths(b.duration);
    case "status":
      return Number(b.published) - Number(a.published);
    case "updated":
      return (a.updatedAt || "").localeCompare(b.updatedAt || "");
    default:
      return String(a[key]).localeCompare(String(b[key]), "en", { numeric: true, sensitivity: "base" });
  }
}

function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function CoursesTable({
  courses,
  categories,
  initial,
}: {
  courses: AdminCourseRow[];
  categories: string[];
  initial: { q: string; category: string; status: StatusFilter };
}) {
  const router = useRouter();
  const [q, setQ] = useState(initial.q);
  const [category, setCategory] = useState(initial.category);
  const [status, setStatus] = useState<StatusFilter>(initial.status);
  const [type, setType] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const catalogueCount = courses.filter((course) => course.origin === "catalogue").length;
  const srsCount = courses.length - catalogueCount;

  const filtered = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = courses.filter((course) => {
      if (category !== "all" && course.category !== category) return false;
      if (status === "published" && !course.published) return false;
      if (status === "unpublished" && course.published) return false;
      if (type !== "all" && course.origin !== type) return false;
      if (!words.length) return true;
      const hay = `${course.name} ${course.code} ${course.category}`.toLowerCase();
      return words.every((word) => hay.includes(word));
    });
    return list.sort((a, b) => compare(a, b, sort.key) * sort.dir || a.name.localeCompare(b.name));
  }, [courses, q, category, status, type, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const pageAllSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const selectedRows = courses.filter((course) => selected.has(course.id));

  function syncUrl(next: { q?: string; category?: string; status?: string }) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  function resetFilters() {
    setQ("");
    setCategory("all");
    setStatus("all");
    setType("all");
    setPage(1);
    syncUrl({ q: "", category: "", status: "" });
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function togglePage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (pageAllSelected) rows.forEach((row) => next.delete(row.id));
      else rows.forEach((row) => next.add(row.id));
      return next;
    });
  }

  async function runBulk(body: Record<string, unknown>, done: string) {
    setBusy(true);
    setMessage(null);
    const res = await adminFetch<{ count?: number }>("/api/admin/courses/bulk", "POST", { ...body, ids: [...selected] });
    setBusy(false);
    if (!res.ok) {
      setMessage({ tone: "error", text: res.data.fields?.category ?? apiMessage(res.data) });
      return;
    }
    setMessage({ tone: "ok", text: done.replace("{n}", String(res.data.count ?? selected.size)) });
    setSelected(new Set());
    router.refresh();
  }

  function exportCsv() {
    const list = selectedRows.length ? filtered.filter((row) => selected.has(row.id)) : filtered;
    downloadCsv(`srs-courses-${dateStamp()}.csv`, [
      ["Code", "Course name", "Category", "Duration", "Level", "Status", "Type", "Topics", "URL"],
      ...list.map((row) => [
        row.code,
        row.name,
        row.category,
        row.duration,
        row.level,
        row.published ? "Published" : "Unpublished",
        row.origin === "srs" ? "SRS program" : "Catalogue",
        row.moduleCount,
        `/courses/${row.slug}`,
      ]),
    ]);
  }

  function sortBy(key: SortKey) {
    setSort((prev) => ({ key, dir: prev.key === key ? (prev.dir === 1 ? -1 : 1) : 1 }));
    setPage(1);
  }

  const showingText =
    filtered.length === 0
      ? "No courses match"
      : `Showing ${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, filtered.length)} of ${filtered.length}${filtered.length !== courses.length ? ` (filtered from ${courses.length})` : ""}`;

  const statusPill = (row: AdminCourseRow) =>
    row.published ? <Pill tone="g">Published</Pill> : <Pill tone="n">Unpublished</Pill>;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="m-0 max-w-[680px] text-[15px] leading-[1.55] text-rd-body">
          {courses.length} courses: {catalogueCount} from the course catalogue and {srsCount} SRS programs. Unpublished
          courses, and courses in hidden categories, don&rsquo;t appear on the website.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setImportOpen(true)}>Import from Excel</Button>
          <Button onClick={exportCsv}>{selectedRows.length ? `Export ${selectedRows.length} selected` : "Export CSV"}</Button>
          <ButtonLink href="/admin/courses/new" variant="accent">
            + Add course
          </ButtonLink>
        </div>
      </div>

      {message ? <Alert tone={message.tone === "ok" ? "ok" : "error"}>{message.text}</Alert> : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-ad-line bg-ad-panel p-3.5">
        <div className="flex flex-wrap items-end gap-2.5">
          <div className="flex min-w-0 flex-[2_1_260px] flex-col gap-1.5">
            <label htmlFor="cl-q" className="text-[14px] font-semibold text-rd-ink">
              Search
            </label>
            <input
              id="cl-q"
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
                syncUrl({ q: e.target.value.trim() });
              }}
              placeholder="Course name, code or category"
              className={inputClass}
            />
          </div>
          <div className="flex min-w-0 flex-[1_1_190px] flex-col gap-1.5">
            <label htmlFor="cl-cat" className="text-[14px] font-semibold text-rd-ink">
              Category
            </label>
            <select
              id="cl-cat"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
                syncUrl({ category: e.target.value });
              }}
              className={selectClass}
            >
              <option value="all">All categories</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-0 flex-[1_1_150px] flex-col gap-1.5">
            <label htmlFor="cl-st" className="text-[14px] font-semibold text-rd-ink">
              Status
            </label>
            <select
              id="cl-st"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPage(1);
                syncUrl({ status: e.target.value });
              }}
              className={selectClass}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
          <div className="flex min-w-0 flex-[1_1_150px] flex-col gap-1.5">
            <label htmlFor="cl-type" className="text-[14px] font-semibold text-rd-ink">
              Type
            </label>
            <select
              id="cl-type"
              value={type}
              onChange={(e) => {
                setType(e.target.value as TypeFilter);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">All types</option>
              <option value="catalogue">Catalogue</option>
              <option value="srs">SRS programs</option>
            </select>
          </div>
          <div className="flex min-w-0 flex-[1_1_190px] flex-col gap-1.5">
            <label htmlFor="cl-so" className="text-[14px] font-semibold text-rd-ink">
              Sort by
            </label>
            <select
              id="cl-so"
              value={`${sort.key}:${sort.dir}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split(":");
                setSort({ key: key as SortKey, dir: Number(dir) === -1 ? -1 : 1 });
                setPage(1);
              }}
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {SORT_OPTIONS.some((option) => option.value === `${sort.key}:${sort.dir}`) ? null : (
                <option value={`${sort.key}:${sort.dir}`}>
                  {COLUMNS.find((c) => c.key === sort.key)?.label.toLowerCase() ?? sort.key} ({sort.dir === 1 ? "ascending" : "descending"})
                </option>
              )}
            </select>
          </div>
        </div>

        {selected.size > 0 ? (
          <div role="region" aria-label="Bulk actions" className="flex flex-wrap items-center gap-2 rounded-xl bg-rd-inverse px-3 py-2.5 text-rd-inverse-text">
            <span className="mr-1 text-[14.5px] font-semibold">{selected.size} selected</span>
            {selected.size < filtered.length ? (
              <button
                type="button"
                onClick={() => setSelected(new Set(filtered.map((row) => row.id)))}
                className={cn("min-h-9 text-[14px] font-semibold text-rd-inverse-text underline underline-offset-4", focusRing)}
              >
                Select all {filtered.length} matching
              </button>
            ) : null}
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              <button type="button" disabled={busy} onClick={() => runBulk({ action: "publish" }, "Published {n} courses.")} className={cn("min-h-[38px] rounded-lg border border-rd-inverse-muted/50 px-3 text-[14px] font-semibold disabled:opacity-50", focusRing)}>
                Publish
              </button>
              <button type="button" disabled={busy} onClick={() => runBulk({ action: "unpublish" }, "Unpublished {n} courses.")} className={cn("min-h-[38px] rounded-lg border border-rd-inverse-muted/50 px-3 text-[14px] font-semibold disabled:opacity-50", focusRing)}>
                Unpublish
              </button>
              <label htmlFor="cl-bc" className="sr-only">
                Change category
              </label>
              <select
                id="cl-bc"
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className={cn("h-[38px] max-w-[200px] rounded-lg border border-rd-inverse-muted/50 bg-rd-inverse px-2 text-[14px] text-rd-inverse-text", focusRing)}
              >
                <option value="">Change category…</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy || !bulkCategory}
                onClick={() => runBulk({ action: "category", category: bulkCategory }, `Moved {n} courses to ${bulkCategory}.`)}
                className={cn("min-h-[38px] rounded-lg bg-ad-panel px-3 text-[14px] font-semibold text-rd-ink disabled:opacity-50", focusRing)}
              >
                Apply
              </button>
              <button type="button" disabled={busy} onClick={() => setConfirmDelete(true)} className={cn("min-h-[38px] rounded-lg bg-rd-danger px-3 text-[14px] font-semibold text-rd-bg disabled:opacity-50", focusRing)}>
                Delete
              </button>
              <button type="button" onClick={() => setSelected(new Set())} className={cn("min-h-[38px] px-2 text-[14px] text-rd-inverse-muted", focusRing)}>
                Clear
              </button>
            </div>
          </div>
        ) : null}

        {/* Wide: table */}
        <div className="hidden overflow-x-auto rounded-xl border border-ad-line-soft md:block">
          <table className="w-full min-w-[900px] border-collapse text-[14.5px]">
            <thead>
              <tr className="bg-ad-head text-left">
                <th scope="col" className="w-11 border-b border-ad-line px-3.5 py-2.5">
                  <input type="checkbox" checked={pageAllSelected} onChange={togglePage} aria-label="Select all courses on this page" className="size-[18px] cursor-pointer accent-[var(--rd-inverse)]" />
                </th>
                {COLUMNS.map((column) => {
                  const active = sort.key === column.key;
                  return (
                    <th key={column.key} scope="col" aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className="border-b border-ad-line p-0">
                      <button
                        type="button"
                        onClick={() => sortBy(column.key)}
                        className={cn("flex items-center gap-1.5 px-3.5 py-3 text-[12.5px] font-semibold tracking-[0.06em] whitespace-nowrap", active ? "text-rd-ink" : "text-rd-soft", focusRing)}
                      >
                        {column.label}
                        <span aria-hidden="true" className="text-[10px] opacity-80">
                          {active ? (sort.dir === 1 ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    </th>
                  );
                })}
                <th scope="col" className="border-b border-ad-line px-3.5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={cn("border-b border-ad-line-soft hover:bg-ad-hover", selected.has(row.id) && "bg-ad-head")}>
                  <td className="px-3.5 py-2.5">
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggle(row.id)} aria-label={`Select ${row.name}`} className="size-[18px] cursor-pointer accent-[var(--rd-inverse)]" />
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-[13px] whitespace-nowrap text-rd-body">{row.code}</td>
                  <td className="min-w-[260px] px-3.5 py-2.5 font-semibold text-rd-ink">
                    {row.name}
                    {row.origin === "srs" ? <Pill tone="s" className="ml-2 align-middle">SRS program</Pill> : null}
                  </td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap text-rd-body">{row.category}</td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap text-rd-body">{row.duration || "—"}</td>
                  <td className="px-3.5 py-2.5 text-rd-body">{row.level || "—"}</td>
                  <td className="px-3.5 py-2.5">{statusPill(row)}</td>
                  <td className="px-3.5 py-2.5 text-right">
                    <ButtonLink href={`/admin/courses/${row.id}`} size="sm" aria-label={`Edit ${row.name}`}>
                      Edit
                    </ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Narrow: cards */}
        <div className="flex flex-col gap-2.5 md:hidden">
          {rows.length ? (
            <label className="flex min-h-10 items-center gap-2.5 text-[14.5px] font-semibold text-rd-ink">
              <input type="checkbox" checked={pageAllSelected} onChange={togglePage} className="size-[22px] accent-[var(--rd-inverse)]" />
              Select all on this page
            </label>
          ) : null}
          {rows.map((row) => (
            <div key={row.id} className={cn("flex items-start gap-3 rounded-xl border-[1.5px] bg-ad-panel p-3", selected.has(row.id) ? "border-rd-ink" : "border-ad-line")}>
              <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggle(row.id)} aria-label={`Select ${row.name}`} className="mt-0.5 size-[22px] shrink-0 accent-[var(--rd-inverse)]" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[12.5px] text-rd-soft">{row.code}</span>
                  {statusPill(row)}
                </span>
                <span className="text-[15.5px] leading-[1.3] font-semibold text-rd-ink">
                  {row.name}
                  {row.origin === "srs" ? <Pill tone="s" className="ml-2 align-middle">SRS program</Pill> : null}
                </span>
                <span className="text-[13.5px] text-rd-soft">{[row.category, row.duration, row.level].filter(Boolean).join(" · ")}</span>
                <ButtonLink href={`/admin/courses/${row.id}`} size="sm" className="self-start">
                  Edit course
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-ad-field p-7 text-center">
            <span className="font-semibold text-rd-ink">No courses match these filters</span>
            <Button variant="primary" onClick={resetFilters}>
              Clear search and filters
            </Button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-ad-line-soft pt-3">
          <div className="flex flex-wrap items-center gap-3">
            <span aria-live="polite" className="text-[14px] font-semibold text-rd-body">
              {showingText}
            </span>
            <label className="flex items-center gap-1.5 text-[13.5px] text-rd-soft">
              Per page
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className={cn("h-[34px] rounded-lg border border-ad-field bg-ad-panel px-1.5 text-[14px] text-rd-ink", focusRing)}
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {pageCount > 1 ? (
            <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
              <Button size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Previous page">
                ‹ Prev
              </Button>
              {pageList(currentPage, pageCount).map((p, i) =>
                p === "gap" ? (
                  <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-rd-soft">
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === currentPage ? "primary" : "secondary"}
                    aria-current={p === currentPage ? "page" : undefined}
                    aria-label={`Page ${p}`}
                    onClick={() => setPage(p)}
                    className="min-w-9"
                  >
                    {p}
                  </Button>
                ),
              )}
              <Button size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} aria-label="Next page">
                Next ›
              </Button>
            </nav>
          ) : null}
        </div>
      </div>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Delete ${selected.size} course${selected.size === 1 ? "" : "s"}?`}
        size="sm"
        role="alertdialog"
        footer={
          <>
            <Button onClick={() => setConfirmDelete(false)} className="ml-auto">
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={busy}
              onClick={async () => {
                setConfirmDelete(false);
                await runBulk({ action: "delete" }, "Deleted {n} courses.");
              }}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <p className="m-0 text-[15px] leading-[1.55]">
          The selected courses are removed from the admin and the website. Their pages stop working. This can&rsquo;t be
          undone{selectedRows.some((row) => row.origin === "srs") ? " — and the selection includes SRS programs" : ""}. To hide a
          course temporarily, unpublish it instead.
        </p>
      </Dialog>

      <CourseImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        existingCodes={courses.map((course) => course.code)}
        categories={categories}
        onImported={(text) => {
          setMessage({ tone: "ok", text });
          router.refresh();
        }}
      />
    </>
  );
}
