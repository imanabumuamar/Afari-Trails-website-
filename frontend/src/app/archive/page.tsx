import { Suspense } from "react";
import { ArchivePageContent } from "@/components/archive/ArchivePageContent";
import {
  getArchiveContent,
  getPublishedImages,
  getVisibleCollections,
} from "@/services/content/archive";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Archive",
  description:
    "Collected moments from the trail — a curated visual journey through Africa's landscapes, wildlife, and people.",
};

export default async function ArchivePage() {
  const content = await getArchiveContent();
  const images = getPublishedImages(content.images);
  const collections = getVisibleCollections(content.collections);

  return (
    <Suspense fallback={null}>
      <ArchivePageContent
        page={content.page}
        collections={collections}
        latestMoments={content.latestMoments}
        images={images}
      />
    </Suspense>
  );
}
