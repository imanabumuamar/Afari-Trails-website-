"use client";

import { useState } from "react";
import { AfariLens } from "@/components/archive/AfariLens";
import { ArchiveHero } from "@/components/archive/ArchiveHero";
import { ArchiveLightbox } from "@/components/archive/ArchiveLightbox";
import { ArchiveMasonry } from "@/components/archive/ArchiveMasonry";
import { ArchiveSubmitCta } from "@/components/archive/ArchiveSubmitCta";
import { FeaturedCollections } from "@/components/archive/FeaturedCollections";
import { LatestMoments } from "@/components/archive/LatestMoments";
import type { ArchiveGridCategory, ArchiveImage } from "@/lib/data/archive";

export function ArchivePageContent() {
  const [activeCollection, setActiveCollection] =
    useState<ArchiveGridCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<ArchiveImage | null>(null);

  return (
    <>
      <ArchiveHero />
      <FeaturedCollections onSelect={setActiveCollection} />
      <AfariLens />
      <LatestMoments />
      <ArchiveSubmitCta />
      <ArchiveMasonry
        active={activeCollection}
        onSelect={setLightboxItem}
        onFilterChange={setActiveCollection}
      />
      <ArchiveLightbox
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </>
  );
}
