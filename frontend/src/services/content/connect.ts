import { cache } from "react";
import { CONNECT_CONTENT_DEFAULTS } from "@/lib/data/connect-defaults";
import { mergeConnectData } from "@/lib/connect/merge-connect-data";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  ConnectContentData,
  ConnectContentDocument,
} from "@/types/connect-content";

export { mergeConnectData, mergeConnectPage } from "@/lib/connect/merge-connect-data";

export function getConnectContentLocal(): ConnectContentData {
  try {
    const doc = readJsonFile<Partial<ConnectContentDocument>>("connect.json");
    return mergeConnectData(doc.data);
  } catch {
    return CONNECT_CONTENT_DEFAULTS;
  }
}

export const getConnectContent = cache(async (): Promise<ConnectContentData> => {
  let localDoc: ConnectContentDocument | null = null;
  try {
    localDoc = readJsonFile<ConnectContentDocument>("connect.json");
  } catch {
    localDoc = null;
  }

  const local = localDoc
    ? mergeConnectData(localDoc.data)
    : CONNECT_CONTENT_DEFAULTS;

  const doc = await fetchCmsJson<ConnectContentDocument>("/content/connect");
  if (!doc?.data) return local;

  const remote = mergeConnectData(doc.data);
  if (!localDoc?.updatedAt) return remote;

  const localTime = new Date(localDoc.updatedAt).getTime();
  const remoteTime = new Date(doc.updatedAt ?? 0).getTime();
  return localTime >= remoteTime ? local : remote;
});

export function saveConnectContentLocal(
  data: ConnectContentData,
): ConnectContentDocument {
  const doc: ConnectContentDocument = {
    key: "main",
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("connect.json", doc);
  return doc;
}
