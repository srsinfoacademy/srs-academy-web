import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type AlertTone = "info" | "success" | "error";

const toneClass: Record<AlertTone, string> = {
  info: "border-line text-secondary",
  success: "border-[rgb(126_224_166_/_0.4)] text-primary",
  error: "border-[rgb(255_122_107_/_0.5)] text-primary",
};

/** Text label carries the tone, so status never rests on colour alone. */
const toneLabel: Record<AlertTone, string> = {
  info: "Note",
  success: "Success",
  error: "Error",
};

const toneDot: Record<AlertTone, string> = {
  info: "bg-muted",
  success: "bg-success",
  error: "bg-error",
};

export function AlertMessage({
  tone = "info",
  children,
  className,
  ...rest
}: {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-[var(--srs-radius-md)] border p-4",
        toneClass[tone],
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", toneDot[tone])}
      />
      <div className="flex-1">
        <p className="type-index">{toneLabel[tone]}</p>
        <div className="type-body-s mt-1.5">{children}</div>
      </div>
    </div>
  );
}
