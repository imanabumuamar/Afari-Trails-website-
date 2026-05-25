import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";

export async function GET() {
  const { data, ok, status } = await backendFetch<{
    status?: string;
    database?: string;
  }>("/health");

  if (status === 503 || !ok) {
    return NextResponse.json(
      {
        ok: false,
        apiReachable: false,
        message: "API is not running. From the project root run: npm run dev",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    apiReachable: true,
    database: data?.database ?? "unknown",
    status: data?.status ?? "ok",
  });
}
