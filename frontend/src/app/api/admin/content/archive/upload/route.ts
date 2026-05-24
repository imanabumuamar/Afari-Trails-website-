import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { updateArchiveImageField } from "@/services/content/archive-upload";
import type { ArchiveContentDocument } from "@/types/archive-content";

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
  const momentIdRaw = formData.get("momentId");

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
  const momentId =
    typeof momentIdRaw === "string" && momentIdRaw.length > 0
      ? momentIdRaw
      : undefined;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { data } = updateArchiveImageField(
      { fieldPath: field, imageId, collectionId, momentId },
      buffer,
      file.type,
    );

    const { data: synced, ok } = await backendFetch<ArchiveContentDocument>(
      "/content/archive",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ data }),
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
