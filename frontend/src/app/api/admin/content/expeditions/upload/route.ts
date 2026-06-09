import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { updateExpeditionsImageField } from "@/services/content/expedition-upload";
import type { ExpeditionsContentDocument } from "@/types/expeditions-content";

export async function POST(request: Request) {
  let token: string;
  try {
    ({ token } = await requirePermission("content:expeditions:write"));
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
  const expeditionIdRaw = formData.get("expeditionId");

  if (typeof field !== "string" || !field) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const expeditionId =
    typeof expeditionIdRaw === "string" && expeditionIdRaw.length > 0
      ? expeditionIdRaw
      : undefined;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { doc } = updateExpeditionsImageField(
      expeditionId,
      field,
      buffer,
      file.type,
    );

    const { ok } = await backendFetch<ExpeditionsContentDocument>(
      "/content/expeditions",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ data: doc.data }),
      },
    );

    if (!ok) {
      return NextResponse.json({
        ...doc,
        warning:
          "Image saved on this site. Remote sync failed — is the backend running?",
      });
    }

    return NextResponse.json(doc);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
