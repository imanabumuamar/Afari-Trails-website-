export const INBOX_MESSAGE_CATEGORIES = [
  {
    id: "connect",
    label: "Connect messages",
    sources: ["contact", "ventures-connect", "partner"],
  },
  {
    id: "expeditions",
    label: "Expedition messages",
    sources: ["expeditions-connect", "expedition"],
  },
  {
    id: "newsletter",
    label: "Newsletter",
    sources: ["newsletter"],
  },
  {
    id: "archive-submit",
    label: "Afari Lens photo",
    sources: ["archive-submit"],
  },
];

const CATEGORY_IDS = new Set(INBOX_MESSAGE_CATEGORIES.map((c) => c.id));

const SOURCE_TO_CATEGORY = new Map(
  INBOX_MESSAGE_CATEGORIES.flatMap((cat) =>
    cat.sources.map((source) => [source, cat.id]),
  ),
);

export function inboxReadPermission(categoryId) {
  return `inbox:${categoryId}:read`;
}

export function inboxWritePermission(categoryId) {
  return `inbox:${categoryId}:write`;
}

export function isInboxCategoryId(id) {
  return CATEGORY_IDS.has(id);
}

export function sourceToInboxCategory(source) {
  return SOURCE_TO_CATEGORY.get(source) ?? null;
}

export function permissionsFromMessageCategories(categories, accessLevel) {
  const unique = [...new Set(categories.filter((id) => CATEGORY_IDS.has(id)))];
  const perms = [];

  for (const id of unique) {
    perms.push(inboxReadPermission(id));
    if (accessLevel === "edit") {
      perms.push(inboxWritePermission(id));
    }
  }

  return perms;
}

export function messageCategoriesFromPermissions(permissionList) {
  const set = new Set(permissionList ?? []);
  if (set.has("inbox:read")) {
    return INBOX_MESSAGE_CATEGORIES.map((c) => c.id);
  }
  return INBOX_MESSAGE_CATEGORIES.filter((cat) =>
    set.has(inboxReadPermission(cat.id)),
  ).map((cat) => cat.id);
}

export function messageAccessLevelFromPermissions(permissionList, role) {
  if (role === "viewer") return "view";
  const list = permissionList ?? [];
  if (list.includes("inbox:write")) return "edit";
  const hasCategoryWrite = INBOX_MESSAGE_CATEGORIES.some((cat) =>
    list.includes(inboxWritePermission(cat.id)),
  );
  return hasCategoryWrite ? "edit" : "view";
}

function userPermissionList(user) {
  if (!user) return [];
  if (user.role === "super_admin") return ["inbox:read", "inbox:write"];
  return Array.isArray(user.permissions) ? user.permissions : [];
}

export function hasLegacyInboxRead(permissionList) {
  return (permissionList ?? []).includes("inbox:read");
}

export function hasLegacyInboxWrite(permissionList) {
  return (permissionList ?? []).includes("inbox:write");
}

export function canReadInboxCategory(user, categoryId) {
  if (user?.role === "super_admin") return true;
  const perms = userPermissionList(user);
  if (hasLegacyInboxRead(perms)) return true;
  return perms.includes(inboxReadPermission(categoryId));
}

export function canWriteInboxCategory(user, categoryId) {
  if (user?.role === "super_admin") return true;
  const perms = userPermissionList(user);
  if (hasLegacyInboxWrite(perms)) return true;
  return perms.includes(inboxWritePermission(categoryId));
}

export function canReadInboxSource(user, source) {
  const categoryId = sourceToInboxCategory(source);
  if (!categoryId) return false;
  return canReadInboxCategory(user, categoryId);
}

export function canWriteInboxSource(user, source) {
  const categoryId = sourceToInboxCategory(source);
  if (!categoryId) return false;
  return canWriteInboxCategory(user, categoryId);
}

export function getReadableInboxSources(user) {
  if (user?.role === "super_admin") {
    return INBOX_MESSAGE_CATEGORIES.flatMap((cat) => cat.sources);
  }

  const perms = userPermissionList(user);
  if (hasLegacyInboxRead(perms)) {
    return INBOX_MESSAGE_CATEGORIES.flatMap((cat) => cat.sources);
  }

  const sources = [];
  for (const cat of INBOX_MESSAGE_CATEGORIES) {
    if (perms.includes(inboxReadPermission(cat.id))) {
      sources.push(...cat.sources);
    }
  }
  return sources;
}

export function hasAnyInboxRead(user) {
  return getReadableInboxSources(user).length > 0;
}

export function filterInquiriesForUser(user, data) {
  const allowed = new Set(getReadableInboxSources(user));
  const submissions = data.submissions.filter((s) => allowed.has(s.source));

  const filterBySource = (bySource) => {
    const filtered = {};
    let total = 0;
    for (const [source, count] of Object.entries(bySource ?? {})) {
      if (allowed.has(source)) {
        filtered[source] = count;
        total += count;
      }
    }
    return { total, bySource: filtered };
  };

  const active = filterBySource(data.counts.bySource);
  const archivedBySource = data.counts.archivedBySource ?? {};

  return {
    submissions,
    counts: {
      total: active.total,
      archived: filterBySource(archivedBySource).total,
      bySource: active.bySource,
      inboxTotal: active.total,
    },
  };
}
