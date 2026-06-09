import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { mergeConnectData } from "@/lib/connect/merge-connect-data";
import {
  getConnectContentLocal,
  saveConnectContentLocal,
} from "@/services/content/connect";
import { readJsonFile } from "@/services/content/repository";
import type { ConnectContentData, ConnectContentDocument } from "@/types/connect-content";

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
  localDoc: ConnectContentDocument | null,
  remote: ConnectContentDocument,
): ConnectContentDocument {
  if (!localDoc?.updatedAt) return remote;

  const localTime = new Date(localDoc.updatedAt).getTime();
  const remoteTime = new Date(remote.updatedAt ?? 0).getTime();
  if (localTime > remoteTime) {
    return {
      key: "main",
      data: getConnectContentLocal(),
      updatedAt: localDoc.updatedAt,
    };
  }
  return remote;
}

export async function GET() {
  try {
    const { token } = await requirePermission("content:connect:read");

    let localDoc: ConnectContentDocument | null = null;
    try {
      localDoc = readJsonFile<ConnectContentDocument>("connect.json");
    } catch {
      localDoc = null;
    }

    const { data, ok, status } = await backendFetch<ConnectContentDocument>(
      "/content/connect",
      { token },
    );

    if (!ok || !data) {
      if (localDoc) {
        return NextResponse.json({
          key: "main",
          data: getConnectContentLocal(),
          updatedAt: localDoc.updatedAt ?? new Date().toISOString(),
        });
      }
      return NextResponse.json(
        { error: cmsLoadError(status, "connect content") },
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
    const { token } = await requirePermission("content:connect:write");
    const body = await request.json();
    const merged = mergeConnectData(
      (body.data ?? body) as Partial<ConnectContentData>,
    );
    const localDoc = saveConnectContentLocal(merged);

    const { data, ok } = await backendFetch<ConnectContentDocument>(
      "/content/connect",
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

    return NextResponse.json(localDoc);
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
