import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EnquiryDetail } from "@/components/admin/enquiries/EnquiryDetail";
import { getEnquiry } from "@/lib/data/enquiries";

export const metadata: Metadata = { title: "Enquiry" };

export default async function AdminEnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) notFound();
  return <EnquiryDetail key={enquiry.id} initial={enquiry} />;
}
