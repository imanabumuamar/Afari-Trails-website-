export type ExpeditionContentItemStatus = "published" | "hidden";

export const EXPEDITION_CONTENT_ITEM_STATUS_OPTIONS: {
  value: ExpeditionContentItemStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "published",
    label: "Published",
    description: "Shown on the public expedition page.",
  },
  {
    value: "hidden",
    label: "Hidden",
    description: "Kept in admin but hidden from the public page.",
  },
];

export function getExpeditionContentItemStatus(item: {
  published?: boolean;
}): ExpeditionContentItemStatus {
  return item.published === false ? "hidden" : "published";
}

export function applyExpeditionContentItemStatus<
  T extends { published?: boolean },
>(item: T, status: ExpeditionContentItemStatus): T {
  return { ...item, published: status === "published" };
}

export function isExpeditionContentItemVisible(item: {
  published?: boolean;
}): boolean {
  return item.published !== false;
}
