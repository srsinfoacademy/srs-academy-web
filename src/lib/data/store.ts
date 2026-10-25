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
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
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
