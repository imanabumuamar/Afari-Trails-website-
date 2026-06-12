import type { ExpeditionDetail } from "@/types/expedition-detail";
import type { ExpeditionDetailRecord } from "@/types/expeditions-content";

export type ExpeditionListingStatus = "published" | "coming-soon" | "hidden";

export const EXPEDITION_LISTING_STATUS_OPTIONS: {
  value: ExpeditionListingStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "published",
    label: "Published",
    description: "Full page live on featured cards, All journeys, and the expedition URL.",
  },
  {
    value: "coming-soon",
    label: "Coming soon",
    description:
      "Stays on featured cards and All journeys. The page shows the full hero and a coming soon section below.",
  },
  {
    value: "hidden",
    label: "Hidden",
    description: "Removed from featured cards and All journeys. Still editable here in admin.",
  },
];

export function getExpeditionListingStatus(
  expedition: ExpeditionDetail,
): ExpeditionListingStatus {
  if (expedition.comingSoon === true) return "coming-soon";
  if (expedition.published === false) return "hidden";
  return "published";
}

export function applyExpeditionListingStatus(
  expedition: ExpeditionDetailRecord,
  status: ExpeditionListingStatus,
): ExpeditionDetailRecord {
  switch (status) {
    case "published":
      return { ...expedition, published: true, comingSoon: false };
    case "coming-soon":
      return { ...expedition, published: false, comingSoon: true };
    case "hidden":
      return { ...expedition, published: false, comingSoon: false };
  }
}

export function expeditionListingStatusLabel(
  status: ExpeditionListingStatus,
): string {
  return EXPEDITION_LISTING_STATUS_OPTIONS.find((o) => o.value === status)
    ?.label ?? status;
}

/** Shown on featured cards, All journeys, and other public listings. */
export function isExpeditionListed(expedition: ExpeditionDetail): boolean {
  return getExpeditionListingStatus(expedition) !== "hidden";
}
