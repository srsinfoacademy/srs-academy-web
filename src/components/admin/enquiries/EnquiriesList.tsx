"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { dateStamp, downloadCsv } from "@/components/admin/csv";
import { enquiryLabel, enquiryTone, formatDateTime } from "@/components/admin/status";
import { Button, Pill, focusRing, inputClass } from "@/components/admin/ui";
import { enquiryStatuses, type EnquiryRecord, type EnquiryStatus } from "@/lib/data/types";
import { cn } from "@/lib/cn";

const PER_PAGE = 25;

type Filter = "all" | EnquiryStatus;

export function EnquiriesList({ enquiries, initialStatus }: { enquiries: EnquiryRecord[]; initialStatus: Filter }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>(initialStatus);
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const out: Record<Filter, number> = { all: enquiries.length, new: 0, contacted: 0, "follow-up": 0, closed: 0 };
    for (const enquiry of enquiries) out[enquiry.status] += 1;
    return out;
  }, [enquiries]);

  const filtered = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return enquiries.filter((enquiry) => {
      if (filter !== "all" && enquiry.status !== filter) return false;
      const hay = `${enquiry.name} ${enquiry.email} ${enquiry.phone} ${enquiry.subject} ${enquiry.message}`.toLowerCase();
      return words.every((word) => hay.includes(word));
    });
  }, [enquiries, q, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function exportCsv() {
    downloadCsv(`srs-enquiries-${dateStamp()}.csv`, [
      ["Received", "Name", "Email", "Phone", "Course / subject", "Message", "Status", "Source page", "Notes"],
      ...filtered.map((e) => [
        formatDateTime(e.createdAt),
        e.name,
        e.email,
        e.phone,
        e.subject,
        e.message,
        enquiryLabel(e.status),
        e.sourcePage,
        e.notes.map((note) => `${formatDateTime(note.at)}: ${note.text}`).join(" | "),
      ]),
    ]);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="m-0 max-w-[680px] text-[15px] leading-[1.55] text-rd-body">
          Messages sent through the website enquiry form. Each one is also emailed to the enquiry notification address set on
          the Contact Page screen.
        </p>
        <Button onClick={exportCsv} disabled={filtered.length === 0}>
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-ad-line bg-ad-panel p-3.5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1.5">
            <label htmlFor="en-q" className="text-[14px] font-semibold text-rd-ink">
              Search
            </label>
            <input
              id="en-q"
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Name, email, phone, course or message"
              className={inputClass}
            />
          </div>
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {(["all", ...enquiryStatuses] as Filter[]).map((option) => {
              const active = filter === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(option);
                    setPage(1);
                    const params = new URLSearchParams(window.location.search);
                    if (option === "all") params.delete("status");
                    else params.set("status", option);
                    window.history.replaceState(null, "", params.size ? `?${params}` : window.location.pathname);
                  }}
                  className={cn(
                    "min-h-10 rounded-full border px-3.5 text-[14px] font-semibold",
                    active ? "border-rd-inverse bg-rd-inverse text-rd-inverse-text" : "border-ad-field bg-ad-panel text-rd-ink hover:border-rd-ink",
                    focusRing,
                  )}
                >
                  {option === "all" ? "All" : enquiryLabel(option)} <span className="font-normal opacity-80">({counts[option]})</span>
                </button>
              );
            })}
          </div>
        </div>

        <span aria-live="polite" className="text-[14px] font-semibold text-rd-body">
          {filtered.length === enquiries.length ? `${enquiries.length} enquiries` : `Showing ${filtered.length} of ${enquiries.length}`}
        </span>

        {enquiries.length === 0 ? (
          <div className="rounded-xl border-[1.5px] border-dashed border-ad-field p-7 text-center text-rd-soft">
            No enquiries yet. They appear here as soon as someone sends the website enquiry form.
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-ad-field p-7 text-center">
            <span className="font-semibold text-rd-ink">No enquiries match</span>
            <Button
              variant="primary"
              onClick={() => {
                setQ("");
                setFilter("all");
              }}
            >
              Clear search and filters
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-xl border border-ad-line-soft md:block">
              <table className="w-full min-w-[860px] border-collapse text-[14.5px]">
                <thead>
                  <tr className="bg-ad-head text-left text-[12.5px] tracking-[0.06em] text-rd-soft">
                    {["NAME", "COURSE / SUBJECT", "CONTACT", "RECEIVED", "STATUS"].map((h) => (
                      <th key={h} scope="col" className="border-b border-ad-line px-3.5 py-3 font-semibold">
                        {h}
                      </th>
                    ))}
                    <th scope="col" className="border-b border-ad-line px-3.5 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => (
                    <tr key={e.id} className="border-b border-ad-line-soft hover:bg-ad-hover">
                      <td className="px-3.5 py-2.5 font-semibold text-rd-ink">{e.name}</td>
                      <td className="max-w-[320px] truncate px-3.5 py-2.5 text-rd-body">{e.subject || "General enquiry"}</td>
                      <td className="px-3.5 py-2.5 text-rd-body">
                        <span className="block">{e.email}</span>
                        {e.phone ? <span className="block text-[13px] text-rd-soft">{e.phone}</span> : null}
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-rd-body">{formatDateTime(e.createdAt)}</td>
                      <td className="px-3.5 py-2.5">
                        <Pill tone={enquiryTone[e.status]}>{enquiryLabel(e.status)}</Pill>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <Link
                          href={`/admin/enquiries/${e.id}`}
                          aria-label={`Open enquiry from ${e.name}`}
                          className={cn("inline-flex min-h-9 items-center rounded-lg border border-ad-field px-3 text-[14px] font-semibold text-rd-ink hover:border-rd-ink", focusRing)}
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 md:hidden">
              {rows.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className={cn("flex flex-col gap-1.5 rounded-xl border border-ad-line bg-ad-panel p-3", focusRing)}>
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-rd-ink">{e.name}</span>
                      <Pill tone={enquiryTone[e.status]}>{enquiryLabel(e.status)}</Pill>
                    </span>
                    <span className="text-[14px] text-rd-body">{e.subject || "General enquiry"}</span>
                    <span className="text-[13px] text-rd-soft">
                      {e.email}
                      {e.phone ? ` · ${e.phone}` : ""} · {formatDateTime(e.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {pageCount > 1 ? (
              <nav aria-label="Pagination" className="flex items-center justify-end gap-2">
                <Button size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
                  ‹ Prev
                </Button>
                <span className="text-[14px] text-rd-soft">
                  Page {current} of {pageCount}
                </span>
                <Button size="sm" disabled={current === pageCount} onClick={() => setPage(current + 1)}>
                  Next ›
                </Button>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
