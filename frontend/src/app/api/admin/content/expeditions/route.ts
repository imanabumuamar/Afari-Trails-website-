import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { mergeExpeditionsData } from "@/lib/expeditions/merge-expeditions-data";
import {
  getExpeditionsContentLocal,
  saveExpeditionsContentLocal,
} from "@/services/content/expeditions";
import { readJsonFile } from "@/services/content/repository";
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

function pickNewerDoc(
  localDoc: ExpeditionsContentDocument | null,
  remote: ExpeditionsContentDocument,
): ExpeditionsContentDocument {
  if (!localDoc?.updatedAt) {
    return {
      ...remote,
      data: mergeExpeditionsData(remote.data),
    };
  }

  const localTime = new Date(localDoc.updatedAt).getTime();
  const remoteTime = new Date(remote.updatedAt ?? 0).getTime();
  if (localTime > remoteTime) {
    return {
      key: "main",
      data: getExpeditionsContentLocal(),
      updatedAt: localDoc.updatedAt,
    };
  }

  return {
    ...remote,
    data: mergeExpeditionsData(remote.data),
  };
}

export async function GET() {
  try {
    const { token } = await requirePermission("content:expeditions:read");

    let localDoc: ExpeditionsContentDocument | null = null;
    try {
      localDoc = readJsonFile<ExpeditionsContentDocument>("expeditions.json");
    } catch {
      localDoc = null;
    }

    const { data, ok, status } = await backendFetch<ExpeditionsContentDocument>(
      "/content/expeditions",
      { token },
    );

    if (!ok || !data) {
      if (localDoc) {
        return NextResponse.json({
          key: "main",
          data: getExpeditionsContentLocal(),
          updatedAt: localDoc.updatedAt ?? new Date().toISOString(),
        });
      }
      return NextResponse.json(
        { error: cmsLoadError(status, "expedition content") },
        { status: status || 502 },
      );
    }

    return NextResponse.json(pickNewerDoc(localDoc, data));
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await requirePermission("content:expeditions:write");
    const body = await request.json();
    const merged = mergeExpeditionsData(body.data);
    const localDoc = saveExpeditionsContentLocal(merged);

    const { ok } = await backendFetch<ExpeditionsContentDocument>(
      "/content/expeditions",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ data: merged }),
      },
    );

    if (!ok) {
      return NextResponse.json({
        ...localDoc,
        warning: "Saved locally. Remote sync failed — is the backend running?",
      });
    }

    return NextResponse.json({
      ...localDoc,
      data: mergeExpeditionsData(localDoc.data),
    });
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
