"use client";

import { useState } from "react";
import { AfariLens } from "@/components/archive/AfariLens";
import { ArchiveHero } from "@/components/archive/ArchiveHero";
import { ArchiveLightbox } from "@/components/archive/ArchiveLightbox";
import { ArchiveMasonry } from "@/components/archive/ArchiveMasonry";
import { ArchiveSubmitCta } from "@/components/archive/ArchiveSubmitCta";
import { FeaturedCollections } from "@/components/archive/FeaturedCollections";
import { LatestMoments } from "@/components/archive/LatestMoments";
import type {
  ArchiveCollection,
  ArchiveContentData,
  ArchiveGridCategory,
  ArchiveImageRecord,
  ArchiveLatestMoment,
  ArchivePageContent,
} from "@/types/archive-content";

export type ArchivePageProps = {
  page: ArchivePageContent;
  collections: ArchiveCollection[];
  latestMoments: ArchiveLatestMoment[];
  images: ArchiveImageRecord[];
};

export function ArchivePageContent({
  page,
  collections,
  latestMoments,
  images,
}: ArchivePageProps) {
  const [activeCollection, setActiveCollection] =
    useState<ArchiveGridCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<ArchiveImageRecord | null>(
    null,
  );

  return (
    <>
      <ArchiveHero hero={page.hero} />
      <FeaturedCollections
        collections={collections}
        section={page.collectionsSection}
        onSelect={setActiveCollection}
      />
      <AfariLens afariLens={page.afariLens} />
      <LatestMoments moments={latestMoments} section={page.latestMomentsSection} />
      <ArchiveSubmitCta archiveSubmit={page.archiveSubmit} />
      <ArchiveMasonry
        collections={collections}
        images={images}
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

export type { ArchiveContentData };
