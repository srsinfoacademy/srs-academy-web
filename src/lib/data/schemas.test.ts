import { describe, expect, it } from "vitest";

import { courseInputSchema, ELIGIBILITY_MAX, importRowSchema } from "@/lib/data/schemas";

const base = {
  name: "Certificate in Tally",
  slug: "certificate-in-tally",
  code: "CT001",
  category: "Computer",
  duration: "3 months",
  level: "",
  summary: "",
  modules: [],
  seoTitle: "",
  seoDescription: "",
  published: true,
};

describe("courseInputSchema eligibility", () => {
  it("defaults to an empty string when missing", () => {
    const parsed = courseInputSchema.parse(base);
    expect(parsed.eligibility).toBe("");
    expect(parsed.coverImage).toBe("");
  });

  it("trims the value", () => {
    expect(courseInputSchema.parse({ ...base, eligibility: "  10th pass, 12th pass  " }).eligibility).toBe("10th pass, 12th pass");
  });

  it(`allows ${ELIGIBILITY_MAX} characters and rejects more`, () => {
    expect(courseInputSchema.safeParse({ ...base, eligibility: "a".repeat(ELIGIBILITY_MAX) }).success).toBe(true);
    const tooLong = courseInputSchema.safeParse({ ...base, eligibility: "a".repeat(ELIGIBILITY_MAX + 1) });
    expect(tooLong.success).toBe(false);
  });

  it("counts length after trimming", () => {
    expect(courseInputSchema.safeParse({ ...base, eligibility: ` ${"a".repeat(ELIGIBILITY_MAX)} ` }).success).toBe(true);
  });
});

describe("importRowSchema eligibility", () => {
  const row = { name: "X", code: "X1", category: "", duration: "", level: "", modules: [] };

  it("is optional with an empty default", () => {
    expect(importRowSchema.parse(row).eligibility).toBe("");
  });

  it("keeps a provided value, trimmed", () => {
    expect(importRowSchema.parse({ ...row, eligibility: " Any graduate " }).eligibility).toBe("Any graduate");
  });
});
