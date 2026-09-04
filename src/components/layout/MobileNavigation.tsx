"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Wordmark } from "@/components/layout/Wordmark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { TextLink } from "@/components/ui/TextLink";
import { legalNav, portalNav, primaryNav } from "@/content/navigation";
import { cn } from "@/lib/cn";
import { isRouteActive } from "@/lib/routes";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen mobile navigation.
 *
 * The panel covers the viewport and carries its own `SRS. / Close` bar, so it
 * does not depend on the site header staying visible underneath it.
 *
 * Implements the full dialog contract: Escape to close, focus moved into the
 * panel on open and returned to the trigger on close, focus trapped while
 * open, background scroll locked without losing the reading position, and
 * route changes closing the panel.
 */
export function MobileNavigation() {
  const pathname = usePathname();
  /*
   * The panel is open only for the route it was opened on. Deriving `open`
   * this way means a route change closes it during render, with no effect and
   * no cascading re-render.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /*
   * Reading position at the moment of the click. Captured here rather than in
   * the lock effect because mounting the panel already disturbs the document
   * scroll, so by the time effects run the original position is gone.
   */
  const restoreScrollRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setOpenedOn(null), []);

  /*
   * Scroll lock. The rule lives in the base layer; this supplies the offset
   * that holds the page in place and restores the position on release.
   */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const restoreTo = restoreScrollRef.current;

    body.style.setProperty("--srs-scroll-lock-top", `-${restoreTo}px`);
    body.dataset.scrollLocked = "true";

    return () => {
      delete body.dataset.scrollLocked;
      body.style.removeProperty("--srs-scroll-lock-top");
      // Force a style flush: until the document is scrollable again the
      // browser clamps scrollTo to 0, silently discarding the restore.
      void body.offsetHeight;
      window.scrollTo({ top: restoreTo, behavior: "instant" });
    };
  }, [open]);

  /*
   * Move focus into the panel on open and return it to the trigger on close.
   *
   * `preventScroll` matters: the default focus behaviour scrolls the focused
   * element into view, which would fight the scroll lock.
   */
  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus({ preventScroll: true });
      return;
    }
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
  }, [open]);

  // Escape to close; Tab cycling trapped inside the panel.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const triggerClasses = cn(
    "type-index inline-flex h-11 items-center gap-2 rounded-[var(--srs-radius-sm)] px-2",
    "text-primary transition-colors duration-[var(--srs-duration-fast)] ease-standard",
    "hover:text-lime",
  );

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          restoreScrollRef.current = window.scrollY;
          setOpenedOn(pathname);
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className={triggerClasses}
      >
        <span aria-hidden="true" className="size-[5px] rounded-full bg-muted" />
        Menu
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
              "fixed inset-0 z-[var(--srs-z-overlay)]",
              "overflow-y-auto overscroll-contain bg-bg",
            )}
          >
            <Container className="flex min-h-dvh flex-col">
              <div className="flex h-[var(--srs-header-height)] shrink-0 items-center justify-between">
                <Wordmark />
                <button type="button" onClick={close} className={triggerClasses}>
                  <span aria-hidden="true" className="size-[5px] rounded-full bg-lime" />
                  Close
                </button>
              </div>

              <nav aria-label="Primary" className="pt-4">
                <ul className="flex flex-col">
                  {primaryNav.map((item, i) => {
                    const href = item.href ?? "/";
                    const active = isRouteActive(pathname, href);

                    return (
                      <li key={item.label} className="border-b border-line-hairline">
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "hero-enter flex items-baseline gap-4 py-4",
                            "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                            active ? "text-primary" : "text-secondary",
                          )}
                          style={{ animationDelay: `${i * 32}ms` }}
                        >
                          <span className="type-index w-6 shrink-0 text-lime">{item.index}</span>
                          <span className="type-h3">{item.label}</span>
                          {active ? (
                            <>
                              <span
                                aria-hidden="true"
                                className="size-[5px] shrink-0 self-center rounded-full bg-lime"
                              />
                              <span className="sr-only-srs">(current page)</span>
                            </>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-auto flex flex-col gap-8 py-10">
                {portalNav.href ? (
                  <Button href={portalNav.href} external variant="secondary" block>
                    {portalNav.label}
                  </Button>
                ) : (
                  <Button pending={portalNav.pending ?? ""} variant="secondary" block>
                    {portalNav.label}
                  </Button>
                )}

                <div className="flex flex-col gap-3">
                  <IndexLabel as="p">Legal</IndexLabel>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {legalNav.map((item) => (
                      <li key={item.label}>
                        <TextLink href={item.href} tone="muted" bare className="type-body-s">
                          {item.label}
                        </TextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
