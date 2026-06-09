import { CategoryBar } from "@/components/expeditions/CategoryBar";
import { ExpeditionApproach } from "@/components/expeditions/ExpeditionApproach";
import { ExpeditionsCTA } from "@/components/expeditions/ExpeditionsCTA";
import { ExpeditionsHero } from "@/components/expeditions/ExpeditionsHero";
import { FeaturedExpeditions } from "@/components/expeditions/FeaturedExpeditions";
import { OurPromise } from "@/components/expeditions/OurPromise";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Expeditions",
  description:
    "Journeys into the wild — curated safari, wilderness, cultural, and private expeditions across Zambia and Africa.",
};

export default function ExpeditionsPage() {
  return (
    <>
      <ExpeditionsHero />
      <OurPromise />
      <CategoryBar />
      <FeaturedExpeditions />
      <ExpeditionApproach />
      <ExpeditionsCTA />
    </>
  );
}
