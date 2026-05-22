import { NextResponse } from "next/server";
import { AdminUnauthorizedError, requireAdminSecret } from "@/services/auth/admin";
import { getHomepage, saveHomepage } from "@/services/content/homepage";
import type { HomepageContent } from "@/types/homepage";

export async function GET() {
  return NextResponse.json(getHomepage());
}

export async function PUT(request: Request) {
  try {
    requireAdminSecret(request.headers.get("x-admin-secret"));
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  const body = (await request.json()) as Partial<
    Pick<HomepageContent, "featureCards" | "ourEssence">
  >;
  const updated = saveHomepage(body);
  return NextResponse.json(updated);
}
