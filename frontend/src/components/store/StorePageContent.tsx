import { CuratedEssentials } from "@/components/store/CuratedEssentials";
import { FeaturedCollectionsGrid } from "@/components/store/FeaturedCollectionsGrid";
import { StoreHero } from "@/components/store/StoreHero";
import { WorldOfAfari } from "@/components/store/WorldOfAfari";

export function StorePageContent() {
  return (
    <>
      <StoreHero />
      <FeaturedCollectionsGrid />
      <CuratedEssentials />
      <WorldOfAfari />
    </>
  );
}
