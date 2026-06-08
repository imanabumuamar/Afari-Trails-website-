import { NextResponse } from "next/server";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { slugifyExpeditionId } from "@/lib/expeditions/expedition-slug";
import { renameExpeditionImageDir } from "@/services/content/expedition-rename";

export async function POST(request: Request) {
  try {
    await requirePermission("content:expeditions:write");
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }

  const body = await request.json();
  const oldId =
    typeof body.oldId === "string" ? slugifyExpeditionId(body.oldId) : "";
  const newId =
    typeof body.newId === "string" ? slugifyExpeditionId(body.newId) : "";

  if (!oldId || !newId) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  try {
    renameExpeditionImageDir(oldId, newId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rename failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
