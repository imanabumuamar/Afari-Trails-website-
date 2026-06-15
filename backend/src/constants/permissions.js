import { PERMISSIONS, ROLE_PERMISSIONS } from "./roles.js";
import {
  INBOX_MESSAGE_CATEGORIES,
  inboxReadPermission,
  inboxWritePermission,
  messageAccessLevelFromPermissions,
  messageCategoriesFromPermissions,
  permissionsFromMessageCategories,
} from "./inbox-categories.js";

export { INBOX_MESSAGE_CATEGORIES } from "./inbox-categories.js";
export {
  canReadInboxCategory,
  canReadInboxSource,
  canWriteInboxCategory,
  canWriteInboxSource,
  getReadableInboxSources,
  hasAnyInboxRead,
  messageCategoriesFromPermissions,
  messageAccessLevelFromPermissions,
  permissionsFromMessageCategories,
  sourceToInboxCategory,
} from "./inbox-categories.js";

export const CMS_CONTENT_AREAS = [
  { id: "homepage", label: "Homepage" },
  { id: "ventures", label: "Ventures" },
  { id: "expeditions", label: "Expeditions" },
  { id: "journal", label: "Journal" },
  { id: "archive", label: "Archive" },
  { id: "about", label: "About" },
  { id: "store", label: "Store" },
  { id: "support", label: "Support" },
  { id: "connect", label: "Connect" },
];

const CMS_AREA_IDS = new Set(CMS_CONTENT_AREAS.map((a) => a.id));

/** viewer = read only; editor/admin = read + write for selected areas */
export function permissionsFromContentAreas(areas, accessLevel) {
  const unique = [...new Set(areas.filter((id) => CMS_AREA_IDS.has(id)))];
  const perms = ["admin:access"];

  for (const id of unique) {
    perms.push(`content:${id}:read`);
    if (accessLevel === "edit" || accessLevel === "admin") {
      perms.push(`content:${id}:write`);
    }
  }

  return [...new Set(perms)];
}

export function buildUserPermissions({
  role,
  contentAreas = [],
  accessLevel = "edit",
  messageCategories = [],
  messageAccessLevel,
}) {
  if (role === "super_admin") {
    return [];
  }

  const cmsLevel =
    accessLevel === "view" || role === "viewer" ? "view" : "edit";
  const inboxLevel =
    messageAccessLevel === "view" || role === "viewer"
      ? "view"
      : (messageAccessLevel ?? cmsLevel);

  const perms = [
    ...permissionsFromContentAreas(contentAreas, cmsLevel),
    ...permissionsFromMessageCategories(messageCategories, inboxLevel),
  ];

  return validateCustomPermissions([...new Set(perms)]);
}

export function contentAreasFromPermissions(permissionList) {
  const set = new Set(permissionList ?? []);
  return CMS_CONTENT_AREAS.filter((area) =>
    set.has(`content:${area.id}:read`),
  ).map((area) => area.id);
}

export function accessLevelFromPermissions(permissionList, role) {
  if (role === "viewer") return "view";
  const list = permissionList ?? [];
  const hasWrite = CMS_CONTENT_AREAS.some((area) =>
    list.includes(`content:${area.id}:write`),
  );
  return hasWrite ? "edit" : "view";
}

export function getEffectivePermissions(user) {
  if (user.role === "super_admin") {
    return [...PERMISSIONS];
  }

  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return validateCustomPermissions(user.permissions);
  }

  return ROLE_PERMISSIONS[user.role] ?? ["admin:access"];
}

export function hasEffectivePermission(user, permission) {
  return getEffectivePermissions(user).includes(permission);
}

export function validateCustomPermissions(permissions) {
  if (!Array.isArray(permissions)) {
    const err = new Error("permissions must be an array");
    err.status = 400;
    throw err;
  }

  const inboxCategoryPerms = INBOX_MESSAGE_CATEGORIES.flatMap((cat) => [
    inboxReadPermission(cat.id),
    inboxWritePermission(cat.id),
  ]);

  const allowed = new Set([
    ...PERMISSIONS.filter((p) => !p.startsWith("users:")),
    ...inboxCategoryPerms,
  ]);

  const cleaned = [...new Set(permissions.filter((p) => allowed.has(p)))];

  if (!cleaned.includes("admin:access")) {
    cleaned.unshift("admin:access");
  }

  return cleaned;
}
