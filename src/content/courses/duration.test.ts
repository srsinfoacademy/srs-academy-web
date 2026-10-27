import { describe, expect, it } from "vitest";

import catalogue from "@/content/courses/courses.json";
import { bucketForMonths, durationBucket, isDurationBucketId, parseDurationMonths } from "@/content/courses/duration";

describe("parseDurationMonths", () => {
  it.each([
    ["1 month", 1],
    ["6 months", 6],
    ["18 months", 18],
    ["1 year", 12],
    ["2 years", 24],
    ["1.5 years", 18],
    ["15 days", 0.5],
    ["30 days", 1],
    ["2 weeks", 14 / 30],
    ["120 hours", 120 / 24 / 30],
    ["1 year 6 months", 18],
    ["Approx. 4–6 months", 6],
    ["3-6 months", 6],
    ["3 to 6 months", 6],
    ["6 Months", 6],
    ["12 mos", 12],
    ["2 yrs", 24],
  ])("%s → %d months", (text, months) => {
    expect(parseDurationMonths(text)).toBeCloseTo(months, 9);
  });

  it.each(["To be confirmed", "", "Flexible", "months", "6", null, undefined])("%j does not parse", (text) => {
    expect(parseDurationMonths(text)).toBeNull();
  });
});

describe("bucketForMonths boundaries", () => {
  it.each([
    [0.5, "under-1-month"],
    [0.999, "under-1-month"],
    [1, "1-3-months"],
    [3, "1-3-months"],
    [3.01, "3-6-months"],
    [6, "3-6-months"],
    [6.5, "6-12-months"],
    [12, "6-12-months"],
    [12.01, "over-1-year"],
    [24, "over-1-year"],
  ])("%d months → %s", (months, bucket) => {
    expect(bucketForMonths(months)).toBe(bucket);
  });
});

describe("durationBucket", () => {
  it.each([
    ["15 days", "under-1-month"],
    ["120 hours", "under-1-month"],
    ["30 days", "1-3-months"],
    ["4 weeks", "under-1-month"],
    ["1 month", "1-3-months"],
    ["3 months", "1-3-months"],
    ["4 months", "3-6-months"],
    ["6 months", "3-6-months"],
    ["9 months", "6-12-months"],
    ["1 year", "6-12-months"],
    ["14 months", "over-1-year"],
    ["2 years", "over-1-year"],
    ["Approx. 4–6 months", "3-6-months"],
  ])("%s → %s", (text, bucket) => {
    expect(durationBucket(text)).toBe(bucket);
  });

  it("returns null for unparseable text", () => {
    expect(durationBucket("To be confirmed")).toBeNull();
  });

  it("buckets every catalogue duration except 'To be confirmed'", () => {
    const unparsed = (catalogue as { duration: string }[]).filter((course) => durationBucket(course.duration) === null);
    expect(unparsed.map((course) => course.duration)).toEqual(["To be confirmed"]);
  });
});

describe("isDurationBucketId", () => {
  it("accepts only the five ids", () => {
    expect(isDurationBucketId("1-3-months")).toBe(true);
    expect(isDurationBucketId("all")).toBe(false);
    expect(isDurationBucketId(null)).toBe(false);
  });
});
