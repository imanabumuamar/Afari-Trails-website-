import type { Permission, Role } from "@/lib/auth/roles";
import { parseRole } from "@/lib/auth/roles";

export const INBOX_MESSAGE_CATEGORIES = [
  {
    id: "connect",
    label: "Connect messages",
    sources: ["contact", "ventures-connect", "partner"] as const,
  },
  {
    id: "expeditions",
    label: "Expedition messages",
    sources: ["expeditions-connect", "expedition"] as const,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    sources: ["newsletter"] as const,
  },
  {
    id: "archive-submit",
    label: "Afari Lens photo",
    sources: ["archive-submit"] as const,
  },
] as const;

export type InboxCategoryId = (typeof INBOX_MESSAGE_CATEGORIES)[number]["id"];

export type InquirySource =
  | "contact"
  | "expeditions-connect"
  | "ventures-connect"
  | "partner"
  | "expedition"
  | "newsletter"
  | "archive-submit";

const SOURCE_TO_CATEGORY = new Map<string, InboxCategoryId>(
  INBOX_MESSAGE_CATEGORIES.flatMap((cat) =>
    cat.sources.map((source) => [source, cat.id]),
  ),
);

export function inboxReadPermission(categoryId: string) {
  return `inbox:${categoryId}:read` as Permission;
}

export function inboxWritePermission(categoryId: string) {
  return `inbox:${categoryId}:write` as Permission;
}

export function messageCategoriesFromPermissions(
  permissions?: readonly string[] | null,
): InboxCategoryId[] {
  const set = new Set(permissions ?? []);
  if (set.has("inbox:read")) {
    return INBOX_MESSAGE_CATEGORIES.map((c) => c.id);
  }
  return INBOX_MESSAGE_CATEGORIES.filter((cat) =>
    set.has(inboxReadPermission(cat.id)),
  ).map((cat) => cat.id);
}

export function messageAccessLevelFromPermissions(
  permissions?: readonly string[] | null,
  role?: string | null,
): "view" | "edit" {
  if (parseRole(role, "viewer") === "viewer") return "view";
  const list = permissions ?? [];
  if (list.includes("inbox:write")) return "edit";
  const hasCategoryWrite = INBOX_MESSAGE_CATEGORIES.some((cat) =>
    list.includes(inboxWritePermission(cat.id)),
  );
  return hasCategoryWrite ? "edit" : "view";
}

export function hasLegacyInboxRead(permissions?: readonly string[] | null) {
  return (permissions ?? []).includes("inbox:read");
}

export function hasAnyInboxRead(
  role: string | null | undefined,
  permissions?: readonly Permission[] | null,
) {
  if (parseRole(role, "viewer") === "super_admin") return true;
  if (hasLegacyInboxRead(permissions)) return true;
  return messageCategoriesFromPermissions(permissions).length > 0;
}

export function canReadInboxCategory(
  role: string | null | undefined,
  categoryId: InboxCategoryId,
  permissions?: readonly Permission[] | null,
) {
  if (parseRole(role, "viewer") === "super_admin") return true;
  if (hasLegacyInboxRead(permissions)) return true;
  return (permissions ?? []).includes(inboxReadPermission(categoryId));
}

export function canWriteInboxSource(
  role: string | null | undefined,
  source: InquirySource,
  permissions?: readonly Permission[] | null,
) {
  if (parseRole(role, "viewer") === "super_admin") return true;
  const categoryId = SOURCE_TO_CATEGORY.get(source);
  if (!categoryId) return false;
  if ((permissions ?? []).includes("inbox:write")) return true;
  return (permissions ?? []).includes(inboxWritePermission(categoryId));
}

export function getCategoryForSource(source: InquirySource) {
  return SOURCE_TO_CATEGORY.get(source) ?? null;
}

export const MESSAGE_GROUPS: Record<
  "connect" | "expeditions",
  { label: string; sources: readonly InquirySource[] }
> = {
  connect: {
    label: "Connect messages",
    sources: INBOX_MESSAGE_CATEGORIES.find((c) => c.id === "connect")!.sources,
  },
  expeditions: {
    label: "Expedition messages",
    sources: INBOX_MESSAGE_CATEGORIES.find((c) => c.id === "expeditions")!
      .sources,
  },
};

export const SOURCE_LABELS: Record<InquirySource, string> = {
  contact: "Connect",
  "expeditions-connect": "Plan your journey",
  "ventures-connect": "Connect (legacy)",
  partner: "Connect (legacy)",
  expedition: "Expedition request",
  newsletter: "Newsletter",
  "archive-submit": "Afari Lens photo",
};

export const OTHER_INBOX_SOURCES: InquirySource[] = ["newsletter", "archive-submit"];
