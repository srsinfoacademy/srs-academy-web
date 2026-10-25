"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useTheme } from "@/components/theme/ThemeProvider";
import { focusRing } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import type { ThemeChoice } from "@/lib/theme";

type NavItem = { href: string; label: string; ab: string };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", ab: "DB" },
  { href: "/admin/courses", label: "Courses", ab: "CO" },
  { href: "/admin/categories", label: "Categories", ab: "CA" },
  { href: "/admin/enquiries", label: "Enquiries", ab: "EN" },
  { href: "/admin/contact", label: "Contact Page", ab: "CP" },
  { href: "/admin/settings", label: "Settings", ab: "SE" },
];

/** Planned sections, shown greyed out until they exist. */
const LATER: { label: string; ab: string }[] = [
  { label: "Students", ab: "ST" },
  { label: "Admissions", ab: "AD" },
  { label: "Live Classes", ab: "LC" },
  { label: "Assignments", ab: "AS" },
  { label: "Certificates", ab: "CE" },
  { label: "Content", ab: "CT" },
  { label: "Portal", ab: "PO" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

function titleFor(pathname: string): string {
  if (pathname === "/admin/courses/new") return "Add course";
  if (/^\/admin\/courses\/[^/]+$/.test(pathname)) return "Edit course";
  if (/^\/admin\/enquiries\/[^/]+$/.test(pathname)) return "Enquiry";
  return [...NAV].reverse().find((item) => isActive(pathname, item.href))?.label ?? "Admin";
}

/* Sidebar collapsed state, persisted per browser. */
const SIDEBAR_KEY = "srs-admin-sidebar";
const SIDEBAR_EVENT = "srs-admin-sidebar-change";
function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "collapsed";
  } catch {
    return false;
  }
}
function subscribeCollapsed(cb: () => void) {
  window.addEventListener(SIDEBAR_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(SIDEBAR_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function setCollapsed(value: boolean) {
  try {
    localStorage.setItem(SIDEBAR_KEY, value ? "collapsed" : "expanded");
  } catch {
    /* storage unavailable: state just won't persist */
  }
  window.dispatchEvent(new Event(SIDEBAR_EVENT));
}

const themeIcons: Record<ThemeChoice, React.ReactNode> = {
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
};
const themeLabels: Record<ThemeChoice, string> = { light: "Light theme", dark: "Dark theme", system: "System theme" };

function ThemeSwitch() {
  const { choice, setChoice } = useTheme();
  return (
    <div role="group" aria-label="Colour theme" className="flex rounded-[10px] border border-ad-line bg-ad-panel p-0.5">
      {(["light", "dark", "system"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-label={themeLabels[option]}
          aria-pressed={choice === option}
          title={themeLabels[option]}
          onClick={() => setChoice(option)}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg text-rd-soft hover:text-rd-ink",
            choice === option && "bg-rd-inverse text-rd-inverse-text hover:text-rd-inverse-text",
            focusRing,
          )}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {themeIcons[option]}
          </svg>
        </button>
      ))}
    </div>
  );
}

async function logout() {
  await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }).catch(() => null);
  // Full navigation so no signed-in client state survives logout.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/admin/login");
}

function ProfileMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = email.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Account: ${email}`}
        onClick={() => setOpen((v) => !v)}
        className={cn("flex size-[38px] items-center justify-center rounded-full bg-rd-inverse text-[13px] font-semibold text-rd-inverse-text", focusRing)}
      >
        {initials}
      </button>
      {open ? (
        <div className="absolute top-12 right-0 z-30 flex w-64 flex-col gap-2 rounded-xl border border-ad-line bg-ad-panel p-3 shadow-[var(--rd-shadow-card)]">
          <span className="text-[13px] text-rd-soft">Signed in as</span>
          <span className="truncate text-[14.5px] font-semibold text-rd-ink">{email}</span>
          <Link href="/admin/settings" onClick={() => setOpen(false)} className={cn("rounded-lg px-2 py-2 text-[14.5px] text-rd-ink hover:bg-ad-line-soft", focusRing)}>
            Settings
          </Link>
          <button type="button" onClick={logout} className={cn("rounded-lg border border-ad-line px-2 py-2 text-left text-[14.5px] font-semibold text-rd-ink hover:bg-ad-line-soft", focusRing)}>
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function GlobalSearch({ className, onDone }: { className?: string; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/admin/courses${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
        onDone?.();
      }}
    >
      <label htmlFor={onDone ? "ad-search-m" : "ad-search"} className="sr-only">
        Search courses
      </label>
      <input
        id={onDone ? "ad-search-m" : "ad-search"}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search courses by name or code"
        className={cn("h-10 w-full rounded-[10px] border border-ad-line bg-ad-bg px-3.5 text-[14.5px] text-rd-ink placeholder:text-rd-soft", focusRing)}
      />
    </form>
  );
}

function NavLinks({ pathname, expanded, onNavigate, large }: { pathname: string; expanded: boolean; onNavigate?: () => void; large?: boolean }) {
  return (
    <>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                title={expanded ? undefined : item.label}
                className={cn(
                  "flex items-center gap-3 rounded-[10px] p-2.5 whitespace-nowrap hover:bg-[rgba(255,255,255,.08)] hover:text-ad-white",
                  large ? "min-h-12 text-[16px]" : "text-[14.5px]",
                  active ? "bg-ad-side-active font-semibold text-ad-white" : "text-ad-side-text",
                  focusRing,
                )}
              >
                <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,.08)] text-[11.5px] font-bold">
                  {item.ab}
                </span>
                {expanded ? item.label : <span className="sr-only">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-0.5">
        {expanded ? <span className="px-2.5 pt-3 pb-1 text-[11.5px] font-semibold tracking-[0.08em] text-[#8a93a8] uppercase">Coming later</span> : <span className="mx-2.5 my-2 border-t border-ad-side-line" />}
        <ul aria-label="Coming later" className="m-0 flex list-none flex-col gap-0.5 p-0">
          {LATER.map((item) => (
            <li
              key={item.label}
              title={`${item.label} — coming later`}
              className={cn("flex cursor-not-allowed items-center gap-3 rounded-[10px] p-2.5 whitespace-nowrap text-[#7f889c]", large ? "text-[15px]" : "text-[14px]")}
            >
              <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-dashed border-ad-side-line text-[11px] font-bold">
                {item.ab}
              </span>
              {expanded ? item.label : <span className="sr-only">{item.label} (coming later)</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);
  const expanded = !collapsed;
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    if (drawer && !dialog.open) dialog.showModal();
    if (!drawer && dialog.open) dialog.close();
  }, [drawer]);

  const title = titleFor(pathname);

  return (
    <div className="flex min-h-dvh flex-1">
      <a href="#admin-main" className="sr-only z-50 rounded-lg bg-rd-accent px-4 py-2 text-rd-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col gap-4 overflow-y-auto bg-ad-side px-3 py-[18px] text-ad-side-text transition-[width] duration-200 lg:flex",
          expanded ? "w-[248px]" : "w-[76px]",
        )}
      >
        <Link href="/admin" className={cn("flex items-baseline gap-2 rounded-lg px-2 whitespace-nowrap", focusRing)}>
          <span className="font-rd-display text-[26px] font-semibold text-ad-white">
            SRS<span className="text-[#e9a56e]">.</span>
          </span>
          {expanded ? <span className="text-[13px] font-semibold tracking-[0.06em] text-ad-white">ADMIN</span> : <span className="sr-only">Admin dashboard</span>}
        </Link>
        <nav aria-label="Admin" className="flex flex-col gap-1">
          <NavLinks pathname={pathname} expanded={expanded} />
        </nav>
        <button
          type="button"
          onClick={logout}
          className={cn("mt-auto rounded-[10px] border border-ad-side-line p-2.5 text-left text-[14.5px] whitespace-nowrap text-ad-white hover:bg-[rgba(255,255,255,.08)]", focusRing)}
        >
          {expanded ? "Log out" : <span aria-label="Log out">⎋</span>}
        </button>
      </aside>

      <dialog
        ref={drawerRef}
        aria-label="Admin menu"
        onCancel={(event) => {
          event.preventDefault();
          setDrawer(false);
        }}
        onClick={(event) => event.target === event.currentTarget && setDrawer(false)}
        className="m-0 h-dvh max-h-dvh w-[min(86vw,320px)] max-w-none bg-ad-side p-0 text-ad-white backdrop:bg-[rgba(17,26,46,0.5)] lg:hidden"
      >
        {drawer ? (
          <nav aria-label="Admin" className="flex h-full flex-col gap-1 overflow-y-auto px-3 py-4">
            <div className="flex items-center justify-between px-1.5 pb-2.5">
              <span className="font-rd-display text-[24px] font-semibold">
                SRS<span className="text-[#e9a56e]">.</span> <span className="font-rd-sans text-[13px]">ADMIN</span>
              </span>
              <button type="button" onClick={() => setDrawer(false)} className={cn("min-h-11 rounded-[10px] border border-ad-side-line px-3.5 font-semibold", focusRing)}>
                Close
              </button>
            </div>
            <GlobalSearch className="px-1 pb-2" onDone={() => setDrawer(false)} />
            <NavLinks pathname={pathname} expanded onNavigate={() => setDrawer(false)} large />
            <Link href="/" className={cn("flex min-h-12 items-center rounded-[10px] px-3 text-[16px] text-[#e9a56e]", focusRing)}>
              View website
            </Link>
            <button type="button" onClick={logout} className={cn("mt-2 min-h-12 rounded-[10px] border border-ad-side-line text-[16px]", focusRing)}>
              Log out
            </button>
          </nav>
        ) : null}
      </dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-ad-line bg-ad-panel">
          <div className="flex h-16 items-center gap-3 px-[clamp(14px,2.4vw,28px)]">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={expanded}
              className={cn("hidden size-10 items-center justify-center rounded-[10px] border border-ad-line text-rd-ink lg:flex", focusRing)}
            >
              <span aria-hidden="true">☰</span>
            </button>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-expanded={drawer}
              className={cn("min-h-11 rounded-[10px] border border-ad-field px-3.5 font-semibold text-rd-ink lg:hidden", focusRing)}
            >
              Menu
            </button>
            <h1 className="m-0 min-w-0 flex-1 truncate text-[19px] font-semibold text-rd-ink">{title}</h1>
            <GlobalSearch className="hidden w-[min(32vw,360px)] md:block" />
            <ThemeSwitch />
            <Link href="/" className={cn("hidden text-[14px] font-semibold text-rd-link hover:text-rd-accent xl:inline", focusRing)}>
              View website
            </Link>
            <ProfileMenu email={email} />
          </div>
        </header>
        <main id="admin-main" className="flex w-full flex-col gap-5 p-[clamp(14px,2.4vw,28px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
