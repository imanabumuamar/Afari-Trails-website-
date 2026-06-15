import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import {
  isHomepageImageField,
  isHomepageVideoField,
  updateHomepageImage,
  updateHomepageVideo,
} from "@/services/content/homepage";
import type { HomepageContent } from "@/types/homepage";

/** Apply only the changed media field from `updated` onto the live `base` content. */
function applyMediaField(
  base: HomepageContent,
  field: string,
  updated: HomepageContent,
): HomepageContent {
  if (field === "hero.video") {
    return {
      ...base,
      hero: {
        ...base.hero,
        video: updated.hero.video,
        backgroundMode: "video",
      },
    };
  }
  if (field === "hero.poster") {
    return { ...base, hero: { ...base.hero, poster: updated.hero.poster } };
  }
  if (field === "ourEssence") {
    return { ...base, ourEssence: updated.ourEssence };
  }
  const key = field.split(".")[1] as keyof HomepageContent["featureCards"];
  return {
    ...base,
    featureCards: { ...base.featureCards, [key]: updated.featureCards[key] },
  };
}

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

  // Merge the new media into the LIVE content from the database so we don't
  // overwrite text/layout edits with the local fallback defaults.
  const { data: current } = await backendFetch<HomepageContent>(
    "/content/homepage",
    { token },
  );
  const merged = current
    ? applyMediaField(current, field, updated)
    : updated;

  const { data, ok } = await backendFetch("/content/homepage", {
    method: "PUT",
    token,
    body: JSON.stringify({
      hero: merged.hero,
      featureCards: merged.featureCards,
      ourEssence: merged.ourEssence,
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
