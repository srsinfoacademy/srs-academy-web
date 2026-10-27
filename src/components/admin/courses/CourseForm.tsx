"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  Alert,
  Button,
  ButtonLink,
  Dialog,
  Field,
  Panel,
  PanelTitle,
  Switch,
  adminFetch,
  apiMessage,
  focusRing,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/admin/ui";
import {
  ELIGIBILITY_MAX,
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  SUMMARY_MAX,
  courseInputSchema,
  fieldErrors,
  imageUrlSchema,
  slugify,
  type CourseInput,
} from "@/lib/data/schemas";
import { MAX_COVER_BYTES, isCoverMime } from "@/lib/media/cover-images";
import { cn } from "@/lib/cn";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Beginner to Intermediate"];

export type CourseFormValues = CourseInput & { modules: string[] };

type Props = {
  mode: "new" | "edit";
  id?: string;
  initial: CourseFormValues;
  categories: string[];
  durations: string[];
  origin?: "catalogue" | "srs";
  hasCurriculum?: boolean;
  siteUrl: string;
  savedNotice?: boolean;
  /** "blob": upload straight to Vercel Blob (past the 4.5 MB function limit); "direct": post to the admin route. */
  uploadMode: "blob" | "direct";
};

// Row keys start at 0 per form so the server and client render the same ids.
const withKeys = (modules: string[]) => modules.map((value, index) => ({ key: index, value }));

