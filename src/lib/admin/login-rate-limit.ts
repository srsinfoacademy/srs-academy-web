/**
 * Login attempts: 5 per 15 minutes per IP. In-memory like the contact
 * limiter (src/lib/contact/rate-limit.ts), so it holds per warm instance;
 * a successful login clears the IP's count.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, number[]>();

function recent(key: string, now: number): number[] {
  return (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
}

/** Records an attempt. Returns seconds until retry when the IP is over the limit, else 0. */
export function takeLoginAttempt(key: string): number {
  const now = Date.now();
  if (attempts.size > 5000) {
    for (const [k, list] of attempts) if (!list.some((t) => now - t < WINDOW_MS)) attempts.delete(k);
  }
  const list = recent(key, now);
  if (list.length >= MAX_ATTEMPTS) {
    attempts.set(key, list);
    return Math.ceil((WINDOW_MS - (now - list[0])) / 1000);
  }
  list.push(now);
  attempts.set(key, list);
  return 0;
}

export function clearLoginAttempts(key: string) {
  attempts.delete(key);
}
