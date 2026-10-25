"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, Button, Dialog, Field, Panel, PanelTitle, Switch, adminFetch, apiMessage, focusRing, inputClass, selectClass } from "@/components/admin/ui";
import { slugify } from "@/lib/data/schemas";
import type { CategoryWithCount } from "@/lib/data/types";
import { cn } from "@/lib/cn";

type FormState = { id: string | null; name: string; slug: string; slugTouched: boolean; visible: boolean };

export function CategoriesManager({ initial }: { initial: CategoryWithCount[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [form, setForm] = useState<FormState | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<CategoryWithCount | null>(null);
  const [reassignTo, setReassignTo] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function send(body: Record<string, unknown>, okText: string, rollback?: CategoryWithCount[]) {
    setBusy(true);
    const res = await adminFetch<{ categories?: CategoryWithCount[] }>("/api/admin/categories", "POST", body);
    setBusy(false);
    if (!res.ok) {
      if (rollback) setCategories(rollback);
      setStatus({ tone: "error", text: apiMessage(res.data) });
      return res;
    }
    if (res.data.categories) setCategories(res.data.categories);
    setStatus({ tone: "ok", text: okText });
    router.refresh();
    return res;
  }

  function reorder(from: number, to: number) {
    if (from === to || to < 0 || to >= categories.length) return;
    const previous = categories;
    const next = [...categories];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setCategories(next);
    void send({ action: "reorder", ids: next.map((c) => c.id) }, `Moved ${moved.name} to position ${to + 1}. The website menu uses this order.`, previous);
  }

  async function saveForm() {
    if (!form) return;
    const name = form.name.trim();
    if (!name) return setFormErrors({ name: "Enter a category name." });
    const body = form.id
      ? { action: "update", id: form.id, name, slug: form.slug, visible: form.visible }
      : { action: "create", name, slug: form.slug, visible: form.visible };
    setFormErrors({});
    const res = await send(body, form.id ? `Saved ${name}.` : `Added ${name}.`);
    if (res.ok) setForm(null);
    else if (res.data.fields) setFormErrors(res.data.fields);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteError("");
    const res = await send(
      { action: "delete", id: deleting.id, ...(deleting.count ? { reassignTo } : {}) },
      deleting.count ? `Deleted ${deleting.name} and moved its ${deleting.count} courses to ${reassignTo}.` : `Deleted ${deleting.name}.`,
    );
    if (res.ok) setDeleting(null);
    else setDeleteError(res.data.fields?.reassignTo ?? apiMessage(res.data));
  }

  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex max-w-[680px] flex-col gap-1">
          <p className="m-0 text-[15px] leading-[1.55] text-rd-body">
            Categories group courses on the website. The order here sets the order of the website course menu and the category
            filters. Hidden categories, and their courses, don&rsquo;t appear on the website.
          </p>
          <span className="text-[13.5px] text-rd-soft">
            {categories.length} categories · {total} courses
          </span>
        </div>
        <Button variant="accent" onClick={() => { setForm({ id: null, name: "", slug: "", slugTouched: false, visible: true }); setFormErrors({}); }}>
          + Add category
        </Button>
      </div>

      {status ? <Alert tone={status.tone === "ok" ? "ok" : "error"}>{status.text}</Alert> : null}

      {form ? (
        <Panel aria-labelledby="cg-form-title">
          <PanelTitle id="cg-form-title">{form.id ? "Edit category" : "Add category"}</PanelTitle>
          <form
            noValidate
            className="flex flex-col gap-3.5"
            onSubmit={(event) => {
              event.preventDefault();
              void saveForm();
            }}
          >
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Category name *" htmlFor="cg-name" error={formErrors.name} hint={form.id ? "Renaming moves this category's courses with it." : undefined}>
                <input
                  id="cg-name"
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slugTouched ? form.slug : slugify(e.target.value) })}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby="cg-name-error"
                  className={inputClass}
                />
              </Field>
              <Field label="URL slug" htmlFor="cg-slug" error={formErrors.slug} hint="Used in /courses?category= links.">
                <input
                  id="cg-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-"), slugTouched: true })}
                  aria-invalid={Boolean(formErrors.slug)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Switch checked={form.visible} onChange={(visible) => setForm({ ...form, visible })} label="Show on website" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setForm(null)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? "Saving…" : "Save category"}
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-ad-line bg-ad-panel">
        <div className="hidden grid-cols-[96px_minmax(0,1fr)_120px_170px_250px] gap-3 border-b border-ad-line bg-ad-head px-4 py-3 text-[12.5px] font-semibold tracking-[0.06em] text-rd-soft md:grid">
          <span>ORDER</span>
          <span>CATEGORY</span>
          <span>COURSES</span>
          <span>ON WEBSITE</span>
          <span className="text-right">ACTIONS</span>
        </div>
        <ol aria-label="Categories in website order" className="m-0 list-none p-0">
          {categories.map((category, index) => (
            <li
              key={category.id}
              draggable={!busy}
              onDragStart={(event) => {
                setDragIndex(index);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", category.id);
              }}
              onDragOver={(event) => {
                if (dragIndex === null) return;
                event.preventDefault();
                setOverIndex(index);
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex !== null) reorder(dragIndex, index);
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={cn(
                "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border-b border-ad-line-soft px-4 py-3 last:border-b-0 md:grid-cols-[96px_minmax(0,1fr)_120px_170px_250px]",
                dragIndex === index && "opacity-50",
                overIndex === index && dragIndex !== index && "bg-ad-head outline-2 -outline-offset-2 outline-rd-link outline-dashed",
              )}
            >
              <span className="flex items-center gap-2.5 text-rd-soft">
                <span aria-hidden="true" title="Drag to reorder" className="cursor-grab text-[18px] leading-none select-none">
                  ⋮⋮
                </span>
                <span className="font-semibold text-rd-ink">{index + 1}</span>
              </span>
              <span className="flex min-w-0 flex-col">
                <span className={cn("truncate font-semibold", category.visible ? "text-rd-ink" : "text-rd-soft")}>{category.name}</span>
                <span className="truncate text-[13px] text-rd-soft">/courses?category={category.slug}</span>
              </span>
              <span className="col-start-2 md:col-start-auto">
                <Link
                  href={`/admin/courses?category=${encodeURIComponent(category.name)}`}
                  className={cn("text-[14.5px] font-semibold text-rd-link hover:text-rd-accent", focusRing)}
                >
                  {category.count} {category.count === 1 ? "course" : "courses"}
                </Link>
                {category.count !== category.publishedCount ? <span className="block text-[12.5px] text-rd-soft">{category.publishedCount} published</span> : null}
              </span>
              <span className="col-start-2 md:col-start-auto">
                <Switch
                  checked={category.visible}
                  disabled={busy}
                  ariaLabel={`Show ${category.name} on website`}
                  label={<span className="text-[14px] font-normal">{category.visible ? "Shown" : "Hidden"}</span>}
                  onChange={(visible) => {
                    const previous = categories;
                    setCategories(categories.map((c) => (c.id === category.id ? { ...c, visible } : c)));
                    void send({ action: "visibility", id: category.id, visible }, `${category.name} is now ${visible ? "shown on" : "hidden from"} the website.`, previous);
                  }}
                />
              </span>
              <span className="col-span-2 flex flex-wrap justify-end gap-1.5 md:col-span-1">
                <Button size="sm" aria-label={`Move ${category.name} up`} disabled={busy || index === 0} onClick={() => reorder(index, index - 1)} className="w-9 px-0">
                  ↑
                </Button>
                <Button size="sm" aria-label={`Move ${category.name} down`} disabled={busy || index === categories.length - 1} onClick={() => reorder(index, index + 1)} className="w-9 px-0">
                  ↓
                </Button>
                <Button
                  size="sm"
                  aria-label={`Edit ${category.name}`}
                  onClick={() => {
                    setForm({ id: category.id, name: category.name, slug: category.slug, slugTouched: true, visible: category.visible });
                    setFormErrors({});
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  aria-label={`Delete ${category.name}`}
                  onClick={() => {
                    setDeleting(category);
                    setReassignTo("");
                    setDeleteError("");
                  }}
                >
                  Delete
                </Button>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="m-0 text-[13.5px] text-rd-soft">Drag rows to reorder, or use the arrow buttons. Each change is saved straight away.</p>

      <Dialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={deleting ? `Delete ${deleting.name}?` : "Delete category"}
        size="sm"
        role="alertdialog"
        footer={
          <>
            <Button className="ml-auto" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={busy || Boolean(deleting?.count && !reassignTo)} onClick={confirmDelete}>
              {deleting?.count ? "Move courses and delete" : "Delete category"}
            </Button>
          </>
        }
      >
        {deleting ? (
          <div className="flex flex-col gap-3.5">
            {deleting.count ? (
              <>
                <p className="m-0 text-[15px] leading-[1.55]">
                  {deleting.name} has {deleting.count} {deleting.count === 1 ? "course" : "courses"}. Choose where to move{" "}
                  {deleting.count === 1 ? "it" : "them"} before the category is deleted.
                </p>
                <Field label="Move courses to" htmlFor="cg-reassign" error={deleteError}>
                  <select id="cg-reassign" value={reassignTo} onChange={(e) => setReassignTo(e.target.value)} className={selectClass}>
                    <option value="">Choose a category…</option>
                    {categories
                      .filter((c) => c.id !== deleting.id)
                      .map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </Field>
              </>
            ) : (
              <>
                <p className="m-0 text-[15px] leading-[1.55]">This category has no courses. It will be removed from the website menu.</p>
                {deleteError ? <Alert>{deleteError}</Alert> : null}
              </>
            )}
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
