/**
 * Canonical site configuration.
 *
 * Confirmed facts from SRS Academy live here. Anything marked TODO is still
 * unresolved and must not be invented: no phone number, no Mumbai address,
 * no testimonials, no fees, no student counts, no accreditation claims.
 *
 * PLACEHOLDERS — replace in this file when the real asset or fact arrives:
 * - contact.phone / contact.phoneDigits (hides phone and WhatsApp while empty)
 * - features.showTestimonials (homepage stories stay unrendered while false)
 * - imagery.* (neutral Unsplash stand-ins until academy photography exists)
 * - portals.student / portals.admin (env URLs; hidden when unset)
 *
 * STANDING RULE: features.showFees is permanently false. Do not publish a
 * price, a fee range, or a "fee to be announced" line anywhere on the site.
 * The legal pages may still discuss refunds, because that text was approved
 * as policy rather than as a price list.
 */

export const site = {
  name: "SRS Academy",
  /** Compact wordmark used beside the logo. */
  shortName: "SRS.",
  domain: "www.srstechacademy.com",
  /** Apex redirects to www. Canonicals and the sitemap must use this origin. */
  url: "https://www.srstechacademy.com",
  locale: "en",
  tagline: "Practical technology courses online",
  description:
    "SRS Academy is the training initiative of SPRS INFOTECH PVT LTD, offering practical, technology-focused learning programs online.",
  organisation: {
    legalName: "SPRS INFOTECH PVT LTD",
    relationship:
      "SRS Academy is the academic and training initiative of SPRS INFOTECH PVT LTD, created to extend its practical experience in technology, software development, digital products, and design into structured learning programs.",
    mission:
      "To make practical, technology-focused education accessible to learners who want to build relevant skills, understand modern digital tools, and turn knowledge into real-world capability.",
    vision:
      "To build a modern learning ecosystem where education, technology, practical experience, and continuous skill development work together to prepare learners for an evolving digital world.",
    ceo: "S Roy",
  },
  contact: {
    /** No street line has been supplied. Do not add one, and do not mention Mumbai. */
    address: "Saltlake, Kolkata, West Bengal 700091, India",
    locationSummary: "Online & classroom · Kolkata",
    /**
     * Public academy address. Shown on the contact page, footer, and legal
     * contact lines. This is not the Resend recipient.
     */
    email: "srsinfoacademy@gmail.com",
    /**
     * Inbox that receives enquiry notifications from /api/contact.
     * Keep this pointed at the configured Resend recipient. Do not display it.
     */
    enquiryInbox: "srsinfotechacademy@gmail.com",
    /**
     * TODO: set the confirmed display phone, for example "+91 98765 43210".
     * Leave empty to hide every phone control.
     */
    phone: "",
    /**
     * TODO: digits only, country code included, no plus — used as
     * https://wa.me/{phoneDigits}. Leave empty to hide WhatsApp.
     */
    phoneDigits: "",
    hours: [
      { days: "Monday–Friday", time: "10 AM–6 PM" },
      { days: "Saturday", time: "12–4 PM" },
      { days: "Sunday", time: "Closed" },
    ],
  },
  features: {
    /** Real consented testimonials do not exist yet. */
    showTestimonials: false,
    /** Never flip this to render a price. */
    showFees: false,
  },
  brand: {
    logo: "/brand/srs-logo.png",
    logoRound: "/brand/srs-logo-round.png",
  },
  /**
   * Neutral Unsplash stand-ins. Replace `src` with academy photography and
   * keep the credit until the replacement is an original SRS photo.
   */
  imagery: {
    hero: {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=75",
      alt: "Learners working together on laptops",
      credit: "Photo by Christina @ wocintechchat.com on Unsplash",
      creditHref: "https://unsplash.com/@wocintechchat",
    },
    about: {
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=75",
      alt: "A class listening during a lesson",
      credit: "Photo by NeONBRAND on Unsplash",
      creditHref: "https://unsplash.com/@neonbrand",
    },
    learn: {
      src: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=75",
      alt: "A person joining an online class on a laptop",
      credit: "Photo by Chris Montgomery on Unsplash",
      creditHref: "https://unsplash.com/@cwmonty",
    },
    build: {
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=75",
      alt: "A laptop with code on the screen",
      credit: "Photo by Clément Hélardot on Unsplash",
      creditHref: "https://unsplash.com/@clementhelardot",
    },
    advance: {
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=75",
      alt: "A person presenting work to a small group",
      credit: "Photo by Amy Hirschi on Unsplash",
      creditHref: "https://unsplash.com/@amyhirschi",
    },
    technical: {
      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=75",
      alt: "Code on a computer screen",
      credit: "Photo by Ilya Pavlov on Unsplash",
      creditHref: "https://unsplash.com/@ilyapavlov",
    },
    /** Homepage cards, keyed by course code. Other courses do not need a photo. */
    courses: {
      DLS001: {
        src: "https://images.unsplash.com/photo-1645538165779-81d7f49baa6f?auto=format&fit=crop&w=900&q=75",
        alt: "A learner using a phone outdoors",
        credit: "Photo by SUSHMITA NAG on Unsplash",
        creditHref: "https://unsplash.com/@susnag",
      },
      AIDMS004: {
        src: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=900&q=75",
        alt: "A person planning work on a laptop",
        credit: "Photo by Austin Distel on Unsplash",
        creditHref: "https://unsplash.com/@austindistel",
      },
      CDEAE053: {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=75",
        alt: "Charts and a spreadsheet on a laptop",
        credit: "Photo by Luke Chesser on Unsplash",
        creditHref: "https://unsplash.com/@lukechesser",
      },
      CCSE505: {
        src: "https://images.unsplash.com/photo-1698891667813-b445f80aace7?auto=format&fit=crop&w=900&q=75",
        alt: "People in conversation",
        credit: "Photo by Resume Genius on Unsplash",
        creditHref: "https://unsplash.com/@resumegenius",
      },
      BMC478: {
        src: "https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?auto=format&fit=crop&w=900&q=75",
        alt: "Bridal makeup brushes and colour",
        credit: "Photo by Alok Verma on Unsplash",
        creditHref: "https://unsplash.com/@theweddingfocus",
      },
      CMM478: {
        src: "https://images.unsplash.com/photo-1730003873829-09b4b16444c1?auto=format&fit=crop&w=900&q=75",
        alt: "Mehendi pattern on a hand",
        credit: "Photo by anik das on Unsplash",
        creditHref: "https://unsplash.com/@anik01993",
      },
    },
  },
  portals: {
    student: {
      label: "Student Login",
      href: process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL || undefined,
      pending: "Student portal",
      external: true,
    },
    admin: {
      label: "Admin / Staff Login",
      href: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || undefined,
      pending: "Admin portal",
      external: true,
    },
  },
  copyrightHolder: "SPRS INFOTECH PVT LTD",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/srstechacademy/", icon: "instagram" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61595499163684", icon: "facebook" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/144007343/", icon: "linkedin" },
    { label: "X", href: "https://x.com/srstechacademy", icon: "x" },
    { label: "YouTube", href: "https://www.youtube.com/@srstechacademy", icon: "youtube" },
    { label: "Pinterest", href: "https://www.pinterest.com/srstechacademy/", icon: "pinterest" },
  ],
} as const;

