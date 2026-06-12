import { CuratedEssentials } from "@/components/store/CuratedEssentials";
import { FeaturedCollectionsGrid } from "@/components/store/FeaturedCollectionsGrid";
import { StoreComingSoon } from "@/components/store/StoreComingSoon";
import { StoreHero } from "@/components/store/StoreHero";
import { WorldOfAfari } from "@/components/store/WorldOfAfari";
import { getStoreContent } from "@/services/content/store";

export async function StorePageContent() {
  const { pageMode } = await getStoreContent();
  const isLive = pageMode === "live";

  return (
    <>
      <StoreHero />
      {isLive ? (
        <>
          <FeaturedCollectionsGrid />
          <CuratedEssentials />
          <WorldOfAfari />
        </>
      ) : (
        <StoreComingSoon />
      )}
    </>
  );
}
