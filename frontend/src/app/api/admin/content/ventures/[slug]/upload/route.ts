import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import {
  VENTURE_SLUGS,
  type VentureSlug,
} from "@/lib/data/venture-defaults";
import { updateVentureImageField } from "@/services/content/venture-upload";
import type { VentureContentDocument } from "@/types/ventures-content";

type RouteContext = { params: Promise<{ slug: string }> };

function isVentureSlug(slug: string): slug is VentureSlug {
  return (VENTURE_SLUGS as readonly string[]).includes(slug);
}

export async function POST(request: Request, context: RouteContext) {
  let token: string;
  try {
    ({ token } = await requirePermission("content:ventures:write"));
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }

  const { slug } = await context.params;
  if (!isVentureSlug(slug)) {
    return NextResponse.json({ error: "Invalid venture page" }, { status: 400 });
  }

  const formData = await request.formData();
  const field = formData.get("field");
  const file = formData.get("image");

  if (typeof field !== "string" || !field) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { data } = updateVentureImageField(slug, field, buffer, file.type);

  const { data: synced, ok } = await backendFetch<VentureContentDocument>(
    `/content/ventures/${slug}`,
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
}
