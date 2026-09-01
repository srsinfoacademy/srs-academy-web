/**
 * Outbound arrow used wherever a link leaves the public site. Paired with
 * visually hidden text so the affordance is never colour- or icon-only.
 */
export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 12 12"
      className={className}
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
    >
      <path d="M3.2 8.8 8.8 3.2M4.4 3.2h4.4v4.4" />
    </svg>
  );
}
