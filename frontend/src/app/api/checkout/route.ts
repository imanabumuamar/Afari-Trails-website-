import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";

export async function GET() {
  const { data, ok, status } = await backendFetch<{
    enabled: boolean;
    provider: "manual" | "stripe";
    stripeAvailable?: boolean;
  }>("/checkout/status");

  if (!ok || !data) {
    return NextResponse.json(
      { enabled: false, provider: "manual" as const },
      { status: status || 502 },
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { data, ok, status } = await backendFetch<{ url: string; sessionId: string }>(
    "/checkout/session",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  if (!ok || !data?.url) {
    const errBody = data as { error?: string } | null;
    return NextResponse.json(
      { error: errBody?.error ?? "Could not start checkout" },
      { status: status || 502 },
    );
  }

  return NextResponse.json(data);
}
