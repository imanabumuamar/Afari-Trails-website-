import { ExpeditionsAllHero } from "@/components/expeditions/all/ExpeditionsAllHero";
import { ExpeditionsAllPageClient } from "@/components/expeditions/all/ExpeditionsAllPageClient";
import {
  getCatalogExpeditions,
  getExpeditionsContent,
} from "@/services/content/expeditions";

export const metadata = {
  title: "All Expeditions",
  description:
    "Explore every Afari Trails expedition — curated safari, river, cultural, and wilderness journeys across Zambia.",
};

export default async function AllExpeditionsPage() {
  const [expeditions, { allPage }] = await Promise.all([
    getCatalogExpeditions(),
    getExpeditionsContent(),
  ]);

  return (
    <>
      <ExpeditionsAllHero content={allPage} />
      <ExpeditionsAllPageClient expeditions={expeditions} allPage={allPage} />
    </>
  );
}
