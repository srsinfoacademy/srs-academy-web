import type { Metadata } from "next";

import { ContactEditor } from "@/components/admin/ContactEditor";
import { StorageNotice } from "@/components/admin/StorageNotice";
import { site } from "@/content/site";
import { readContact } from "@/lib/data/contact";

export const metadata: Metadata = { title: "Contact Page" };

export default async function AdminContactPage() {
  const contact = await readContact();
  return (
    <>
      <StorageNotice />
      <ContactEditor
        locationSummary={site.contact.locationSummary}
        initial={{
          phone: contact.phone,
          whatsapp: contact.whatsapp,
          email: contact.email,
          address: contact.address,
          hours: contact.hours,
          social: contact.social,
          mapEmbedUrl: contact.mapEmbedUrl,
          enquiryEmail: contact.enquiryEmail,
        }}
      />
    </>
  );
}
