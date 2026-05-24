import { ArchivePageContent } from "@/components/archive/ArchivePageContent";
import {
  getArchiveContent,
  getPublishedImages,
} from "@/services/content/archive";

export const metadata = {
  title: "Archive",
  description:
    "Collected moments from the trail — a curated visual journey through Africa's landscapes, wildlife, and people.",
};

export default async function ArchivePage() {
  const content = await getArchiveContent();
  const images = getPublishedImages(content.images);

  return (
    <ArchivePageContent
      page={content.page}
      collections={content.collections}
      latestMoments={content.latestMoments}
      images={images}
    />
  );
}
