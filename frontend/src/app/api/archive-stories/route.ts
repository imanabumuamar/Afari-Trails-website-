import { NextResponse } from "next/server";
import { primaryImageCategory } from "@/lib/archive/image-categories";
import { getArchiveContent, getPublishedImages } from "@/services/content/archive";

/**
 * Public list of published archive entries, trimmed to the fields needed by
 * the admin "Local Stories" picker. Archive content is public, so no auth.
 */
export async function GET() {
  const content = await getArchiveContent();
  const stories = getPublishedImages(content.images).map((img) => ({
    id: img.id,
    title: img.title,
    location: img.location,
    photographer: img.photographer,
    caption: img.caption,
    category: primaryImageCategory(img),
    image: img.image,
  }));

  return NextResponse.json({ stories });
}
