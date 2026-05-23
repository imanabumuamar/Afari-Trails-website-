import { NextResponse } from "next/server";
import { AdminAuthError, requireAdminSession } from "@/lib/auth/require-admin";
import {
  isHomepageImageField,
  isHomepageVideoField,
  updateHomepageImage,
  updateHomepageVideo,
} from "@/services/content/homepage";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  const formData = await request.formData();
  const field = formData.get("field");

  if (typeof field !== "string") {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  if (isHomepageVideoField(field)) {
    const file = formData.get("video") ?? formData.get("image");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No video provided" }, { status: 400 });
    }
    if (file.type !== "video/mp4") {
      return NextResponse.json({ error: "Video must be MP4" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const updated = updateHomepageVideo(field, buffer);
    return NextResponse.json(updated);
  }

  if (!isHomepageImageField(field)) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  const file = formData.get("image");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const alt = (formData.get("alt") as string | null) ?? undefined;
  const buffer = Buffer.from(await file.arrayBuffer());
  const updated = updateHomepageImage(field, buffer, file.type, alt);

  return NextResponse.json(updated);
}
