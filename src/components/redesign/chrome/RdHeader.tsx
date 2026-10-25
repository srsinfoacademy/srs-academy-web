import Link from "next/link";

import { RdButton } from "@/components/redesign/RdButton";
import { RdContainer } from "@/components/redesign/RdContainer";
import { RdCoursesMenu } from "@/components/redesign/chrome/RdCoursesMenu";
import { RdLogo } from "@/components/redesign/chrome/RdLogo";
import { RdMobileMenu } from "@/components/redesign/chrome/RdMobileMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getSrsPrograms } from "@/content/courses";
import { rdEnquireHref, rdPrimaryNav } from "@/content/redesign-nav";
import { site } from "@/content/site";

/**
 * Sticky public header. Server-rendered; the Courses dropdown and the
 * mobile menu are the only client-side pieces.
 */
export function RdHeader() {
  const programs = getSrsPrograms();
  const studentHref = site.portals.student.href;

  return (
    <header className="sticky top-0 z-40 border-b border-rd-line bg-rd-bg/95 backdrop-blur-sm">
      <RdContainer className="relative flex h-[72px] items-center justify-between gap-6">
        <RdLogo />

        <nav aria-label="Main" className="hidden items-center gap-1 nav:flex">
          {rdPrimaryNav.map((item) =>
            item.isCourses ? (
              <RdCoursesMenu key={item.href} programs={programs} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-11 rounded-md border-b-2 border-transparent px-2.5 py-2.5 text-[15px] font-medium text-rd-ink transition-colors hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent"
              >
                {item.label}
              </Link>
            ),
          )}

          <ThemeToggle className="ml-2" />
          {studentHref ? (
            <RdButton href={studentHref} variant="secondary" className="ml-2.5 px-3.5 text-[14.5px]">
              Student Login
            </RdButton>
          ) : null}
          <RdButton href={rdEnquireHref} variant="accent" className="ml-1.5 px-[18px] text-[15px]">
            Enquire Now
          </RdButton>
        </nav>

        <div className="flex items-center gap-2 nav:hidden">
          <ThemeToggle />
          <RdMobileMenu programs={programs} studentHref={studentHref} />
        </div>
      </RdContainer>
    </header>
  );
}