export function CourseForm({ mode, id, initial, categories, durations, origin, hasCurriculum, siteUrl, savedNotice, uploadMode }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<CourseFormValues>(initial);
  const [modules, setModules] = useState(() => withKeys(initial.modules.length ? initial.modules : mode === "new" ? [""] : []));
  const nextRowKey = useRef(modules.length);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(
    savedNotice ? { tone: "ok", text: "Course created. It is saved and the website has been refreshed." } : null,
  );
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  function set<K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) {
    setDirty(true);
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  }

  function updateModules(next: { key: number; value: string }[]) {
    setDirty(true);
    setModules(next);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= modules.length) return;
    const next = [...modules];
    [next[index], next[target]] = [next[target], next[index]];
    updateModules(next);
  }

  async function save() {
    setStatus(null);
    const payload = { ...values, modules: modules.map((m) => m.value) };
    const parsed = courseInputSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setStatus({ tone: "error", text: "Please fix the highlighted fields before saving." });
      document.getElementById(`cf-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setErrors({});
    setBusy(true);
    const res =
      mode === "new"
        ? await adminFetch<{ course?: { id: string } }>("/api/admin/courses", "POST", parsed.data)
        : await adminFetch<{ course?: { id: string } }>(`/api/admin/courses/${id}`, "PUT", parsed.data);
    setBusy(false);
    if (!res.ok) {
      if (res.data.fields) setErrors(res.data.fields);
      setStatus({ tone: "error", text: apiMessage(res.data, "Saving failed. Try again.") });
      return;
    }
    setDirty(false);
    if (mode === "new" && res.data.course) {
      router.push(`/admin/courses/${res.data.course.id}?saved=1`);
      return;
    }
    setStatus({ tone: "ok", text: "Saved. The website shows the change within a few seconds." });
    router.refresh();
  }

  /** Uploads a cover image and puts its /media/courses/… path in the Cover image URL box. */
  async function uploadCover(file: File) {
    setUploadMessage(null);
    if (!isCoverMime(file.type)) return setUploadMessage({ tone: "error", text: "Use a JPG, PNG or WEBP image." });
    if (file.size > MAX_COVER_BYTES) return setUploadMessage({ tone: "error", text: "The image is larger than 5 MB." });
    setUploading(true);
    try {
      let path: string;
      if (uploadMode === "blob") {
        const prepared = await adminFetch<{ pathname?: string; signature?: string }>("/api/admin/media/courses/client", "POST", {
          action: "prepare",
          contentType: file.type,
          size: file.size,
        });
        if (!prepared.ok || !prepared.data.pathname) throw new Error(apiMessage(prepared.data, "The upload couldn't start."));
        const { upload } = await import("@vercel/blob/client");
        await upload(prepared.data.pathname, file, {
          access: "private",
          contentType: file.type,
          handleUploadUrl: "/api/admin/media/courses/token",
          clientPayload: prepared.data.signature,
        });
        const verified = await adminFetch<{ path?: string }>("/api/admin/media/courses/client", "POST", {
          action: "verify",
          pathname: prepared.data.pathname,
        });
        if (!verified.ok || !verified.data.path) throw new Error(apiMessage(verified.data, "The upload couldn't be checked."));
        path = verified.data.path;
      } else {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/media/courses", { method: "POST", body: form, credentials: "same-origin" });
        const data = (await res.json().catch(() => ({}))) as { path?: string; message?: string; error?: string };
        if (!res.ok || !data.path) throw new Error(apiMessage(data, "The upload failed."));
        path = data.path;
      }
      set("coverImage", path);
      setErrors((prev) => ({ ...prev, coverImage: "" }));
      setUploadMessage({ tone: "ok", text: "Image uploaded. Save the course to use it as the cover." });
    } catch (error) {
      setUploadMessage({ tone: "error", text: error instanceof Error && error.message ? error.message : "The upload failed. Try again." });
    }
    setUploading(false);
  }

  async function remove() {
    setBusy(true);
    const res = await adminFetch(`/api/admin/courses/${id}`, "DELETE");
    setBusy(false);
    setConfirmDelete(false);
    if (!res.ok) return setStatus({ tone: "error", text: apiMessage(res.data, "Deleting failed. Try again.") });
    router.push("/admin/courses");
    router.refresh();
  }

  const levelOptions = values.level && !LEVELS.includes(values.level) ? [values.level, ...LEVELS] : LEVELS;
  const imageValid = values.coverImage && imageUrlSchema.safeParse(values.coverImage).success;
  const seoTitle = values.seoTitle || values.name || "Course name";
  const seoDescription = values.seoDescription || values.summary || "The short description is used when no SEO description is set.";
  const host = siteUrl.replace(/^https?:\/\//, "");

  const actions = (
    <>
      <ButtonLink href="/admin/courses">{dirty ? "Cancel" : "Back to courses"}</ButtonLink>
      <Button variant="accent" onClick={save} disabled={busy}>
        {busy ? "Saving…" : "Save course"}
      </Button>
    </>
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[15px]">
          <Link href="/admin/courses" className={cn("font-semibold text-rd-link hover:text-rd-accent", focusRing)}>
            Courses
          </Link>
          <span aria-hidden="true" className="text-rd-soft">
            /
          </span>
          <span aria-current="page" className="font-semibold text-rd-ink">
            {mode === "new" ? "New course" : initial.name}
          </span>
          {origin === "srs" ? <span className="text-[13px] text-rd-soft">· SRS program</span> : null}
        </nav>
        <div className="flex flex-wrap gap-2">{actions}</div>
      </div>

      {status ? <Alert tone={status.tone === "ok" ? "ok" : "error"}>{status.text}</Alert> : null}

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
        className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="flex min-w-0 flex-col gap-5">
          <Panel aria-labelledby="cf-details">
            <PanelTitle id="cf-details">Course details</PanelTitle>
            <Field label="Course name *" htmlFor="cf-name" error={errors.name}>
              <input id="cf-name" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby="cf-name-error" className={inputClass} />
            </Field>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="URL slug *" htmlFor="cf-slug" error={errors.slug} hint={slugTouched ? "Changing the slug changes the course's web address." : "Filled in from the course name."}>
                <div className="flex min-w-0 items-stretch overflow-hidden rounded-[10px] border border-ad-field bg-ad-panel focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-rd-focus">
                  <span className="flex items-center bg-ad-head px-2.5 text-[14px] text-rd-soft">/courses/</span>
                  <input
                    id="cf-slug"
                    value={values.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }}
                    aria-invalid={Boolean(errors.slug)}
                    aria-describedby="cf-slug-hint cf-slug-error"
                    className="h-[44px] min-w-0 flex-1 bg-transparent px-2.5 text-[15px] text-rd-ink outline-none"
                  />
                </div>
              </Field>
              <Field label="Course code *" htmlFor="cf-code" error={errors.code}>
                <input id="cf-code" value={values.code} onChange={(e) => set("code", e.target.value)} placeholder="e.g. CDEAE053" aria-invalid={Boolean(errors.code)} aria-describedby="cf-code-error" className={cn(inputClass, "font-mono")} />
              </Field>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-3">
              <Field label="Category *" htmlFor="cf-category" error={errors.category}>
                <select id="cf-category" value={values.category} onChange={(e) => set("category", e.target.value)} aria-invalid={Boolean(errors.category)} className={selectClass}>
                  {values.category ? null : <option value="">Choose…</option>}
                  {categories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Duration" htmlFor="cf-duration" error={errors.duration}>
                <input id="cf-duration" list="cf-duration-list" value={values.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 6 months" className={inputClass} />
                <datalist id="cf-duration-list">
                  {durations.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </Field>
              <Field label="Level" htmlFor="cf-level" error={errors.level}>
                <select id="cf-level" value={values.level} onChange={(e) => set("level", e.target.value)} className={selectClass}>
                  <option value="">Not set</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field
              label="Short description"
              htmlFor="cf-summary"
              error={errors.summary}
              aside={
                <span className={values.summary.length > SUMMARY_MAX ? "font-semibold text-rd-danger" : undefined}>
                  {values.summary.length}/{SUMMARY_MAX}
                </span>
              }
              hint="One or two sentences shown at the top of the course page and in search results."
            >
              <textarea id="cf-summary" rows={3} value={values.summary} onChange={(e) => set("summary", e.target.value)} aria-invalid={Boolean(errors.summary)} aria-describedby="cf-summary-hint cf-summary-error" className={textareaClass} />
            </Field>
          </Panel>

          <Panel aria-labelledby="cf-mods">
            <div className="flex items-baseline justify-between gap-3">
              <PanelTitle id="cf-mods">Modules / topics</PanelTitle>
              <span className="text-[13.5px] text-rd-soft">
                {modules.filter((m) => m.value.trim()).length} {modules.filter((m) => m.value.trim()).length === 1 ? "module" : "modules"}
              </span>
            </div>
            {hasCurriculum ? (
              <p className="m-0 text-[14px] text-rd-soft">
                This program also has a detailed curriculum (outcomes and module summaries) kept with the site code. The course page
                shows that curriculum; these lines are used for search and counts.
              </p>
            ) : null}
            {modules.length === 0 ? <p className="m-0 text-[14.5px] text-rd-soft">No modules yet. The course page shows &ldquo;details to be confirmed&rdquo; until you add some.</p> : null}
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {modules.map((module, index) => {
                const label = `Module ${index + 1}`;
                return (
                  <li key={module.key} className="flex items-center gap-2">
                    <span aria-hidden="true" className="w-7 shrink-0 text-right text-[13.5px] font-semibold text-rd-soft">
                      {index + 1}
                    </span>
                    <label htmlFor={`cf-mod-${module.key}`} className="sr-only">
                      {label}
                    </label>
                    <input
                      id={`cf-mod-${module.key}`}
                      value={module.value}
                      onChange={(e) => updateModules(modules.map((m) => (m.key === module.key ? { ...m, value: e.target.value } : m)))}
                      placeholder="Module title"
                      className={cn(inputClass, "h-10 flex-1")}
                    />
                    <Button size="sm" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => move(index, -1)} className="w-9 px-0">
                      ↑
                    </Button>
                    <Button size="sm" aria-label={`Move ${label} down`} disabled={index === modules.length - 1} onClick={() => move(index, 1)} className="w-9 px-0">
                      ↓
                    </Button>
                    <Button size="sm" aria-label={`Remove ${label}`} onClick={() => updateModules(modules.filter((m) => m.key !== module.key))} className="w-9 px-0">
                      ✕
                    </Button>
                  </li>
                );
              })}
            </ol>
            {errors.modules ? <span className="text-[13.5px] text-rd-danger">{errors.modules}</span> : null}
            <Button
              className="self-start"
              onClick={() => {
                const next = [...modules, { key: nextRowKey.current++, value: "" }];
                updateModules(next);
                requestAnimationFrame(() => document.getElementById(`cf-mod-${next[next.length - 1].key}`)?.focus());
              }}
            >
              + Add module
            </Button>
          </Panel>

          <Panel aria-labelledby="cf-seo">
            <PanelTitle id="cf-seo">Search engine (SEO)</PanelTitle>
            <Field
              label="SEO title"
              htmlFor="cf-seoTitle"
              error={errors.seoTitle}
              aside={`${values.seoTitle.length}/${SEO_TITLE_MAX}`}
            >
              <input id="cf-seoTitle" value={values.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Defaults to the course name" className={inputClass} />
            </Field>
            <Field
              label="SEO description"
              htmlFor="cf-seoDescription"
              error={errors.seoDescription}
              aside={`${values.seoDescription.length}/${SEO_DESCRIPTION_MAX}`}
            >
              <textarea id="cf-seoDescription" rows={3} value={values.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder="Defaults to the short description" className={textareaClass} />
            </Field>
            <div className="flex flex-col gap-1 rounded-xl border border-ad-line bg-ad-bg p-3.5">
              <span className="text-[11.5px] font-semibold tracking-[0.08em] text-rd-soft">SEARCH RESULT PREVIEW</span>
              <span className="truncate text-[13px] text-rd-link">
                {host}/courses/{values.slug || "course-slug"}
              </span>
              <span className="truncate text-[17px] font-semibold text-[var(--ad-pill-b-fg)]">{seoTitle}</span>
              <span className="line-clamp-2 text-[14px] text-rd-body">{seoDescription}</span>
            </div>
          </Panel>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
          <Panel aria-labelledby="cf-pub">
            <PanelTitle id="cf-pub">Publishing</PanelTitle>
            <Switch
              checked={values.published}
              onChange={(next) => set("published", next)}
              label={values.published ? "Published" : "Unpublished"}
              description={values.published ? "Shown on the website (when its category is visible)." : "Hidden from the website and the sitemap."}
            />
            {mode === "edit" && initial.published ? (
              <a href={`/courses/${initial.slug}`} target="_blank" rel="noopener noreferrer" className={cn("text-[14px] font-semibold text-rd-link hover:text-rd-accent", focusRing)}>
                View on website ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </Panel>

          <Panel aria-labelledby="cf-elig">
            <PanelTitle id="cf-elig">Eligibility</PanelTitle>
            <Field
              label="Eligibility (optional)"
              htmlFor="cf-eligibility"
              error={errors.eligibility}
              aside={
                <span className={values.eligibility.length > ELIGIBILITY_MAX ? "font-semibold text-rd-danger" : undefined}>
                  {values.eligibility.length}/{ELIGIBILITY_MAX}
                </span>
              }
              hint="Who can join this course. Kept in the admin for now; not shown on the website."
            >
              <input
                id="cf-eligibility"
                value={values.eligibility}
                onChange={(e) => set("eligibility", e.target.value)}
                placeholder="e.g. 10th pass, 12th pass, Any graduate"
                maxLength={ELIGIBILITY_MAX + 50}
                aria-invalid={Boolean(errors.eligibility)}
                aria-describedby="cf-eligibility-hint cf-eligibility-error"
                className={inputClass}
              />
            </Field>
          </Panel>

          <Panel aria-labelledby="cf-img">
            <PanelTitle id="cf-img">Cover image</PanelTitle>
            {imageValid ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-ad-bg">
                <Image src={values.coverImage} alt="Cover image preview" fill unoptimized sizes="340px" className="object-cover" />
              </div>
            ) : null}
            <Field label="Cover image URL (optional)" htmlFor="cf-image" error={errors.coverImage} hint="An https://images.unsplash.com/… link, a site path like /brand/…, or upload an image below. Shown in a 16:9 frame. Leave blank to use the generated category cover.">
              <input id="cf-image" type="url" value={values.coverImage} onChange={(e) => set("coverImage", e.target.value)} aria-invalid={Boolean(errors.coverImage)} aria-describedby="cf-image-hint cf-image-error" className={inputClass} />
            </Field>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="cf-upload"
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-start rounded-[10px] border border-ad-field bg-ad-panel px-4 text-[15px] font-semibold text-rd-ink hover:border-rd-ink",
                  "focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-rd-focus",
                  uploading && "cursor-wait opacity-60",
                )}
              >
                {uploading ? "Uploading…" : "Upload image"}
                <input
                  id="cf-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading}
                  aria-describedby="cf-upload-hint"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void uploadCover(file);
                  }}
                />
              </label>
              <span id="cf-upload-hint" className="text-[13px] leading-snug text-rd-soft">
                JPG, PNG or WEBP, up to 5 MB. Fills in the Cover image URL above.
              </span>
              {uploadMessage ? (
                <span role={uploadMessage.tone === "error" ? "alert" : "status"} className={cn("text-[13.5px]", uploadMessage.tone === "error" ? "text-rd-danger" : "text-rd-link")}>
                  {uploadMessage.text}
                </span>
              ) : null}
            </div>
            {values.coverImage ? (
              <Button size="sm" className="self-start" onClick={() => set("coverImage", "")}>
                Remove cover image
              </Button>
            ) : null}
          </Panel>

          <div className="flex flex-wrap gap-2">{actions}</div>

          {mode === "edit" ? (
            <Panel aria-labelledby="cf-danger">
              <PanelTitle id="cf-danger">Delete course</PanelTitle>
              <p className="m-0 text-[14px] text-rd-soft">Removes the course and its page. To hide it for now, unpublish it instead.</p>
              <Button variant="danger" className="self-start" onClick={() => setConfirmDelete(true)}>
                Delete course
              </Button>
            </Panel>
          ) : null}
        </aside>
      </form>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this course?"
        size="sm"
        role="alertdialog"
        footer={
          <>
            <Button onClick={() => setConfirmDelete(false)} className="ml-auto">
              Cancel
            </Button>
            <Button variant="danger" onClick={remove} disabled={busy}>
              Delete permanently
            </Button>
          </>
        }
      >
        <p className="m-0 text-[15px] leading-[1.55]">
          &ldquo;{initial.name}&rdquo; will be removed from the admin and the website, and its page will stop working. This can&rsquo;t be undone.
        </p>
      </Dialog>
    </>
  );
}
