import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import type { StoreContentDocument } from "@/types/store-content";

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
    const { token } = await requirePermission("content:store:read");
    const { data, ok, status } = await backendFetch<StoreContentDocument>(
      "/content/store",
      { token },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: cmsLoadError(status, "store content") },
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
    const { token } = await requirePermission("content:store:write");
    const body = await request.json();

    const { data, ok, status } = await backendFetch<StoreContentDocument>(
      "/content/store",
      {
        method: "PUT",
        token,
        body: JSON.stringify(body),
      },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not save store content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
