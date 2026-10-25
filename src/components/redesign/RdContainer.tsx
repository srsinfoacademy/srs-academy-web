import { cn } from "@/lib/cn";

/**
 * The fluid site frame: full-width sections, content up to 1600px, gutter
 * clamp(16px, 4vw, 64px). Long-form text sets its own readable measure
 * (e.g. max-w-[72ch]) inside this frame rather than narrowing the page.
 */
export function RdContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1600px] px-[clamp(16px,4vw,64px)]", className)}>{children}</div>;
}
