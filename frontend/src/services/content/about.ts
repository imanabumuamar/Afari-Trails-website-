import { cache } from "react";
import { ABOUT_CONTENT_DEFAULTS } from "@/lib/data/about-defaults";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  AboutContentData,
  AboutContentDocument,
} from "@/types/about-content";

function mergeSection<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

function mergeAboutData(
  remote?: Partial<AboutContentData> | null,
): AboutContentData {
  const d = ABOUT_CONTENT_DEFAULTS;
  if (!remote) return d;

  const brandStory = mergeSection(d.brandStory, remote.brandStory);
  if (remote.brandStory?.leftManifesto?.length) {
    brandStory.leftManifesto = remote.brandStory.leftManifesto;
  }
  if (remote.brandStory?.rightBody?.length) {
    brandStory.rightBody = remote.brandStory.rightBody;
  }

  const visualStrip = mergeSection(d.visualStrip, remote.visualStrip);
  if (remote.visualStrip?.images?.length) {
    visualStrip.images = remote.visualStrip.images;
  }

  const philosophy = mergeSection(d.philosophy, remote.philosophy);
  if (remote.philosophy?.principles?.length) {
    philosophy.principles = remote.philosophy.principles;
  }

  const behindTheBrand = mergeSection(d.behindTheBrand, remote.behindTheBrand);
  if (remote.behindTheBrand?.images?.length) {
    behindTheBrand.images = remote.behindTheBrand.images;
  }

  const futureVision = mergeSection(d.futureVision, remote.futureVision);
  if (remote.futureVision?.pillars?.length) {
    futureVision.pillars = remote.futureVision.pillars;
  }

  return {
    hero: mergeSection(d.hero, remote.hero),
    brandStory,
    visualStrip,
    philosophy,
    whyWeExist: mergeSection(d.whyWeExist, remote.whyWeExist),
    behindTheBrand,
    futureVision,
    finalQuote: mergeSection(d.finalQuote, remote.finalQuote),
    getInTouch: mergeSection(d.getInTouch, remote.getInTouch),
  };
}

export function getAboutContentLocal(): AboutContentData {
  try {
    const doc = readJsonFile<Partial<AboutContentDocument>>("about.json");
    return mergeAboutData(doc.data);
  } catch {
    return ABOUT_CONTENT_DEFAULTS;
  }
}

export const getAboutContent = cache(async (): Promise<AboutContentData> => {
  const doc = await fetchCmsJson<AboutContentDocument>("/content/about");
  if (doc?.data) return mergeAboutData(doc.data);
  return getAboutContentLocal();
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
