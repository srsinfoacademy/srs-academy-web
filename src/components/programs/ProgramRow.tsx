import { cn } from "@/lib/cn";
import { categoryOf, statusLabel } from "@/content/programs";
import type { Program } from "@/types/program";

type ProgramRowProps = {
  program: Program;
  selected: boolean;
  id?: string;
  onSelect: () => void;
};

/**
 * A single program in the catalogue list.
 *
 * Selection is signalled three ways — a lime index, a lime rule down the
 * leading edge and `aria-selected` — so it never rests on colour or hover
 * alone. Hover is a separate, weaker treatment.
 */
export function ProgramRow({ program, selected, id, onSelect }: ProgramRowProps) {
  const category = categoryOf(program);

  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer border-b border-line-hairline last:border-b-0",
        "min-h-16 px-5 py-4 sm:px-6 sm:py-5",
        "transition-[background-color,transform] duration-[var(--srs-duration-fast)] ease-standard",
        selected
          ? "translate-x-1.5 bg-[rgb(216_255_94_/_0.07)]"
          : "hover:translate-x-1 hover:bg-[rgb(242_244_239_/_0.03)]",
      )}
    >
      {/* Selection rule — a second, non-colour-dependent signal. Grows on
          both selection and hover so the affordance reads before the click. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 transition-[width,background-color] duration-[var(--srs-duration-fast)] ease-standard",
          selected ? "w-1 bg-lime" : "w-0.5 bg-transparent group-hover:bg-line-strong",
        )}
      />

      <div className="flex items-baseline gap-4">
        <span className={cn("type-index", selected ? "text-lime" : "text-muted")}>
          {program.num}
        </span>

        <span className="flex-1">
          <span
            className={cn(
              "type-h4 block text-balance",
              selected ? "text-primary" : "text-secondary",
            )}
          >
            {program.name}
          </span>
          {/* Status sits on the meta line rather than in its own column, so a
              long program name keeps the full width of the row. */}
          <span className="type-index mt-1.5 block">
            {category.label} · {program.level} · {statusLabel[program.status]}
          </span>
        </span>
      </div>
    </li>
  );
}
