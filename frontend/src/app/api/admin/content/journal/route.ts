import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { cmsLoadError } from "@/lib/admin/cms-api-error";
import { AuthError, requirePermission } from "@/lib/auth/require-session";
import { mergeJournalData } from "@/lib/journal/merge-journal-data";
import {
  getJournalContentLocal,
  saveJournalContentLocal,
} from "@/services/content/journal";
import { readJsonFile } from "@/services/content/repository";
import type { JournalContentDocument } from "@/types/journal-content";

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
  localDoc: JournalContentDocument | null,
  remote: JournalContentDocument,
): JournalContentDocument {
  if (!localDoc?.updatedAt) {
    return {
      ...remote,
      data: mergeJournalData(remote.data),
    };
  }

  const localTime = new Date(localDoc.updatedAt).getTime();
  const remoteTime = new Date(remote.updatedAt ?? 0).getTime();
  if (localTime > remoteTime) {
    return {
      key: "main",
      data: getJournalContentLocal(),
      updatedAt: localDoc.updatedAt,
    };
  }

  return {
    ...remote,
    data: mergeJournalData(remote.data),
  };
}

export async function GET() {
  try {
    const { token } = await requirePermission("content:journal:read");

    let localDoc: JournalContentDocument | null = null;
    try {
      localDoc = readJsonFile<JournalContentDocument>("journal.json");
    } catch {
      localDoc = null;
    }

    const { data, ok, status } = await backendFetch<JournalContentDocument>(
      "/content/journal",
      { token },
    );

    if (!ok || !data) {
      if (localDoc) {
        return NextResponse.json({
          key: "main",
          data: getJournalContentLocal(),
          updatedAt: localDoc.updatedAt ?? new Date().toISOString(),
        });
      }
      return NextResponse.json(
        { error: cmsLoadError(status, "journal content") },
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
    const { token } = await requirePermission("content:journal:write");
    const body = await request.json();
    const merged = mergeJournalData(body.data);
    const localDoc = saveJournalContentLocal(merged);

    const { ok } = await backendFetch<JournalContentDocument>(
      "/content/journal",
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
      data: mergeJournalData(localDoc.data),
    });
  } catch (error) {
    const res = authResponse(error);
    if (res) return res;
  }
}
