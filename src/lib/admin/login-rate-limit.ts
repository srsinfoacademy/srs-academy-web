import "server-only";

import { createHash } from "node:crypto";

import { deleteJson, readJson, storageMode, writeJson } from "@/lib/data/store";

/**
 * Durable login lockout: 5 failed attempts from one IP within 15 minutes
 * lock that IP out for 15 minutes. Counters live in the private Blob store
 * (security/login/<hash>.json, the IP hashed with AUTH_SECRET so no raw IP
 * is stored), so they hold across Vercel's serverless instances. A
 * successful sign-in clears the IP's record.
 *
 * If the store can't be reached (or isn't configured) the counters fall
 * back to this instance's memory rather than blocking every sign-in.
 * Concurrent requests can race on the read-modify-write, so a burst may get
 * one or two extra tries; the lockout still lands within the window.
 */

export const MAX_FAILURES = 5;
export const WINDOW_MS = 15 * 60 * 1000;
export const LOCKOUT_MS = 15 * 60 * 1000;

type AttemptRecord = { failures: number[]; lockedUntil: number };

const memory = new Map<string, AttemptRecord>();

function keyFor(ip: string): string {
  return createHash("sha256")
    .update(`admin-login:${ip}:${process.env.AUTH_SECRET ?? ""}`)
    .digest("hex")
    .slice(0, 40);
}

const pathFor = (key: string) => `security/login/${key}.json`;

function storeAvailable(): boolean {
  return storageMode() !== "none";
}

async function load(key: string): Promise<AttemptRecord> {
  if (storeAvailable()) {
    try {
      const stored = await readJson<AttemptRecord>(pathFor(key));
      if (stored) return { failures: stored.failures ?? [], lockedUntil: stored.lockedUntil ?? 0 };
      return memory.get(key) ?? { failures: [], lockedUntil: 0 };
    } catch (error) {
      console.error("Admin login: could not read the attempt counter; using this instance's memory.", error);
    }
  }
  return memory.get(key) ?? { failures: [], lockedUntil: 0 };
}

async function save(key: string, record: AttemptRecord) {
  memory.set(key, record);
  if (!storeAvailable()) return;
  try {
    await writeJson(pathFor(key), record);
  } catch (error) {
    console.error("Admin login: could not save the attempt counter; kept in this instance's memory.", error);
  }
}

/** Seconds until the IP may try again, or 0 when it isn't locked out. */
export async function lockoutRemaining(ip: string): Promise<number> {
  const record = await load(keyFor(ip));
  const remaining = record.lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

/** Records a failed attempt. Returns seconds of lockout when this failure reached the limit, else 0. */
export async function recordFailure(ip: string): Promise<number> {
  const key = keyFor(ip);
  const now = Date.now();
  const record = await load(key);
  const failures = [...record.failures.filter((t) => now - t < WINDOW_MS), now];
  const locked = failures.length >= MAX_FAILURES;
  await save(key, { failures: locked ? [] : failures, lockedUntil: locked ? now + LOCKOUT_MS : 0 });
  return locked ? Math.ceil(LOCKOUT_MS / 1000) : 0;
}

/** Clears the IP's record after a successful sign-in. */
export async function clearFailures(ip: string) {
  const key = keyFor(ip);
  memory.delete(key);
  if (!storeAvailable()) return;
  try {
    await deleteJson(pathFor(key));
  } catch (error) {
    console.error("Admin login: could not clear the attempt counter.", error);
  }
}
