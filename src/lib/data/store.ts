import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { BlobNotFoundError, del, get, list, put } from "@vercel/blob";

/**
 * JSON document store.
 *
 * - With `BLOB_READ_WRITE_TOKEN` (Vercel, the srs-academy-admin-data store):
 *   private Vercel Blob objects, read straight from origin (`useCache: false`)
 *   because Next's own cache tags sit in front of every public read.
 * - Without a token outside production: files under `.admin-data/` so the
 *   admin panel works in local dev. That folder is gitignored.
 * - Without a token in production: reads return null (callers fall back to
 *   the bundled content) and writes throw a clear error.
 */

const LOCAL_DIR = path.join(process.cwd(), ".admin-data");

export function storageMode(): "blob" | "local" | "none" {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.NODE_ENV !== "production") return "local";
  return "none";
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Storage is not configured: set BLOB_READ_WRITE_TOKEN (connect a Vercel Blob store).");
    this.name = "StorageNotConfiguredError";
  }
}

function localPath(pathname: string): string {
  const resolved = path.join(LOCAL_DIR, pathname);
  if (!resolved.startsWith(LOCAL_DIR + path.sep)) throw new Error("Invalid document path.");
  return resolved;
}

export async function readJson<T>(pathname: string): Promise<T | null> {
  const mode = storageMode();
  if (mode === "none") return null;
  if (mode === "local") {
    try {
      return JSON.parse(await fs.readFile(localPath(pathname), "utf8")) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
  // Blob occasionally answers 5xx; retry twice before giving up.
  for (let attempt = 1; ; attempt += 1) {
    try {
      const result = await get(pathname, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof BlobNotFoundError) return null;
      if (attempt >= 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }
}

/**
 * For public pages only: when the store can't be read, log and render the
 * bundled content instead of failing the page (or the whole build). Admin
 * screens and saves read without this, so they never treat an outage as
 * "no data" and overwrite the stored document.
 */
export async function withFallback<T>(label: string, read: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error(`Public data: ${label} could not be read from storage; showing the bundled content.`, error);
    return fallback();
  }
}

export async function writeJson(pathname: string, data: unknown): Promise<void> {
  const mode = storageMode();
  if (mode === "none") throw new StorageNotConfiguredError();
  const body = JSON.stringify(data, null, 2);
  if (mode === "local") {
    const file = localPath(pathname);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, body, "utf8");
    return;
  }
  await put(pathname, body, {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export async function deleteJson(pathname: string): Promise<void> {
  const mode = storageMode();
  if (mode === "none") throw new StorageNotConfiguredError();
  if (mode === "local") {
    await fs.rm(localPath(pathname), { force: true });
    return;
  }
  await del(pathname);
}

/** Stores a binary file (e.g. an uploaded image). Never overwrites: names are random. */
export async function putBinary(pathname: string, bytes: Uint8Array, contentType: string): Promise<void> {
  const mode = storageMode();
  if (mode === "none") throw new StorageNotConfiguredError();
  if (mode === "local") {
    const file = localPath(pathname);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, bytes, { flag: "wx" });
    return;
  }
  await put(pathname, Buffer.from(bytes), {
    access: "private",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 31536000,
  });
}

/** Reads a binary file as a stream, or null when it doesn't exist. */
export async function readBinary(pathname: string): Promise<{ stream: ReadableStream<Uint8Array>; size: number } | null> {
  const mode = storageMode();
  if (mode === "none") return null;
  if (mode === "local") {
    try {
      const data = await fs.readFile(localPath(pathname));
      return { stream: new Blob([new Uint8Array(data)]).stream(), size: data.byteLength };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    return { stream: result.stream, size: result.blob.size };
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

/** Reads the first `count` bytes of a stored file (for magic-byte checks). */
export async function readBinaryHead(pathname: string, count = 16): Promise<{ head: Uint8Array; size: number } | null> {
  const file = await readBinary(pathname);
  if (!file) return null;
  const reader = file.stream.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (length < count) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    length += value.length;
  }
  await reader.cancel().catch(() => undefined);
  const head = new Uint8Array(Math.min(length, count));
  let offset = 0;
  for (const chunk of chunks) {
    const take = Math.min(chunk.length, head.length - offset);
    head.set(chunk.subarray(0, take), offset);
    offset += take;
    if (offset >= head.length) break;
  }
  return { head, size: file.size };
}

/** Pathnames under a prefix such as `enquiries/`. */
export async function listPaths(prefix: string): Promise<string[]> {
  const mode = storageMode();
  if (mode === "none") return [];
  if (mode === "local") {
    try {
      const folder = prefix.replace(/\/$/, "");
      const files = await fs.readdir(path.dirname(localPath(`${folder}/index`)));
      return files.filter((file) => file.endsWith(".json")).map((file) => `${folder}/${file}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }
  const paths: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    paths.push(...page.blobs.map((blob) => blob.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return paths;
}

export const docPaths = {
  courses: "data/courses.json",
  categories: "data/categories.json",
  contact: "data/contact.json",
  enquiry: (id: string) => `enquiries/${id}.json`,
  enquiriesPrefix: "enquiries/",
} as const;
