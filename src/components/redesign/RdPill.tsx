import { cn } from "@/lib/cn";

const tones = {
  green: "bg-rd-tint-green text-rd-link",
  saffron: "bg-rd-tint-saffron text-rd-eyebrow",
  muted: "bg-rd-muted text-rd-soft",
} as const;

/** Category tag, status notice or count pill. */
export function RdPill({
  children,
  tone = "green",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-rd-sans text-[13px] font-semibold leading-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
