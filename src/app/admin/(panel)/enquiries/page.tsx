import type { Metadata } from "next";

import { EnquiriesList } from "@/components/admin/enquiries/EnquiriesList";
import { StorageNotice } from "@/components/admin/StorageNotice";
import { listEnquiries } from "@/lib/data/enquiries";
import { enquiryStatuses, type EnquiryRecord, type EnquiryStatus } from "@/lib/data/types";

export const metadata: Metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const { status } = await searchParams;
  let enquiries: EnquiryRecord[] = [];
  let failed = false;
  try {
    enquiries = await listEnquiries();
  } catch (error) {
    console.error("Admin enquiries: list failed", error);
    failed = true;
  }
  const initialStatus = enquiryStatuses.includes(status as EnquiryStatus) ? (status as EnquiryStatus) : "all";

  return (
    <>
      <StorageNotice />
      {failed ? (
        <div role="alert" className="rounded-xl border border-ad-alert-line bg-ad-alert-bg px-4 py-3 text-[14.5px] text-ad-alert-fg">
          Enquiries couldn&rsquo;t be loaded from storage. Reload the page to try again.
        </div>
      ) : null}
      <EnquiriesList enquiries={enquiries} initialStatus={initialStatus} />
    </>
  );
}
