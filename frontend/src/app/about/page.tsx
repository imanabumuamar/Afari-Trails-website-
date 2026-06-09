import { AboutHero } from "@/components/about/AboutHero";
import { BehindVisionSplit } from "@/components/about/BehindVisionSplit";
import { BrandStory } from "@/components/about/BrandStory";
import { FinalQuote } from "@/components/about/FinalQuote";
import { GetInTouch } from "@/components/about/GetInTouch";
import { PhilosophyWhySplit } from "@/components/about/PhilosophyWhySplit";
import { VisualStrip } from "@/components/about/VisualStrip";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "Built between journeys, landscapes, and stories — the vision behind Afari Trails, rooted in Lusaka and Africa.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BrandStory />
      <VisualStrip />
      <PhilosophyWhySplit />
      <BehindVisionSplit />
      <FinalQuote />
      <GetInTouch />
    </>
  );
}
