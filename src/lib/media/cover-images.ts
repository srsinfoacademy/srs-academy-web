/**
 * Course cover uploads: allowed types, size limit, magic-byte detection and
 * file naming. Pure and client-safe; the server re-checks everything.
 *
 * Files are stored in the private Blob store as media/courses/<uuid>.<ext>
 * and served on this site at /media/courses/<uuid>.<ext>.
 */

export const MAX_COVER_BYTES = 5 * 1024 * 1024;

export const coverMimeTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type CoverMime = keyof typeof coverMimeTypes;
export type CoverExt = (typeof coverMimeTypes)[CoverMime];

export const COVER_STORE_PREFIX = "media/courses/";
export const COVER_PUBLIC_PREFIX = "/media/courses/";

export function isCoverMime(value: string | null | undefined): value is CoverMime {
  return typeof value === "string" && value in coverMimeTypes;
}

/** Image type from the first bytes of the file, or null if it isn't JPEG, PNG or WebP. */
export function detectCoverMime(bytes: Uint8Array): CoverMime | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((byte, i) => bytes[i] === byte)) return "image/png";
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

const FILE_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/;

/** True for names this feature generates: a random v4 UUID plus jpg/png/webp. */
export function isCoverFileName(name: string): boolean {
  return FILE_RE.test(name);
}

export function mimeForCoverFile(name: string): CoverMime | null {
  if (!isCoverFileName(name)) return null;
  const ext = name.slice(name.lastIndexOf(".") + 1);
  return (Object.keys(coverMimeTypes) as CoverMime[]).find((mime) => coverMimeTypes[mime] === ext) ?? null;
}

/** Random, safe file name for an upload of this type. */
export function newCoverFileName(mime: CoverMime): string {
  return `${crypto.randomUUID()}.${coverMimeTypes[mime]}`;
}

export const coverStorePath = (fileName: string) => `${COVER_STORE_PREFIX}${fileName}`;
export const coverPublicPath = (fileName: string) => `${COVER_PUBLIC_PREFIX}${fileName}`;

/** File name from a store pathname (media/courses/<file>), or null if it isn't one. */
export function coverFileFromStorePath(pathname: string): string | null {
  if (!pathname.startsWith(COVER_STORE_PREFIX)) return null;
  const name = pathname.slice(COVER_STORE_PREFIX.length);
  return isCoverFileName(name) ? name : null;
}

export type CoverCheck = { ok: true; mime: CoverMime } | { ok: false; error: string };

/**
 * Validates an upload: size, declared MIME type and the actual bytes. The
 * file must start with the signature of the type it claims to be.
 */
export function checkCoverUpload(input: { declaredType: string; size: number; head: Uint8Array }): CoverCheck {
  if (input.size <= 0) return { ok: false, error: "The file is empty." };
  if (input.size > MAX_COVER_BYTES) return { ok: false, error: "The image is larger than 5 MB." };
  if (!isCoverMime(input.declaredType)) return { ok: false, error: "Use a JPG, PNG or WEBP image." };
  const detected = detectCoverMime(input.head);
  if (!detected) return { ok: false, error: "This file isn't a valid JPG, PNG or WEBP image." };
  if (detected !== input.declaredType) return { ok: false, error: "The file's contents don't match its type." };
  return { ok: true, mime: detected };
}
