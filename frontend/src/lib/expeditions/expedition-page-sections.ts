import type { ExpeditionDetail } from "@/types/expedition-detail";

export type ExpeditionPageSectionKey =
  | "hero"
  | "overview"
  | "itinerary"
  | "experiences"
  | "gallery"
  | "accommodation"
  | "mapPricing"
  | "stories"
  | "faq"
  | "inquiry"
  | "footerCta"
  | "related";

export type ExpeditionSectionVisibility = Record<
  ExpeditionPageSectionKey,
  boolean
>;

export type ExpeditionPageSectionConfig = {
  key: ExpeditionPageSectionKey;
  label: string;
  description: string;
};

export const EXPEDITION_PAGE_SECTIONS: readonly ExpeditionPageSectionConfig[] = [
  {
    key: "hero",
    label: "Hero",
    description: "Banner image, title, stats, and primary CTAs.",
  },
  {
    key: "overview",
    label: "Overview",
    description: "Intro copy and highlights grid.",
  },
  {
    key: "itinerary",
    label: "Itinerary",
    description: "Day-by-day journey cards.",
  },
  {
    key: "experiences",
    label: "Experiences",
    description: "What you'll experience image grid.",
  },
  {
    key: "gallery",
    label: "Gallery",
    description: "Photo gallery.",
  },
  {
    key: "accommodation",
    label: "Accommodation",
    description: "Where you stay, features, and images.",
  },
  {
    key: "mapPricing",
    label: "Map, pricing & inclusions",
    description: "Route map, included/not included lists, and price box.",
  },
  {
    key: "stories",
    label: "Traveler stories",
    description: "Guest testimonials.",
  },
  {
    key: "faq",
    label: "FAQ",
    description: "Questions and answers.",
  },
  {
    key: "inquiry",
    label: "Inquiry form",
    description: "Enquiry form at the bottom of the page.",
  },
  {
    key: "footerCta",
    label: "Footer call to action",
    description: "Full-width closing banner with buttons.",
  },
  {
    key: "related",
    label: "Related expeditions",
    description: "Links to other journeys.",
  },
] as const;

export const DEFAULT_EXPEDITION_SECTION_VISIBILITY: ExpeditionSectionVisibility =
  Object.fromEntries(
    EXPEDITION_PAGE_SECTIONS.map((s) => [s.key, true]),
  ) as ExpeditionSectionVisibility;

export function resolveExpeditionSectionVisibility(
  expedition: ExpeditionDetail,
): ExpeditionSectionVisibility {
  const overrides = expedition.sectionVisibility ?? {};
  return {
    ...DEFAULT_EXPEDITION_SECTION_VISIBILITY,
    ...overrides,
  };
}

export function isExpeditionSectionVisible(
  expedition: ExpeditionDetail,
  key: ExpeditionPageSectionKey,
): boolean {
  return resolveExpeditionSectionVisibility(expedition)[key];
}
