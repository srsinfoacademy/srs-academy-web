"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, Button, Field, Panel, PanelTitle, adminFetch, apiMessage, inputClass, textareaClass } from "@/components/admin/ui";
import { contactInputSchema, fieldErrors, type ContactInput } from "@/lib/data/schemas";
import { socialIds, socialLabels } from "@/lib/data/types";
import { cn } from "@/lib/cn";

const socialPlaceholders: Record<(typeof socialIds)[number], string> = {
  instagram: "https://www.instagram.com/…",
  facebook: "https://www.facebook.com/…",
  linkedin: "https://www.linkedin.com/company/…",
  x: "https://x.com/…",
  youtube: "https://www.youtube.com/@…",
  pinterest: "https://www.pinterest.com/…",
};

/** Accepts the embed URL or the whole <iframe> code from Google Maps and keeps only the URL. */
function extractMapUrl(value: string): string {
  const match = value.match(/src=["']([^"']+)["']/i);
  return (match ? match[1] : value).trim().replace(/&amp;/g, "&");
}

const MAP_RE = /^https:\/\/(www\.)?google\.com\/maps\/embed\?\S+$/;

export function ContactEditor({ initial, locationSummary }: { initial: ContactInput; locationSummary: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initial);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  function set<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);
    const parsed = contactInputSchema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setStatus({ tone: "error", text: "Please fix the highlighted fields before saving." });
      const first = Object.keys(errs)[0];
      document.getElementById(first.startsWith("social.") ? `cp-${first.slice(7)}` : `cp-${first}`)?.focus();
      return;
    }
    setErrors({});
    setBusy(true);
    const res = await adminFetch("/api/admin/contact", "PUT", parsed.data);
    setBusy(false);
    if (!res.ok) {
      if (res.data.fields) setErrors(res.data.fields);
      setStatus({ tone: "error", text: apiMessage(res.data, "Saving failed. Try again.") });
      return;
    }
    setValues(parsed.data);
    setSaved(parsed.data);
    setStatus({ tone: "ok", text: "Saved. The footer, Contact page and enquiry section show the new details within a few seconds." });
    router.refresh();
  }

  // Live preview, mirroring the public contact block.
  const digits = values.whatsapp.replace(/\D/g, "");
  const telDigits = values.phone.replace(/\D/g, "");
  const hours = values.hours.filter((row) => row.days || row.time).map((row) => [row.days, row.time].filter(Boolean).join(" ")).join(" · ");
  const previewRows = [
    values.address && { l: "Address", v: values.address },
    values.email && { l: "Email", v: values.email },
    values.phone && { l: "Phone", v: values.phone },
    { l: "Learning", v: locationSummary },
    hours && { l: "Hours", v: hours },
    digits && { l: "WhatsApp", v: values.phone || `+${digits}` },
  ].filter(Boolean) as { l: string; v: string }[];
  const socials = socialIds.filter((id) => values.social[id]?.trim());
  const mapOk = MAP_RE.test(values.mapEmbedUrl);

  return (
    <>
      <p className="m-0 max-w-[680px] text-[15px] leading-[1.55] text-rd-body">
        These details appear on the public Contact page, in the enquiry section and in the website footer. Empty optional fields
        are hidden on the website.
      </p>
      {status ? <Alert tone={status.tone === "ok" ? "ok" : "error"}>{status.text}</Alert> : null}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form noValidate onSubmit={save} className="flex min-w-0 flex-col gap-5">
          <Panel aria-labelledby="cp-details">
            <PanelTitle id="cp-details">Contact details</PanelTitle>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Phone" htmlFor="cp-phone" error={errors.phone} hint="Leave blank to hide every phone and call button.">
                <input id="cp-phone" type="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby="cp-phone-hint cp-phone-error" className={inputClass} />
              </Field>
              <Field label="WhatsApp number" htmlFor="cp-whatsapp" error={errors.whatsapp} hint="Digits with country code, e.g. 918008138008. Blank hides WhatsApp.">
                <input id="cp-whatsapp" type="tel" inputMode="numeric" value={values.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} aria-invalid={Boolean(errors.whatsapp)} aria-describedby="cp-whatsapp-hint cp-whatsapp-error" className={inputClass} />
              </Field>
              <Field label="Public email *" htmlFor="cp-email" error={errors.email}>
                <input id="cp-email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby="cp-email-error" className={inputClass} />
              </Field>
              <Field label="Enquiry notification email *" htmlFor="cp-enquiryEmail" error={errors.enquiryEmail} hint="Website enquiries are emailed here. Not shown on the website.">
                <input id="cp-enquiryEmail" type="email" value={values.enquiryEmail} onChange={(e) => set("enquiryEmail", e.target.value)} aria-invalid={Boolean(errors.enquiryEmail)} aria-describedby="cp-enquiryEmail-hint cp-enquiryEmail-error" className={inputClass} />
              </Field>
            </div>
            <Field label="Address *" htmlFor="cp-address" error={errors.address}>
              <textarea id="cp-address" rows={2} value={values.address} onChange={(e) => set("address", e.target.value)} aria-invalid={Boolean(errors.address)} aria-describedby="cp-address-error" className={textareaClass} />
            </Field>
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-1.5 text-[14.5px] font-semibold text-rd-ink">Office hours</legend>
              {values.hours.map((row, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <label htmlFor={`cp-hours-${index}-days`} className="sr-only">
                    Days, row {index + 1}
                  </label>
                  <input id={`cp-hours-${index}-days`} value={row.days} placeholder="e.g. Monday–Friday" onChange={(e) => set("hours", values.hours.map((r, i) => (i === index ? { ...r, days: e.target.value } : r)))} className={cn(inputClass, "h-10 flex-[1_1_180px]")} />
                  <label htmlFor={`cp-hours-${index}-time`} className="sr-only">
                    Time, row {index + 1}
                  </label>
                  <input id={`cp-hours-${index}-time`} value={row.time} placeholder="e.g. 10 AM–6 PM" onChange={(e) => set("hours", values.hours.map((r, i) => (i === index ? { ...r, time: e.target.value } : r)))} className={cn(inputClass, "h-10 flex-[1_1_140px]")} />
                  <Button size="sm" aria-label={`Remove hours row ${index + 1}`} onClick={() => set("hours", values.hours.filter((_, i) => i !== index))} className="w-9 px-0">
                    ✕
                  </Button>
                </div>
              ))}
              {values.hours.length < 10 ? (
                <Button size="sm" className="self-start" onClick={() => set("hours", [...values.hours, { days: "", time: "" }])}>
                  + Add hours row
                </Button>
              ) : null}
            </fieldset>
          </Panel>

          <Panel aria-labelledby="cp-social">
            <PanelTitle id="cp-social">Social links</PanelTitle>
            <div className="grid gap-3.5 sm:grid-cols-2">
              {socialIds.map((id) => (
                <Field key={id} label={socialLabels[id]} htmlFor={`cp-${id}`} error={errors[`social.${id}`]}>
                  <input
                    id={`cp-${id}`}
                    type="url"
                    value={values.social[id]}
                    placeholder={socialPlaceholders[id]}
                    onChange={(e) => set("social", { ...values.social, [id]: e.target.value })}
                    aria-invalid={Boolean(errors[`social.${id}`])}
                    className={inputClass}
                  />
                </Field>
              ))}
            </div>
            <span className="text-[13px] text-rd-soft">Only the links you fill in are shown on the website.</span>
          </Panel>

          <Panel aria-labelledby="cp-map">
            <PanelTitle id="cp-map">Map</PanelTitle>
            <Field
              label="Google Maps embed URL"
              htmlFor="cp-mapEmbedUrl"
              error={errors.mapEmbedUrl}
              hint="Google Maps → Share → Embed a map. Paste the link or the whole code; only the link is kept. Leave blank to hide the map."
            >
              <textarea
                id="cp-mapEmbedUrl"
                rows={3}
                value={values.mapEmbedUrl}
                onChange={(e) => set("mapEmbedUrl", extractMapUrl(e.target.value))}
                aria-invalid={Boolean(errors.mapEmbedUrl)}
                aria-describedby="cp-mapEmbedUrl-hint cp-mapEmbedUrl-error"
                className={cn(textareaClass, "font-mono text-[13px]")}
              />
            </Field>
          </Panel>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button type="submit" variant="accent" disabled={busy || !dirty}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
            <Button
              disabled={!dirty || busy}
              onClick={() => {
                setValues(saved);
                setErrors({});
                setStatus(null);
              }}
            >
              Discard changes
            </Button>
            <span role="status" className="text-[14px] text-rd-soft">
              {dirty ? "Unsaved changes" : "All changes saved"}
            </span>
          </div>
        </form>

        <aside aria-label="Live preview" className="flex flex-col gap-2.5 xl:sticky xl:top-[88px]">
          <span className="text-[11.5px] font-semibold tracking-[0.08em] text-rd-soft">LIVE PREVIEW · PUBLIC CONTACT BLOCK</span>
          <div className="flex flex-col gap-4 rounded-2xl border border-rd-line bg-rd-bg p-5 text-rd-body">
            <span className="text-[12.5px] font-semibold tracking-[0.12em] text-rd-eyebrow uppercase">Contact us</span>
            <h3 className="m-0 font-rd-display text-[26px] font-medium leading-[1.15] text-rd-ink">Talk to SRS Academy</h3>
            <dl className="m-0 flex flex-col gap-3 border-t border-rd-line pt-3.5">
              {previewRows.map((row) => (
                <div key={row.l}>
                  <dt className="text-[13px] text-rd-soft">{row.l}</dt>
                  <dd className="m-0 mt-0.5 text-[15px] break-words text-rd-ink">{row.v}</dd>
                </div>
              ))}
            </dl>
            {socials.length ? (
              <div className="flex flex-wrap gap-x-3.5 gap-y-1">
                {socials.map((id) => (
                  <a key={id} href={values.social[id]} target="_blank" rel="noopener noreferrer" className="text-[14.5px] text-rd-link underline underline-offset-4">
                    {socialLabels[id]}
                  </a>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {telDigits ? (
                <a href={`tel:+${telDigits}`} className="inline-flex min-h-11 items-center rounded-full bg-rd-accent px-5 text-[15px] font-semibold text-rd-on-accent">
                  Call now
                </a>
              ) : null}
              {digits ? (
                <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-rd-line-strong px-5 text-[15px] font-semibold text-rd-ink">
                  WhatsApp
                </a>
              ) : null}
            </div>
            {mapOk ? (
              <iframe title="Map preview" src={values.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-[4/3] w-full rounded-xl border-0" />
            ) : (
              <div className="rounded-xl border-[1.5px] border-dashed border-rd-line-strong p-5 text-center text-[13.5px] text-rd-soft">
                The map appears here once a Google Maps embed link is added.
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
