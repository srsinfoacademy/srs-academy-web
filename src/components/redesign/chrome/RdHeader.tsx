import { RdButton } from "@/components/redesign/RdButton";
import { RdContainer } from "@/components/redesign/RdContainer";
import { RdCoursesMenu } from "@/components/redesign/chrome/RdCoursesMenu";
import { RdLogo } from "@/components/redesign/chrome/RdLogo";
import { RdMobileMenu } from "@/components/redesign/chrome/RdMobileMenu";
import { RdNavLink } from "@/components/redesign/chrome/RdNavLink";
import { rdEnquireHref, rdPrimaryNav } from "@/content/redesign-nav";
import { site } from "@/content/site";
import { getPublicCatalogue, getPublicCategories, getPublicSrsPrograms } from "@/lib/data/courses";

/**
 * Sticky public header. Server-rendered; the Courses dropdown and the
 * mobile menu are the only client-side pieces. Courses and categories come
 * from the admin data (published, visible, in admin order).
 */
export async function RdHeader() {
  const [programs, categories, catalogue] = await Promise.all([getPublicSrsPrograms(), getPublicCategories(), getPublicCatalogue()]);
  const menuPrograms = programs.map(({ slug, name, duration }) => ({ slug, name, duration }));
  const studentHref = site.portals.student.href;

  return (
    <header className="sticky top-0 z-40 print:hidden border-b border-rd-line bg-rd-bg/95 backdrop-blur-sm">
      <RdContainer className="relative flex h-[72px] items-center justify-between gap-4">
        <RdLogo />

        <nav aria-label="Main" className="hidden items-center gap-0.5 nav:flex min-[1360px]:gap-1">
          {rdPrimaryNav.map((item) =>
            item.isCourses ? (
              <RdCoursesMenu
                key={item.href}
                programs={menuPrograms}
                categories={categories.map(({ category, count }) => ({ category, count }))}
                totalCourses={catalogue.length}
              />
            ) : (
              <RdNavLink key={item.href} href={item.href}>
                {item.label}
              </RdNavLink>
            ),
          )}

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
          <div className="hidden items-center gap-2 min-[600px]:flex">
            {studentHref ? (
              <RdButton href={studentHref} variant="text" className="px-2">
                Student Login
              </RdButton>
            ) : null}
            <RdButton href={rdEnquireHref} variant="accent" className="px-4">
              Enquire Now
            </RdButton>
          </div>
          <RdMobileMenu programs={menuPrograms} studentHref={studentHref} />
        </div>
      </RdContainer>
    </header>
  );
}
