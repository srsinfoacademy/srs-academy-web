export function LightSkipToContent() {
  return (
    <a
      href="#light-main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-[var(--radius-sl-sm)] focus:bg-sl-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-sl-paper"
    >
      Skip to content
    </a>
  );
}
