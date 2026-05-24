import { ExpeditionsAllGrid } from "@/components/expeditions/all/ExpeditionsAllGrid";
import { ExpeditionsAllHero } from "@/components/expeditions/all/ExpeditionsAllHero";
import { getAllExpeditionsForCatalog } from "@/lib/data/expedition-details";

export const metadata = {
  title: "All Expeditions",
  description:
    "Explore every Afari Trails expedition — curated safari, river, cultural, and wilderness journeys across Zambia.",
};

export default function AllExpeditionsPage() {
  const expeditions = getAllExpeditionsForCatalog();

  return (
    <>
      <ExpeditionsAllHero />
      <ExpeditionsAllGrid expeditions={expeditions} />
    </>
  );
}
