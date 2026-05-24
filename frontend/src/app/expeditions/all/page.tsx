import { ExpeditionsAllGrid } from "@/components/expeditions/all/ExpeditionsAllGrid";
import { ExpeditionsAllHero } from "@/components/expeditions/all/ExpeditionsAllHero";
import { getCatalogExpeditions } from "@/services/content/expeditions";

export const metadata = {
  title: "All Expeditions",
  description:
    "Explore every Afari Trails expedition — curated safari, river, cultural, and wilderness journeys across Zambia.",
};

export default async function AllExpeditionsPage() {
  const expeditions = await getCatalogExpeditions();

  return (
    <>
      <ExpeditionsAllHero />
      <ExpeditionsAllGrid expeditions={expeditions} />
    </>
  );
}
