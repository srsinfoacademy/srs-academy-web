import { FinalCta } from "@/components/home/FinalCta";
import { HomeHero } from "@/components/home/HomeHero";
import { LearningJourney } from "@/components/home/LearningJourney";
import { Manifesto } from "@/components/home/Manifesto";
import { PortalTeaser } from "@/components/home/PortalTeaser";
import { Programs } from "@/components/home/Programs";
import { Statistics } from "@/components/home/Statistics";
import { SystemStages } from "@/components/home/SystemStages";

/**
 * SRS Academy homepage.
 *
 * Server-rendered throughout; only the hero network, the program explorer and
 * the program accordion are client components, because only they carry
 * interaction.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Manifesto />
      <SystemStages />
      <Programs />
      <LearningJourney />
      <Statistics />
      <PortalTeaser />
      <FinalCta />
    </>
  );
}
