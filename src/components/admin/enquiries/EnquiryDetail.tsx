"use client";

import Link from "next/link";
import { useState } from "react";

import { enquiryLabel, enquiryTone, formatDateTime } from "@/components/admin/status";
import { Alert, Button, Field, Panel, PanelTitle, Pill, adminFetch, apiMessage, focusRing, selectClass, textareaClass } from "@/components/admin/ui";
import { enquiryStatuses, type EnquiryRecord, type EnquiryStatus } from "@/lib/data/types";
import { cn } from "@/lib/cn";

/** wa.me link for a phone number; 10-digit Indian numbers get the 91 prefix. */
function whatsappFor(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `https://wa.me/91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return `https://wa.me/${digits.replace(/^0+/, "")}`;
  return null;
}

export function EnquiryDetail({ initial }: { initial: EnquiryRecord }) {
  const [enquiry, setEnquiry] = useState(initial);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>, okText: string) {
    setBusy(true);
    const res = await adminFetch<{ enquiry?: EnquiryRecord }>(`/api/admin/enquiries/${enquiry.id}`, "PATCH", body);
    setBusy(false);
    if (!res.ok || !res.data.enquiry) {
      setStatus({ tone: "error", text: apiMessage(res.data) });
      return false;
    }
    setEnquiry(res.data.enquiry);
    setStatus({ tone: "ok", text: okText });
    return true;
  }

  const whatsapp = enquiry.phone ? whatsappFor(enquiry.phone) : null;
  const tel = enquiry.phone.replace(/[^\d+]/g, "");
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Email", value: <a href={`mailto:${enquiry.email}`} className="text-rd-link underline underline-offset-4">{enquiry.email}</a> },
    {
      label: "Phone",
      value: enquiry.phone ? (
        <a href={`tel:${tel}`} className="text-rd-link underline underline-offset-4">
          {enquiry.phone}
        </a>
      ) : (
        "Not given"
      ),
    },
    { label: "Course / subject", value: enquiry.subject || "General enquiry" },
    { label: "Received", value: formatDateTime(enquiry.createdAt) },
    { label: "Sent from", value: enquiry.sourcePage },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[15px]">
          <Link href="/admin/enquiries" className={cn("font-semibold text-rd-link hover:text-rd-accent", focusRing)}>
            Enquiries
          </Link>
          <span aria-hidden="true" className="text-rd-soft">
            /
          </span>
          <span aria-current="page" className="font-semibold text-rd-ink">
            {enquiry.name}
          </span>
          <Pill tone={enquiryTone[enquiry.status]}>{enquiryLabel(enquiry.status)}</Pill>
        </nav>
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject || "Your enquiry"}`)}`} className={cn("inline-flex min-h-11 items-center rounded-[10px] bg-rd-inverse px-4 text-[15px] font-semibold text-rd-inverse-text hover:bg-rd-inverse-hover", focusRing)}>
            Reply by email
          </a>
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-11 items-center rounded-[10px] border border-ad-field bg-ad-panel px-4 text-[15px] font-semibold text-rd-ink hover:border-rd-ink", focusRing)}>
              WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>

      {status ? <Alert tone={status.tone === "ok" ? "ok" : "error"}>{status.text}</Alert> : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Panel aria-labelledby="en-msg">
            <PanelTitle id="en-msg">Message</PanelTitle>
            <p className="m-0 text-[15.5px] leading-[1.65] whitespace-pre-wrap text-rd-ink">{enquiry.message}</p>
            <dl className="m-0 grid gap-x-6 gap-y-3 border-t border-ad-line-soft pt-3.5 sm:grid-cols-2">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="text-[13px] text-rd-soft">{row.label}</dt>
                  <dd className="m-0 mt-0.5 text-[15px] break-words text-rd-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel aria-labelledby="en-notes">
            <div className="flex items-baseline justify-between gap-3">
              <PanelTitle id="en-notes">Internal notes</PanelTitle>
              <span className="text-[13px] text-rd-soft">Only visible in the admin</span>
            </div>
            {enquiry.notes.length === 0 ? <p className="m-0 text-[14.5px] text-rd-soft">No notes yet.</p> : null}
            <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
              {enquiry.notes.map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-3 rounded-xl border border-ad-line-soft bg-ad-bg p-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[12.5px] text-rd-soft">{formatDateTime(n.at)}</span>
                    <span className="text-[14.5px] whitespace-pre-wrap text-rd-ink">{n.text}</span>
                  </div>
                  <Button size="sm" disabled={busy} aria-label="Delete note" onClick={() => patch({ action: "deleteNote", noteId: n.id }, "Note deleted.")}>
                    Delete
                  </Button>
                </li>
              ))}
            </ol>
            <form
              noValidate
              className="flex flex-col gap-2.5"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!note.trim()) return setNoteError("Write a note first.");
                setNoteError("");
                if (await patch({ action: "note", text: note.trim() }, "Note added.")) setNote("");
              }}
            >
              <Field label="Add a note" htmlFor="en-note" error={noteError}>
                <textarea id="en-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} placeholder="e.g. Called on 26 Oct, will visit on Saturday" className={textareaClass} />
              </Field>
              <Button type="submit" variant="primary" disabled={busy} className="self-start">
                Add note
              </Button>
            </form>
          </Panel>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
          <Panel aria-labelledby="en-status">
            <PanelTitle id="en-status">Status</PanelTitle>
            <Field label="Enquiry status" htmlFor="en-status-select">
              <select
                id="en-status-select"
                value={enquiry.status}
                disabled={busy}
                onChange={(e) => patch({ action: "status", status: e.target.value }, `Status set to ${enquiryLabel(e.target.value as EnquiryStatus)}.`)}
                className={selectClass}
              >
                {enquiryStatuses.map((s) => (
                  <option key={s} value={s}>
                    {enquiryLabel(s)}
                  </option>
                ))}
              </select>
            </Field>
            <span className="text-[13px] text-rd-soft">Last updated {formatDateTime(enquiry.updatedAt)}</span>
          </Panel>
        </aside>
      </div>
    </>
  );
}
