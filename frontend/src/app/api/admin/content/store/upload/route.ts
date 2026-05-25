import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { updateStoreImageField } from "@/services/content/store-upload";
import type { StoreContentDocument } from "@/types/store-content";

export async function POST(request: Request) {
  let token: string;
  try {
    ({ token } = await requirePermission("content:store:write"));
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

  if (typeof field !== "string" || !field) {
    return NextResponse.json({ error: "Missing field path" }, { status: 400 });
  }
  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { data } = updateStoreImageField(field, buffer, file.type);

  const { data: saved, ok, status } = await backendFetch<StoreContentDocument>(
    "/content/store",
    {
      method: "PUT",
      token,
      body: JSON.stringify({ data }),
    },
  );

  if (!ok || !saved) {
    return NextResponse.json(
      { error: "Image saved locally but API sync failed" },
      { status: status || 502 },
    );
  }

  return NextResponse.json(saved);
}
