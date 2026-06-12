import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { updateJournalImageField } from "@/services/content/journal-upload";
import type { JournalContentDocument } from "@/types/journal-content";

export async function POST(request: Request) {
  let token: string;
  try {
    ({ token } = await requirePermission("content:journal:write"));
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
  const storySlugRaw = formData.get("storySlug");

  if (typeof field !== "string" || !field) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const storySlug =
    typeof storySlugRaw === "string" && storySlugRaw.length > 0
      ? storySlugRaw
      : undefined;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { data } = updateJournalImageField(
      storySlug,
      field,
      buffer,
      file.type,
    );

    const localDoc: JournalContentDocument = {
      key: "main",
      data,
      updatedAt: new Date().toISOString(),
    };

    const { ok } = await backendFetch<JournalContentDocument>(
      "/content/journal",
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
