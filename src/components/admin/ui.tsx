"use client";

import Link from "next/link";
import { forwardRef, useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Small admin UI kit following SRS-Admin-Panel.dc.html: 10px radius
 * controls, 46px fields, navy primary, saffron accent for the main action.
 * Colours only through rd-* / ad-* tokens so Light / Dark both work.
 */

export const focusRing =
  "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-focus";

export const inputClass = cn(
  "h-[46px] w-full min-w-0 rounded-[10px] border border-ad-field bg-ad-panel px-3.5 text-[15.5px] text-rd-ink placeholder:text-rd-soft aria-[invalid=true]:border-rd-danger",
  focusRing,
);
export const selectClass = cn(inputClass, "px-2.5 text-[15px]");
export const textareaClass = cn(inputClass, "h-auto py-2.5 leading-[1.5]");

type ButtonVariant = "primary" | "accent" | "secondary" | "danger" | "ghost" | "link";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-rd-inverse text-rd-inverse-text hover:bg-rd-inverse-hover",
  accent: "bg-rd-accent text-rd-on-accent hover:bg-rd-accent-hover",
  secondary: "border border-ad-field bg-ad-panel text-rd-ink hover:border-rd-ink",
  danger: "bg-rd-danger text-rd-bg hover:opacity-90",
  ghost: "text-rd-ink hover:bg-ad-line-soft",
  link: "min-h-0 px-0 font-semibold text-rd-link underline-offset-4 hover:text-rd-accent hover:underline",
};

export function buttonClass(variant: ButtonVariant = "secondary", size: "md" | "sm" = "md") {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-55",
    variant !== "link" && (size === "md" ? "min-h-11 px-4 text-[15px]" : "min-h-9 rounded-lg px-3 text-[14px]"),
    buttonVariants[variant],
    focusRing,
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { variant?: ButtonVariant; size?: "md" | "sm" }
>(function Button({ variant = "secondary", size = "md", className, type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={cn(buttonClass(variant, size), className)} {...props} />;
});

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: "md" | "sm" }) {
  return <Link className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function Panel({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("flex flex-col gap-3.5 rounded-2xl border border-ad-line bg-ad-panel p-5", className)} {...props} />;
}

export function PanelTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("m-0 text-[17px] font-semibold text-rd-ink", className)} {...props} />;
}

export type PillTone = "g" | "s" | "b" | "n";

const pillTones: Record<PillTone, string> = {
  g: "bg-[var(--ad-pill-g-bg)] text-[var(--ad-pill-g-fg)]",
  s: "bg-[var(--ad-pill-s-bg)] text-[var(--ad-pill-s-fg)]",
  b: "bg-[var(--ad-pill-b-bg)] text-[var(--ad-pill-b-fg)]",
  n: "bg-[var(--ad-pill-n-bg)] text-[var(--ad-pill-n-fg)]",
};

export function Pill({ tone = "n", children, className }: { tone?: PillTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold whitespace-nowrap", pillTones[tone], className)}>
      {children}
    </span>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  aside,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[14.5px] font-semibold text-rd-ink">
          {label}
        </label>
        {aside ? <span className="text-[13px] text-rd-soft">{aside}</span> : null}
      </div>
      {children}
      {hint ? (
        <span id={`${htmlFor}-hint`} className="text-[13px] leading-snug text-rd-soft">
          {hint}
        </span>
      ) : null}
      <span id={`${htmlFor}-error`} className="text-[13.5px] text-rd-danger" aria-live="polite">
        {error}
      </span>
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  ariaLabel,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn("flex min-h-10 items-center gap-3 rounded-[10px] text-left disabled:opacity-55", focusRing)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative h-6 w-[42px] shrink-0 rounded-full transition-colors",
          checked ? "bg-rd-link" : "bg-ad-field",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] size-[18px] rounded-full bg-ad-white shadow transition-[left]",
            checked ? "left-[21px]" : "left-[3px]",
          )}
        />
      </span>
      {label || description ? (
        <span className="flex flex-col">
          {label ? <span className="text-[15px] font-semibold text-rd-ink">{label}</span> : null}
          {description ? <span className="text-[13px] text-rd-soft">{description}</span> : null}
        </span>
      ) : null}
    </button>
  );
}

export function Alert({ tone = "error", children, className }: { tone?: "error" | "note" | "ok"; children: ReactNode; className?: string }) {
  const tones = {
    error: "border-ad-alert-line bg-ad-alert-bg text-ad-alert-fg",
    note: "border-ad-note-line bg-ad-note-bg text-ad-note-fg",
    ok: "border-ad-ok-line bg-ad-ok-bg text-ad-ok-fg",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-[14.5px] leading-[1.5]", tones[tone], className)}>
      {children}
    </div>
  );
}

/**
 * Modal built on <dialog>: showModal() gives the focus trap, Escape and
 * inert background. `onClose` runs for Escape, the Close button and a
 * backdrop click.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  role = "dialog",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  role?: "dialog" | "alertdialog";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      role={role}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-auto max-h-[min(92dvh,900px)] w-[calc(100%-24px)] overflow-hidden rounded-2xl border border-ad-line bg-ad-panel p-0 text-rd-body shadow-[var(--rd-shadow-raised)] backdrop:bg-[rgba(17,26,46,0.55)]",
        size === "sm" ? "max-w-[460px]" : size === "md" ? "max-w-[620px]" : "max-w-[960px]",
      )}
    >
      {open ? (
        <div className="flex max-h-[min(92dvh,900px)] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-ad-line px-5 py-4">
            <h2 id={titleId} className="m-0 text-[18px] font-semibold text-rd-ink">
              {title}
            </h2>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer ? <div className="flex flex-wrap items-center gap-2 border-t border-ad-line px-5 py-3.5">{footer}</div> : null}
        </div>
      ) : null}
    </dialog>
  );
}

export function SrOnly({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/** POST/PUT/DELETE helper for the admin API. Returns parsed JSON; never throws. */
export async function adminFetch<T = Record<string, unknown>>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<{ ok: boolean; status: number; data: T & { error?: string; message?: string; fields?: Record<string, string> } }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (res.status === 401 && typeof window !== "undefined") {
      // Full navigation on purpose: the session cookie has expired.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "network", message: "Network error. Check your connection and try again." } as never };
  }
}

/** Readable message for an admin API failure. */
export function apiMessage(data: { error?: string; message?: string }, fallback = "Something went wrong. Try again."): string {
  if (data.message) return data.message;
  switch (data.error) {
    case "validation":
      return "Please fix the highlighted fields.";
    case "storage_not_configured":
      return "Storage isn't configured (BLOB_READ_WRITE_TOKEN).";
    case "forbidden":
      return "Request blocked: it didn't come from this site.";
    case "not_found":
      return "That item no longer exists. Reload the page.";
    default:
      return fallback;
  }
}
