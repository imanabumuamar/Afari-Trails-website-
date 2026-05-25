import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { data, ok, status } = await backendFetch<{ id: string }>("/inquiries", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!ok) {
    const errBody = data as { error?: string } | null;
    const message = errBody?.error ?? "Could not submit inquiry";
    return NextResponse.json({ error: message }, { status: status || 502 });
  }

  return NextResponse.json(data, { status: 201 });
}
