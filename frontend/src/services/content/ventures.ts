import { cache } from "react";
import { getApiBaseUrl } from "@/lib/api/backend";
import {
  VENTURE_PAGE_DEFAULTS,
  type VentureSlug,
} from "@/lib/data/venture-defaults";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type { VentureContentDocument } from "@/types/ventures-content";

function ventureJsonPath(slug: VentureSlug) {
  return `ventures/${slug}.json`;
}

function mergeVentureData(
  slug: VentureSlug,
  remote?: Record<string, unknown> | null,
): Record<string, unknown> {
  const defaults = VENTURE_PAGE_DEFAULTS[slug];
  if (!remote) return { ...defaults };

  const merged: Record<string, unknown> = { ...defaults };

  for (const [key, remoteValue] of Object.entries(remote)) {
    const defaultValue = defaults[key];

    if (
      remoteValue &&
      typeof remoteValue === "object" &&
      !Array.isArray(remoteValue) &&
      defaultValue &&
      typeof defaultValue === "object" &&
      !Array.isArray(defaultValue)
    ) {
      merged[key] = {
        ...(defaultValue as Record<string, unknown>),
        ...(remoteValue as Record<string, unknown>),
      };
      continue;
    }

    merged[key] = remoteValue;
  }

  return merged;
}

export function getVentureContentLocal(slug: VentureSlug): Record<string, unknown> {
  try {
    const doc = readJsonFile<Partial<VentureContentDocument>>(
      ventureJsonPath(slug),
    );
    return mergeVentureData(slug, doc.data);
  } catch {
    return { ...VENTURE_PAGE_DEFAULTS[slug] };
  }
}

export const getVenturePageContent = cache(
  async (slug: VentureSlug): Promise<Record<string, unknown>> => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/content/ventures/${slug}`, {
        next: { revalidate: 30 },
      });
      if (res.ok) {
        const doc = (await res.json()) as VentureContentDocument;
        return mergeVentureData(slug, doc.data);
      }
    } catch {
      // API offline
    }
    return getVentureContentLocal(slug);
  },
);

export function saveVentureContentLocal(
  slug: VentureSlug,
  data: Record<string, unknown>,
): VentureContentDocument {
  const doc: VentureContentDocument = {
    slug,
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile(ventureJsonPath(slug), doc);
  return doc;
}
