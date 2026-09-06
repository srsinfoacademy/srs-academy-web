export type ResourceType = "Article" | "Guide" | "Download" | "Career";

export type Resource = {
  slug: string;
  title: string;
  type: ResourceType;
  category: string;
  summary: string;
  /** Present for downloads; absent for articles and guides. */
  fileNote?: string;
  /** Article/guide body paragraphs. Absent for a Download resource (nothing to read inline). */
  body?: string[];
};

/**
 * Category set is illustrative in the design and marked "confirm final
 * taxonomy before build", so it is treated as provisional.
 */
export const resourceCategories = [
  "All",
  "Articles",
  "Guides",
  "Downloads",
  "Career Resources",
  "Technology Resources",
  "Academic Resources",
] as const;

/**
 * Resources.
 *
 * The first real set: general, safe guidance derived only from how the site
 * itself already works (the shared course catalogue, admissions, and
 * contact pages) — never a claim about accreditation, external recognition,
 * or career/placement outcomes. No downloadable files exist yet, so nothing
 * here is typed "Download"; that type activates once a real file exists to
 * link to, never before.
 */
export const resources: Resource[] = [
  {
    slug: "how-to-choose-the-right-course",
    title: "How to Choose the Right Course",
    type: "Article",
    category: "Academic Resources",
    summary:
      "A general guide to comparing programs by category, course type, and duration before choosing one.",
    body: [
      "SRS Academy's course catalogue spans several subject areas — technology, business and digital skills, beauty and creative arts, and more. Reviewing a course's category and subcategory on the Programs page is a useful first step toward narrowing your choices to an area you're genuinely interested in.",
      "Course type words like Certificate, Diploma, Advanced Diploma, and Training Program mainly describe the depth and length of a program rather than its subject focus. Two courses in the same subject area can have very different course types, so it's worth comparing duration and listed curriculum topics rather than the title alone.",
      "Each course's detail page lists the curriculum topics, mode, level, eligibility, and other details that SRS Academy has confirmed so far. A section that doesn't appear on a course page simply means that particular detail hasn't been published yet — it isn't a signal that the information doesn't exist or won't be added.",
      "If you're still unsure which course fits your goals, the Admissions and Contact pages are the right place to ask SRS Academy directly before applying.",
    ],
  },
  {
    slug: "online-vs-offline-vs-hybrid-learning",
    title: "Online vs Offline vs Hybrid Learning",
    type: "Article",
    category: "Academic Resources",
    summary:
      "What the online, offline, and hybrid delivery modes generally mean, and how to confirm which applies to a course.",
    body: [
      "Online learning typically means classes and materials are delivered over the internet, offline (in-person) learning happens at a physical location, and hybrid combines both in some proportion. Each has different practical requirements — online generally needs a stable internet connection and a suitable device, while offline learning depends on being able to attend in person.",
      "On this website, a course's mode is only shown once SRS Academy has confirmed it for that specific program — an unlisted mode simply hasn't been confirmed yet, rather than implying a course isn't offered at all.",
      "If a course you're interested in doesn't yet show a confirmed mode, or you want to understand exactly how a particular program is delivered, the Contact page is the right way to ask SRS Academy directly before enrolling.",
    ],
  },
  {
    slug: "preparing-for-your-first-class",
    title: "Preparing for Your First Class",
    type: "Guide",
    category: "Academic Resources",
    summary: "General, practical preparation tips that apply before starting most courses.",
    body: [
      "A few general habits help most learners get more out of their first class, regardless of subject. For an online session, test your internet connection and any required software or accounts ahead of time rather than at the last minute. For an in-person session, confirm the location and timing in advance through SRS Academy's admissions or contact channels.",
      "Before your first class, it's worth re-reading the course's listed curriculum topics on its detail page so you know roughly what to expect and can note down any early questions.",
      "For practical, hands-on courses — such as those in beauty, mehendi, or baking — check whether any personal materials or tools are expected, and confirm this with SRS Academy ahead of time rather than assuming, since exact requirements can vary by course and haven't all been published yet.",
      "Whatever the course, having your questions ready for your instructor or for SRS Academy's admissions team from day one tends to make the first class more useful.",
    ],
  },
  {
    slug: "understanding-course-duration-and-curriculum",
    title: "Understanding Course Duration and Curriculum",
    type: "Article",
    category: "Academic Resources",
    summary:
      "How to read a course's listed duration and curriculum topics, and why some course pages show more detail than others.",
    body: [
      "Each course's duration — shown in months or hours — reflects the length SRS Academy has confirmed for that program. It's shown exactly as verified, so a course listing 'To be confirmed' or omitting a duration simply means that detail hasn't been finalized yet, not that the course lacks a schedule.",
      "Curriculum topics listed on a course page come directly from SRS Academy's confirmed program content. Some courses currently show a longer, more organized list of topics than others — that reflects how much detail has been documented and published so far, not a difference in course quality or seriousness.",
      "If a specific curriculum detail you're looking for isn't listed yet, the Contact page is the best way to ask SRS Academy for the latest information on that course.",
    ],
  },
  {
    slug: "how-to-contact-srs-academy-for-admissions",
    title: "How to Contact SRS Academy for Admissions",
    type: "Guide",
    category: "Academic Resources",
    summary: "Where to go on this website for admissions questions, and what each contact route is for.",
    body: [
      "The Admissions page walks through the general shape of applying to SRS Academy, including eligibility, the required-documents process, fees and payment information, and verification — each confirmed as SRS Academy publishes it.",
      "For a direct question, the Contact page separates enquiries into General Enquiries, Admissions, Support, and Partnerships, so your message reaches the right context. You can also reach SRS Academy by email at srsinfotechacademy@gmail.com.",
      "If you're not yet sure which course you want to ask about, it's fine to reach out with a general enquiry first — SRS Academy will help point you toward the right program and next steps.",
    ],
  },
];

export function resourceBySlug(slug: string): Resource | undefined {
  return resources.find((resource) => resource.slug === slug);
}

/** Two or three others in the same category, for the detail page. */
export function relatedResources(slug: string, limit = 3): Resource[] {
  const current = resourceBySlug(slug);
  if (!current) return [];
  return resources
    .filter((r) => r.slug !== slug && r.category === current.category)
    .slice(0, limit);
}
