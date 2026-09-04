import type { Metadata } from "next";

import { Certification } from "@/components/light/home/Certification";
import { CorporateSpotlight } from "@/components/light/home/CorporateSpotlight";
import { CreativeCareersSpotlight } from "@/components/light/home/CreativeCareersSpotlight";
import { FeaturedPrograms } from "@/components/light/home/FeaturedPrograms";
import { FinalCta } from "@/components/light/home/FinalCta";
import { FindYourPath } from "@/components/light/home/FindYourPath";
import { HomeHero } from "@/components/light/home/HomeHero";
import { HowLearningWorks } from "@/components/light/home/HowLearningWorks";
import { HowToJoin } from "@/components/light/home/HowToJoin";
import { InsideSrs } from "@/components/light/home/InsideSrs";
import { LearningModes } from "@/components/light/home/LearningModes";
import { LearningWorlds } from "@/components/light/home/LearningWorlds";
import { LifeAtSrs } from "@/components/light/home/LifeAtSrs";
import { SprsRelationship } from "@/components/light/home/SprsRelationship";

export const metadata: Metadata = {
  title: "Home",
};

export default function LightHomePage() {
  return (
    <>
      <HomeHero />
      <LearningWorlds />
      <FindYourPath />
      <LearningModes />
      <FeaturedPrograms />
      <CreativeCareersSpotlight />
      <CorporateSpotlight />
      <LifeAtSrs />
      <InsideSrs />
      <HowLearningWorks />
      <HowToJoin />
      <Certification />
      <SprsRelationship />
      <FinalCta />
    </>
  );
}
