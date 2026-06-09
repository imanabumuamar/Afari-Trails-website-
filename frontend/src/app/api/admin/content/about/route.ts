import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { mergeAboutData } from "@/lib/about/merge-about-data";
import {
  getAboutContentLocal,
  saveAboutContentLocal,
} from "@/services/content/about";
import { readJsonFile } from "@/services/content/repository";
import type { AboutContentData, AboutContentDocument } from "@/types/about-content";

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
    const { token } = await requirePermission("content:about:read");
    const { data, ok, status } = await backendFetch<AboutContentDocument>(
      "/content/about",
      { token },
    );

    if (!ok || !data) {
      try {
        const local = readJsonFile<AboutContentDocument>("about.json");
        return NextResponse.json({
          key: "main",
          data: getAboutContentLocal(),
          updatedAt: local.updatedAt ?? new Date().toISOString(),
        });
      } catch {
        return NextResponse.json(
          { error: cmsLoadError(status, "about content") },
          { status: status || 502 },
        );
      }
    }
    return NextResponse.json(data);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await requirePermission("content:about:write");
    const body = await request.json();
    const merged = mergeAboutData(
      (body.data ?? body) as Partial<AboutContentData>,
    );
    const localDoc = saveAboutContentLocal(merged);

    const { data, ok } = await backendFetch<AboutContentDocument>(
      "/content/about",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ data: merged }),
      },
    );

    if (!ok || !data) {
      return NextResponse.json({
        ...localDoc,
        warning: "Saved locally. Remote sync failed — is the backend running?",
      });
    }
    // Local file is source of truth (backend may omit newer fields like name/position).
    return NextResponse.json(localDoc);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
