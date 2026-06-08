import { cache } from "react";
import { CONNECT_CONTENT_DEFAULTS } from "@/lib/data/connect-defaults";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type { ConnectPageConfig } from "@/types/connect-page";
import type {
  ConnectContentData,
  ConnectContentDocument,
} from "@/types/connect-content";

export function mergeConnectPage(
  defaults: ConnectPageConfig,
  remote?: Partial<ConnectPageConfig>,
): ConnectPageConfig {
  if (!remote) return defaults;

  return {
    ...defaults,
    ...remote,
    hero: { ...defaults.hero, ...remote.hero },
    intro: { ...defaults.intro, ...remote.intro },
    categories: {
      ...defaults.categories,
      ...remote.categories,
      items: remote.categories?.items?.length
        ? [...remote.categories.items]
        : [...defaults.categories.items],
    },
    form: {
      ...defaults.form,
      ...remote.form,
      inquiryOptions: remote.form?.inquiryOptions?.length
        ? [...remote.form.inquiryOptions]
        : [...defaults.form.inquiryOptions],
    },
    direct: {
      ...defaults.direct,
      ...remote.direct,
      socials: remote.direct?.socials?.length
        ? [...remote.direct.socials]
        : [...defaults.direct.socials],
    },
    gallery: remote.gallery?.length
      ? [...remote.gallery]
      : [...defaults.gallery],
    newsletter:
      remote.newsletter !== undefined
        ? remote.newsletter
          ? { ...defaults.newsletter!, ...remote.newsletter }
          : undefined
        : defaults.newsletter,
    closing: { ...defaults.closing, ...remote.closing },
  };
}

function mergeConnectData(
  remote?: Partial<ConnectContentData> | null,
): ConnectContentData {
  const d = CONNECT_CONTENT_DEFAULTS;
  if (!remote) return d;

  return {
    contact: mergeConnectPage(d.contact, remote.contact),
    expeditions: mergeConnectPage(d.expeditions, remote.expeditions),
  };
}

export function getConnectContentLocal(): ConnectContentData {
  try {
    const doc = readJsonFile<Partial<ConnectContentDocument>>("connect.json");
    return mergeConnectData(doc.data);
  } catch {
    return CONNECT_CONTENT_DEFAULTS;
  }
}

export const getConnectContent = cache(async (): Promise<ConnectContentData> => {
  const doc = await fetchCmsJson<ConnectContentDocument>("/content/connect");
  if (doc?.data) return mergeConnectData(doc.data);
  return getConnectContentLocal();
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
