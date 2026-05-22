"use client";

import { useState } from "react";
import { AfariLens } from "@/components/archive/AfariLens";
import { ArchiveHero } from "@/components/archive/ArchiveHero";
import { ArchiveLightbox } from "@/components/archive/ArchiveLightbox";
import { ArchiveMasonry } from "@/components/archive/ArchiveMasonry";
import { FeaturedCollections } from "@/components/archive/FeaturedCollections";
import { VisualStrips } from "@/components/archive/VisualStrips";
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
      <VisualStrips />
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
