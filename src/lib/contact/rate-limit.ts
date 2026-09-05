/**
 * In-memory sliding-window rate limiter for the contact endpoint.
 *
 * This is intentionally the "basic" tier the task calls for, not a
 * production-grade global limiter: a serverless function's module scope
 * (where this Map lives) persists only for the lifetime of one warm
 * instance, and Vercel can run several instances concurrently. In practice
 * this still blocks the overwhelmingly common case — a script or a bot
 * hammering the same instance — without adding an external store (Redis,
 * Upstash, etc.) that this project doesn't otherwise need. If SRS Academy
 * later wants a limiter that holds across every instance/region, that's the
 * natural next step, layered on top of this rather than replacing it.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

/** Evicts old buckets so this doesn't grow unbounded across a long-lived instance. */
function sweep(now: number) {
  for (const [key, timestamps] of hits) {
    const kept = timestamps.filter((t) => now - t < WINDOW_MS);
    if (kept.length === 0) hits.delete(key);
    else hits.set(key, kept);
  }
}

let requestsSinceSweep = 0;

/** Returns true if `key` is currently within its allowed rate. Records the attempt either way. */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();

  requestsSinceSweep += 1;
  if (requestsSinceSweep >= 50) {
    requestsSinceSweep = 0;
    sweep(now);
  }

  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_PER_WINDOW) {
    hits.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return true;
}
