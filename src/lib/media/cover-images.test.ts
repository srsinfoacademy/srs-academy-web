import { describe, expect, it } from "vitest";

import {
  checkCoverUpload,
  coverFileFromStorePath,
  coverPublicPath,
  coverStorePath,
  detectCoverMime,
  isCoverFileName,
  MAX_COVER_BYTES,
  mimeForCoverFile,
  newCoverFileName,
} from "@/lib/media/cover-images";
import { imageUrlSchema } from "@/lib/data/schemas";

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d]);
const WEBP = new Uint8Array([...Buffer.from("RIFF"), 0x24, 0, 0, 0, ...Buffer.from("WEBPVP8 ")]);
const GIF = new Uint8Array([...Buffer.from("GIF89a"), 0, 0, 0, 0, 0, 0]);
const SVG = new Uint8Array(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg">'));

describe("detectCoverMime", () => {
  it("recognises JPEG, PNG and WebP signatures", () => {
    expect(detectCoverMime(JPEG)).toBe("image/jpeg");
    expect(detectCoverMime(PNG)).toBe("image/png");
    expect(detectCoverMime(WEBP)).toBe("image/webp");
  });

  it("rejects other formats and short input", () => {
    expect(detectCoverMime(GIF)).toBeNull();
    expect(detectCoverMime(SVG)).toBeNull();
    expect(detectCoverMime(new Uint8Array([0xff, 0xd8]))).toBeNull();
    expect(detectCoverMime(new Uint8Array([...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WAVE")]))).toBeNull();
  });
});

describe("checkCoverUpload", () => {
  it("accepts a file whose bytes match its declared type", () => {
    expect(checkCoverUpload({ declaredType: "image/png", size: 1000, head: PNG })).toEqual({ ok: true, mime: "image/png" });
  });

  it("rejects a mismatch between declared type and bytes", () => {
    const result = checkCoverUpload({ declaredType: "image/jpeg", size: 1000, head: PNG });
    expect(result.ok).toBe(false);
  });

  it("rejects disallowed types even with valid-looking bytes", () => {
    expect(checkCoverUpload({ declaredType: "image/gif", size: 1000, head: GIF }).ok).toBe(false);
    expect(checkCoverUpload({ declaredType: "image/svg+xml", size: 100, head: SVG }).ok).toBe(false);
  });

  it("rejects a renamed non-image", () => {
    expect(checkCoverUpload({ declaredType: "image/webp", size: 100, head: SVG }).ok).toBe(false);
  });

  it("enforces the 5 MB limit and non-empty files", () => {
    expect(checkCoverUpload({ declaredType: "image/jpeg", size: MAX_COVER_BYTES, head: JPEG }).ok).toBe(true);
    expect(checkCoverUpload({ declaredType: "image/jpeg", size: MAX_COVER_BYTES + 1, head: JPEG }).ok).toBe(false);
    expect(checkCoverUpload({ declaredType: "image/jpeg", size: 0, head: JPEG }).ok).toBe(false);
  });
});

describe("cover file names", () => {
  it("generates random UUID names with the right extension", () => {
    const a = newCoverFileName("image/webp");
    const b = newCoverFileName("image/webp");
    expect(a).not.toBe(b);
    expect(isCoverFileName(a)).toBe(true);
    expect(a.endsWith(".webp")).toBe(true);
    expect(newCoverFileName("image/jpeg").endsWith(".jpg")).toBe(true);
    expect(mimeForCoverFile(newCoverFileName("image/png"))).toBe("image/png");
  });

  it("rejects anything that isn't a generated name", () => {
    for (const name of [
      "../data/courses.json",
      "photo.jpg",
      "6f1c2b9e-1b2c-4d3e-8f90-123456789abc.svg",
      "6f1c2b9e-1b2c-4d3e-8f90-123456789abc.jpg/../x",
      "6F1C2B9E-1B2C-4D3E-8F90-123456789ABC.jpg",
      "",
    ]) {
      expect(isCoverFileName(name)).toBe(false);
      expect(mimeForCoverFile(name)).toBeNull();
    }
  });

  it("maps between store paths and public paths", () => {
    const name = newCoverFileName("image/jpeg");
    expect(coverStorePath(name)).toBe(`media/courses/${name}`);
    expect(coverPublicPath(name)).toBe(`/media/courses/${name}`);
    expect(coverFileFromStorePath(coverStorePath(name))).toBe(name);
    expect(coverFileFromStorePath(`data/${name}`)).toBeNull();
    expect(coverFileFromStorePath("media/courses/../data/courses.json")).toBeNull();
  });

  it("public paths pass the course image URL schema", () => {
    expect(imageUrlSchema.safeParse(coverPublicPath(newCoverFileName("image/webp"))).success).toBe(true);
  });
});
