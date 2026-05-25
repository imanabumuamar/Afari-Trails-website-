import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import type { SupportContentDocument } from "@/types/support-content";

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
    const { token } = await requirePermission("content:support:read");
    const { data, ok, status } = await backendFetch<SupportContentDocument>(
      "/content/support",
      { token },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: cmsLoadError(status, "support content") },
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
    const { token } = await requirePermission("content:support:write");
    const body = await request.json();

    const { data, ok, status } = await backendFetch<SupportContentDocument>(
      "/content/support",
      {
        method: "PUT",
        token,
        body: JSON.stringify(body),
      },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not save support content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
