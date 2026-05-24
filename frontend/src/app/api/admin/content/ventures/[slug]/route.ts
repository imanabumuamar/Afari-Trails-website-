import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import type { VentureContentDocument } from "@/types/ventures-content";
import {
  VENTURE_SLUGS,
  type VentureSlug,
} from "@/lib/data/venture-defaults";

function authResponse(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  throw error;
}

function isVentureSlug(slug: string): slug is VentureSlug {
  return (VENTURE_SLUGS as readonly string[]).includes(slug);
}

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    if (!isVentureSlug(slug)) {
      return NextResponse.json({ error: "Invalid venture page" }, { status: 400 });
    }

    const { token } = await requirePermission("content:ventures:read");
    const { data, ok, status } = await backendFetch<VentureContentDocument>(
      `/content/ventures/${slug}`,
      { token },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not load venture content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    if (!isVentureSlug(slug)) {
      return NextResponse.json({ error: "Invalid venture page" }, { status: 400 });
    }

    const { token } = await requirePermission("content:ventures:write");
    const body = await request.json();

    const { data, ok, status } = await backendFetch<VentureContentDocument>(
      `/content/ventures/${slug}`,
      {
        method: "PUT",
        token,
        body: JSON.stringify(body),
      },
    );

    if (!ok || !data) {
      return NextResponse.json(
        { error: "Could not save venture content" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
