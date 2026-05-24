import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import type { ArchiveContentDocument } from "@/types/archive-content";

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
    const { token } = await requirePermission("content:archive:read");
    const { data, ok, status } = await backendFetch<ArchiveContentDocument>(
      "/content/archive",
      { token },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not load archive content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await requirePermission("content:archive:write");
    const body = await request.json();

    const { data, ok, status } = await backendFetch<ArchiveContentDocument>(
      "/content/archive",
      {
        method: "PUT",
        token,
        body: JSON.stringify(body),
      },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not save archive content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
