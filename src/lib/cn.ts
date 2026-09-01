type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Minimal class-name joiner. Deliberately dependency-free: the public site
 * composes a small, fixed set of variants, so a merge library would cost
 * more bytes than it saves.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }

  return out.join(" ");
}
