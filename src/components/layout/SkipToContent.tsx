/**
 * First focusable element on every page. Hidden until focused, then pinned to
 * the top-left as a lime chip with a violet focus ring for contrast against
 * the accent fill.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={[
        "type-index absolute left-[var(--srs-gutter)] top-3 z-[var(--srs-z-skip-link)]",
        "inline-flex h-10 items-center rounded-[var(--srs-radius-md)] px-4",
        "bg-lime text-on-accent font-semibold",
        "-translate-y-[200%] focus-visible:translate-y-0",
        "transition-transform duration-[var(--srs-duration-fast)] ease-entrance",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-soft",
      ].join(" ")}
    >
      Skip to content
    </a>
  );
}
