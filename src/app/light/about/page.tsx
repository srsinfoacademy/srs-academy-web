import type { Metadata } from "next";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { EditorialSections } from "@/components/light/ui/EditorialSections";
import { LightButton } from "@/components/light/ui/LightButton";
import { aboutPage } from "@/content/pages";
import { lightRoutes } from "@/lib/light/routes";

export const metadata: Metadata = { title: "About" };

export default function LightAboutPage() {
  return (
    <>
      <EditorialHero kicker={aboutPage.kicker} title={aboutPage.title} intro={aboutPage.intro}>
        <div className="mt-6">
          <LightButton href={lightRoutes.courses} variant="dark">
            {aboutPage.ctaLabel}
          </LightButton>
        </div>
      </EditorialHero>
      <EditorialSections sections={aboutPage.sections} />
    </>
  );
}
