/** First tab stop on every redesign page. Hidden until focused. */
export function RdSkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute left-4 top-3 z-[60] inline-flex min-h-11 -translate-y-[200%] items-center rounded-[10px] bg-rd-accent px-4 font-rd-sans text-base font-semibold text-rd-on-accent transition-transform focus-visible:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-ink"
    >
      Skip to content
    </a>
  );
}
