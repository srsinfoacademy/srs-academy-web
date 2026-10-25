import type { Metadata } from "next";
import Link from "next/link";

import { StorageNotice } from "@/components/admin/StorageNotice";
import { enquiryLabel, enquiryTone, formatDateTime } from "@/components/admin/status";
import { Panel, PanelTitle, Pill } from "@/components/admin/ui";
import { readCategories, readCourses, withCounts } from "@/lib/data/courses";
import { countByStatus, listEnquiries } from "@/lib/data/enquiries";
import type { EnquiryRecord } from "@/lib/data/types";

export const metadata: Metadata = { title: "Dashboard" };

const cardClass =
  "flex flex-col gap-1 rounded-[14px] border border-ad-line bg-ad-panel px-[18px] py-4 text-rd-ink hover:border-ad-field focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-focus";

export default async function AdminDashboardPage() {
  const courses = await readCourses();
  const categories = withCounts(await readCategories(courses), courses);
  let enquiries: EnquiryRecord[] = [];
  let enquiryError = false;
  try {
    enquiries = await listEnquiries();
  } catch (error) {
    console.error("Dashboard: could not list enquiries", error);
    enquiryError = true;
  }

  const catalogue = courses.filter((course) => course.origin === "catalogue").length;
  const srs = courses.length - catalogue;
  const published = courses.filter((course) => course.published).length;
  const statusCounts = countByStatus(enquiries);
  const maxCount = Math.max(1, ...categories.map((category) => category.count));

  const stats = [
    { label: "Courses", value: courses.length, note: `${catalogue} catalogue · ${srs} SRS programs`, href: "/admin/courses" },
    { label: "Published", value: published, note: `${courses.length - published} unpublished`, href: "/admin/courses?status=published" },
    {
      label: "Categories",
      value: categories.length,
      note: `${categories.filter((category) => !category.visible).length} hidden on website`,
      href: "/admin/categories",
    },
    {
      label: "New enquiries",
      value: enquiryError ? "—" : statusCounts.new,
      note: enquiryError ? "Couldn't load enquiries" : `${enquiries.length} total`,
      href: "/admin/enquiries?status=new",
    },
  ];

  return (
    <>
      <StorageNotice />
      <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))]">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={cardClass}>
            <span className="text-[13.5px] text-rd-soft">{stat.label}</span>
            <span className="font-rd-display text-[32px] font-medium">{stat.value}</span>
            <span className="text-[12.5px] text-rd-eyebrow">{stat.note}</span>
          </Link>
        ))}
      </div>

      <div className="grid items-start gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <Panel aria-labelledby="dash-recent">
          <div className="flex items-baseline justify-between gap-3">
            <PanelTitle id="dash-recent">Recent enquiries</PanelTitle>
            <Link href="/admin/enquiries" className="font-semibold text-rd-link hover:text-rd-accent">
              View all
            </Link>
          </div>
          {enquiryError ? (
            <p className="m-0 text-[14.5px] text-rd-danger">Enquiries couldn&rsquo;t be loaded from storage. Reload to try again.</p>
          ) : enquiries.length === 0 ? (
            <p className="m-0 text-[14.5px] text-rd-soft">
              No enquiries yet. Messages sent through the website enquiry form will appear here.
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {enquiries.slice(0, 6).map((enquiry) => (
                <li key={enquiry.id} className="border-t border-ad-line-soft first:border-t-0">
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="flex items-start justify-between gap-3 rounded-lg py-2.5 hover:bg-ad-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-rd-focus"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-[14.5px] font-semibold text-rd-ink">{enquiry.name}</span>
                      <span className="truncate text-[13.5px] text-rd-soft">{enquiry.subject || "General enquiry"}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <Pill tone={enquiryTone[enquiry.status]}>{enquiryLabel(enquiry.status)}</Pill>
                      <span className="text-[12.5px] text-rd-soft">{formatDateTime(enquiry.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel aria-labelledby="dash-cats">
          <div className="flex items-baseline justify-between gap-3">
            <PanelTitle id="dash-cats">Courses by category</PanelTitle>
            <Link href="/admin/categories" className="font-semibold text-rd-link hover:text-rd-accent">
              Manage
            </Link>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {categories.map((category) => (
              <li key={category.id} className="flex flex-col gap-1">
                <div className="flex justify-between gap-3 text-[14px] text-rd-ink">
                  <span>
                    {category.name}
                    {!category.visible ? <span className="ml-2 text-[12.5px] text-rd-soft">(hidden)</span> : null}
                  </span>
                  <span className="font-semibold">{category.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ad-line-soft">
                  <div className="h-full rounded-full bg-rd-inverse" style={{ width: `${(category.count / maxCount) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
