import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import {
  isHomepageImageField,
  isHomepageVideoField,
  updateHomepageImage,
  updateHomepageVideo,
} from "@/services/content/homepage";

export async function POST(request: Request) {
  let token: string;
  try {
    ({ token } = await requirePermission("content:homepage:write"));
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

  if (typeof field !== "string") {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  let updated;

  if (isHomepageVideoField(field)) {
    const file = formData.get("video") ?? formData.get("image");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No video provided" }, { status: 400 });
    }
    if (file.type !== "video/mp4") {
      return NextResponse.json({ error: "Video must be MP4" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    updated = updateHomepageVideo(field, buffer);
  } else if (isHomepageImageField(field)) {
    const file = formData.get("image");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }
    const alt = (formData.get("alt") as string | null) ?? undefined;
    const buffer = Buffer.from(await file.arrayBuffer());
    updated = updateHomepageImage(field, buffer, file.type, alt);
  } else {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  const { data, ok } = await backendFetch("/content/homepage", {
    method: "PUT",
    token,
    body: JSON.stringify({
      hero: updated.hero,
      featureCards: updated.featureCards,
      ourEssence: updated.ourEssence,
    }),
  });

  if (!ok || !data) {
    return NextResponse.json(
      { error: "File saved locally but API sync failed. Is the backend running?" },
      { status: 502 },
    );
  }

  return NextResponse.json(data);
}