export type SiteImage = {
  src: string;
  alt: string;
  credit: string;
  creditHref: string;
};

/** Display phone, or null when the number is still unconfirmed. */
export function publicPhone(): string | null {
  const phone = site.contact.phone.trim();
  return phone.length > 0 ? phone : null;
}

/** https://wa.me/91XXXXXXXXXX — null until phoneDigits is set. */
export function whatsappHref(): string | null {
  const digits = site.contact.phoneDigits.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function hoursSummary(): string {
  return site.contact.hours.map((row) => `${row.days} ${row.time}`).join(" · ");
}

export type ContactFact = { label: string; value: string; href?: string };

/** Rows safe to render. Phone and WhatsApp are omitted while unconfirmed. */
export function contactFacts(): ContactFact[] {
  const facts: ContactFact[] = [
    { label: "Address", value: site.contact.address },
    { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { label: "Learning", value: site.contact.locationSummary },
    { label: "Hours", value: hoursSummary() },
  ];
  const phone = publicPhone();
  if (phone) {
    facts.splice(2, 0, { label: "Phone", value: phone, href: `tel:${phone}` });
  }
  const whatsapp = whatsappHref();
  if (whatsapp && phone) {
    facts.push({ label: "WhatsApp", value: phone, href: whatsapp });
  }
  return facts;
}
