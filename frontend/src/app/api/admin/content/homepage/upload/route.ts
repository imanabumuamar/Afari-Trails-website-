import { NextResponse } from "next/server";
import { AdminUnauthorizedError, requireAdminSecret } from "@/services/auth/admin";
import { updateHomepageImage } from "@/services/content/homepage";
import type { HomepageImageField } from "@/types/homepage";
import { HOMEPAGE_IMAGE_FIELDS } from "@/types/homepage";

const VALID_FIELDS = new Set(Object.keys(HOMEPAGE_IMAGE_FIELDS));

export async function POST(request: Request) {
  try {
    requireAdminSecret(request.headers.get("x-admin-secret"));
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  const formData = await request.formData();
  const field = formData.get("field");
  const file = formData.get("image");

  if (typeof field !== "string" || !VALID_FIELDS.has(field)) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const alt = (formData.get("alt") as string | null) ?? undefined;
  const buffer = Buffer.from(await file.arrayBuffer());
  const updated = updateHomepageImage(
    field as HomepageImageField,
    buffer,
    file.type,
    alt
  );

  return NextResponse.json(updated);
}
