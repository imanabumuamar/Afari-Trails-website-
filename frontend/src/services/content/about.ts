import { cache } from "react";
import { ABOUT_CONTENT_DEFAULTS } from "@/lib/data/about-defaults";
import {
  mergeAboutData,
  preferFilledBehindPeople,
} from "@/lib/about/merge-about-data";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  AboutContentData,
  AboutContentDocument,
} from "@/types/about-content";

export { mergeAboutData } from "@/lib/about/merge-about-data";

export function getAboutContentLocal(): AboutContentData {
  try {
    const doc = readJsonFile<Partial<AboutContentDocument>>("about.json");
    return mergeAboutData(doc.data);
  } catch {
    return ABOUT_CONTENT_DEFAULTS;
  }
}

export const getAboutContent = cache(async (): Promise<AboutContentData> => {
  let localDoc: AboutContentDocument | null = null;
  try {
    localDoc = readJsonFile<AboutContentDocument>("about.json");
  } catch {
    localDoc = null;
  }

  const local = localDoc
    ? mergeAboutData(localDoc.data)
    : ABOUT_CONTENT_DEFAULTS;

  const doc = await fetchCmsJson<AboutContentDocument>("/content/about");
  if (!doc?.data) return local;

  const remote = mergeAboutData(doc.data);
  if (!localDoc?.updatedAt) return remote;

  const localTime = new Date(localDoc.updatedAt).getTime();
  const remoteTime = new Date(doc.updatedAt ?? 0).getTime();
  const chosen = localTime >= remoteTime ? local : remote;
  const other = localTime >= remoteTime ? remote : local;
  return preferFilledBehindPeople(chosen, other);
});

export function saveAboutContentLocal(
  data: AboutContentData,
): AboutContentDocument {
  const doc: AboutContentDocument = {
    key: "main",
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("about.json", doc);
  return doc;
}
