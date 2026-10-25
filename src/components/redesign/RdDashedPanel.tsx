import { cn } from "@/lib/cn";

/** The design's "not published yet" convention: a 1.5px dashed panel. */
export function RdDashedPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border-[1.5px] border-dashed border-rd-line-strong bg-rd-elevated p-[clamp(22px,3vw,36px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
