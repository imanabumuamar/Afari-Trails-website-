import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { data, ok, status } = await backendFetch<{
    redirectUrl: string;
    reference: string;
    orderId: string;
  }>("/checkout/request", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!ok || !data?.redirectUrl) {
    const errBody = data as { error?: string } | null;
    return NextResponse.json(
      { error: errBody?.error ?? "Could not submit order" },
      { status: status || 502 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
