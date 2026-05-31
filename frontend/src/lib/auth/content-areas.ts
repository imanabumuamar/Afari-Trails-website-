import type { Permission } from "@/lib/auth/roles";

export const CMS_CONTENT_AREAS = [
  { id: "homepage", label: "Homepage", href: "/admin/homepage" },
  { id: "ventures", label: "Ventures", href: "/admin/ventures" },
  { id: "expeditions", label: "Expeditions", href: "/admin/expeditions" },
  { id: "journal", label: "Journal", href: "/admin/journal" },
  { id: "archive", label: "Archive", href: "/admin/archive" },
  { id: "about", label: "About", href: "/admin/about" },
  { id: "store", label: "Store", href: "/admin/store" },
  { id: "support", label: "Support", href: "/admin/support" },
  { id: "connect", label: "Connect", href: "/admin/connect" },
] as const;

export type ContentAreaId = (typeof CMS_CONTENT_AREAS)[number]["id"];

export type ContentAccessLevel = "view" | "edit";

export function readPermissionForArea(id: ContentAreaId): Permission {
  return `content:${id}:read` as Permission;
}

export function writePermissionForArea(id: ContentAreaId): Permission {
  return `content:${id}:write` as Permission;
}

export const ADMIN_NAV_LINKS = CMS_CONTENT_AREAS.map((area) => ({
  href: area.href,
  label: area.label,
  permission: readPermissionForArea(area.id),
}));
