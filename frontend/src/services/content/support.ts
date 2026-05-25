import { cache } from "react";
import { SUPPORT_CONTENT_DEFAULTS } from "@/lib/data/support-defaults";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  FaqPageContent,
  PolicyPageContent,
  SupportContentData,
  SupportContentDocument,
} from "@/types/support-content";

function mergePolicyPage(
  defaults: PolicyPageContent,
  remote?: Partial<PolicyPageContent>,
): PolicyPageContent {
  if (!remote) return defaults;
  return {
    ...defaults,
    ...remote,
    sections: remote.sections?.length ? remote.sections : defaults.sections,
    relatedLinks: remote.relatedLinks?.length
      ? remote.relatedLinks
      : defaults.relatedLinks,
  };
}

function mergeFaqPage(
  defaults: FaqPageContent,
  remote?: Partial<FaqPageContent>,
): FaqPageContent {
  if (!remote) return defaults;
  return {
    ...defaults,
    ...remote,
    items: remote.items?.length ? remote.items : defaults.items,
    relatedLinks: remote.relatedLinks?.length
      ? remote.relatedLinks
      : defaults.relatedLinks,
  };
}

function mergeSupportData(
  remote?: Partial<SupportContentData> | null,
): SupportContentData {
  const d = SUPPORT_CONTENT_DEFAULTS;
  if (!remote) return d;

  return {
    faq: mergeFaqPage(d.faq, remote.faq),
    shipping: mergePolicyPage(d.shipping, remote.shipping),
    returns: mergePolicyPage(d.returns, remote.returns),
  };
}

export function getSupportContentLocal(): SupportContentData {
  try {
    const doc = readJsonFile<Partial<SupportContentDocument>>("support.json");
    return mergeSupportData(doc.data);
  } catch {
    return SUPPORT_CONTENT_DEFAULTS;
  }
}

export const getSupportContent = cache(
  async (): Promise<SupportContentData> => {
    const doc = await fetchCmsJson<SupportContentDocument>("/content/support");
    if (doc?.data) return mergeSupportData(doc.data);
    return getSupportContentLocal();
  },
);

export function saveSupportContentLocal(
  data: SupportContentData,
): SupportContentDocument {
  const doc: SupportContentDocument = {
    key: "main",
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("support.json", doc);
  return doc;
}
