"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AfariLens } from "@/components/archive/AfariLens";
import { ArchiveHero } from "@/components/archive/ArchiveHero";
import { ArchiveLightbox } from "@/components/archive/ArchiveLightbox";
import { ArchiveMasonry } from "@/components/archive/ArchiveMasonry";
import { ArchiveSubmitCta } from "@/components/archive/ArchiveSubmitCta";
import { FeaturedCollections } from "@/components/archive/FeaturedCollections";
import { LatestMoments } from "@/components/archive/LatestMoments";
import { resolveCollectionFilter } from "@/lib/archive/collection-filter";
import type {
  ArchiveCollection,
  ArchiveContentData,
  ArchiveGridCategory,
  ArchiveImageRecord,
  ArchivePageContent,
} from "@/types/archive-content";

export type ArchivePageProps = {
  page: ArchivePageContent;
  collections: ArchiveCollection[];
  latestMoments: string[];
  images: ArchiveImageRecord[];
};

export function ArchivePageContent({
  page,
  collections,
  latestMoments,
  images,
}: ArchivePageProps) {
  const searchParams = useSearchParams();
  const [activeCollection, setActiveCollection] =
    useState<ArchiveGridCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<ArchiveImageRecord | null>(
    null,
  );

  useEffect(() => {
    const fromUrl = resolveCollectionFilter(
      searchParams.get("collection"),
      collections,
    );
    if (fromUrl) setActiveCollection(fromUrl);
  }, [searchParams, collections]);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#grid") {
      return;
    }
    const timer = window.setTimeout(() => {
      document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  return (
    <>
      <ArchiveHero hero={page.hero} />
      <FeaturedCollections
        collections={collections}
        section={page.collectionsSection}
        onSelect={setActiveCollection}
      />
      <AfariLens afariLens={page.afariLens} />
      <LatestMoments
        momentIds={latestMoments}
        images={images}
        section={page.latestMomentsSection}
      />
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
