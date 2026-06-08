import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { roleAtLeast } from "@/lib/auth/rbac";
import { AuthError, requireSession } from "@/lib/auth/require-session";

function authResponse(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  throw error;
}

async function requireMessagesAdmin() {
  const { role, token } = await requireSession();
  if (!roleAtLeast(role, "admin")) {
    throw new AuthError("Forbidden", 403);
  }
  return { token };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { token } = await requireMessagesAdmin();
    const { id } = await context.params;
    const body = await request.json();

    const { data, ok, status } = await backendFetch(`/inquiries/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    });

    if (!ok) {
      const err = data as { error?: string } | null;
      return NextResponse.json(
        { error: err?.error ?? "Could not update message" },
        { status: status || 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { token } = await requireMessagesAdmin();
    const { id } = await context.params;

    const { ok, status } = await backendFetch(`/inquiries/${id}`, {
      method: "DELETE",
      token,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Could not delete message" },
        { status: status || 502 },
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
