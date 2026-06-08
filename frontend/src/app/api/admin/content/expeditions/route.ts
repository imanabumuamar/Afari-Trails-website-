import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { mergeExpeditionsData } from "@/lib/expeditions/merge-expeditions-data";
import type { ExpeditionsContentDocument } from "@/types/expeditions-content";

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
    const { token } = await requirePermission("content:expeditions:read");
    const { data, ok, status } = await backendFetch<ExpeditionsContentDocument>(
      "/content/expeditions",
      { token },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: cmsLoadError(status, "expedition content") },
        { status: status || 502 },
      );
    }
    return NextResponse.json({
      ...data,
      data: mergeExpeditionsData(data.data),
    });
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await requirePermission("content:expeditions:write");
    const body = await request.json();
    const payload = {
      ...body,
      data: mergeExpeditionsData(body.data),
    };

    const { data, ok, status } = await backendFetch<ExpeditionsContentDocument>(
      "/content/expeditions",
      {
        method: "PUT",
        token,
        body: JSON.stringify(payload),
      },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not save expedition content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json({
      ...data,
      data: mergeExpeditionsData(data.data),
    });
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
