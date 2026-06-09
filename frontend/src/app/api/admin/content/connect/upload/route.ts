import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { updateConnectImageField } from "@/services/content/connect-upload";
import type { ConnectContentDocument } from "@/types/connect-content";

export async function POST(request: Request) {
  let token: string;
  try {
    ({ token } = await requirePermission("content:connect:write"));
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

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { data } = updateConnectImageField(field, buffer, file.type);

    const localDoc: ConnectContentDocument = {
      key: "main",
      data,
      updatedAt: new Date().toISOString(),
    };

    const { ok } = await backendFetch<ConnectContentDocument>(
      "/content/connect",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ data }),
      },
    );

    if (!ok) {
      return NextResponse.json({
        ...localDoc,
        warning:
          "Image saved on this site. Remote sync failed — is the backend running?",
      });
    }

    return NextResponse.json(localDoc);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
