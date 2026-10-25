import { cn } from "@/lib/cn";

/**
 * Redesign page gutter. `wide` is the 1360px site frame. `prose` is the
 * narrower measure used for legal and long copy.
 */
export function RdContainer({
  children,
  className,
  width = "wide",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "wide" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[clamp(20px,4vw,56px)]",
        width === "wide" ? "max-w-[1360px]" : "max-w-[820px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
