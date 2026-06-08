import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { mergeJournalData } from "@/lib/journal/merge-journal-data";
import type { JournalContentDocument } from "@/types/journal-content";

function authResponse(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  throw error;
}

export async function GET() {
  try {
    const { token } = await requirePermission("content:journal:read");
    const { data, ok, status } = await backendFetch<JournalContentDocument>(
      "/content/journal",
      { token },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: cmsLoadError(status, "journal content") },
        { status: status || 502 },
      );
    }
    return NextResponse.json({
      ...data,
      data: mergeJournalData(data.data),
    });
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await requirePermission("content:journal:write");
    const body = await request.json();
    const payload = {
      ...body,
      data: mergeJournalData(body.data),
    };

    const { data, ok, status } = await backendFetch<JournalContentDocument>(
      "/content/journal",
      {
        method: "PUT",
        token,
        body: JSON.stringify(payload),
      },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not save journal content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json({
      ...data,
      data: mergeJournalData(data.data),
    });
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
