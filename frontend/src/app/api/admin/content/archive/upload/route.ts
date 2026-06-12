import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { normalizeArchiveImage } from "@/lib/archive/image-categories";
import { getArchiveContentLocal } from "@/services/content/archive";
import { updateArchiveImageField } from "@/services/content/archive-upload";
import type {
  ArchiveContentData,
  ArchiveContentDocument,
  ArchiveImageRecord,
} from "@/types/archive-content";

function parseGalleryRecord(raw: FormDataEntryValue | null): ArchiveImageRecord | undefined {
  if (typeof raw !== "string" || !raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as ArchiveImageRecord;
    if (typeof parsed.id === "string" && parsed.id.length > 0) {
      return normalizeArchiveImage(parsed);
    }
  } catch {
    // ignore
  }
  return undefined;
}

function ensureGalleryImageInBase(
  base: ArchiveContentData,
  imageId: string,
  galleryRecord?: ArchiveImageRecord,
): ArchiveContentData {
  if (base.images.some((img) => img.id === imageId)) return base;
  if (!galleryRecord || galleryRecord.id !== imageId) {
    throw new Error("Gallery image not found. Save the image first.");
  }
  return {
    ...base,
    images: [
      ...base.images,
      normalizeArchiveImage(galleryRecord),
    ],
  };
}

export async function POST(request: Request) {
  let token: string;
  try {
    ({ token } = await requirePermission("content:archive:write"));
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }

  const formData = await request.formData();
  const field = formData.get("field");
  const file = formData.get("image");
  const imageIdRaw = formData.get("imageId");
  const collectionIdRaw = formData.get("collectionId");
  const galleryRecord = parseGalleryRecord(formData.get("galleryRecord"));

  if (typeof field !== "string" || !field) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const imageId =
    typeof imageIdRaw === "string" && imageIdRaw.length > 0
      ? imageIdRaw
      : undefined;
  const collectionId =
    typeof collectionIdRaw === "string" && collectionIdRaw.length > 0
      ? collectionIdRaw
      : undefined;
  try {
    const { data: current } = await backendFetch<ArchiveContentDocument>(
      "/content/archive",
      { token },
    );
    let base = current?.data ?? getArchiveContentLocal();
    if (imageId) {
      base = ensureGalleryImageInBase(base, imageId, galleryRecord);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { data: merged } = updateArchiveImageField(
      base,
      { fieldPath: field, imageId, collectionId },
      buffer,
      file.type,
    );

    const { data: synced, ok } = await backendFetch<ArchiveContentDocument>(
      "/content/archive",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ data: merged }),
      },
    );

    if (!ok || !synced) {
      return NextResponse.json(
        { error: "Image saved locally but API sync failed." },
        { status: 502 },
      );
    }

    return NextResponse.json(synced);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
