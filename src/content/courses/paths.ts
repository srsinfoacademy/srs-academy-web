/** Client-safe course URL helper (no catalogue import). */
export function coursePath(slug: string): string {
  return `/courses/${slug}`;
}
