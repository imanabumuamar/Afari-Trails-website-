import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import type { HomepageContent } from "@/types/homepage";

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
    const { token } = await requirePermission("content:homepage:read");
    const { data, ok, status } = await backendFetch<HomepageContent>(
      "/content/homepage",
      { token },
    );
    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not load homepage from API" },
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
    const { token } = await requirePermission("content:homepage:write");
    const body = await request.json();
    const { data, ok, status } = await backendFetch<HomepageContent>(
      "/content/homepage",
      {
        method: "PUT",
        token,
        body: JSON.stringify(body),
      },
    );
    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not save homepage" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
