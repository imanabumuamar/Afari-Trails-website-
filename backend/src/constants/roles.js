export const ROLES = ["super_admin", "admin", "editor", "viewer"];

export const PERMISSIONS = [
  "admin:access",
  "content:homepage:read",
  "content:homepage:write",
  "content:ventures:read",
  "content:ventures:write",
  "content:expeditions:read",
  "content:expeditions:write",
  "content:journal:read",
  "content:journal:write",
  "content:archive:read",
  "content:archive:write",
  "content:about:read",
  "content:about:write",
  "content:store:read",
  "content:store:write",
  "content:support:read",
  "content:support:write",
  "content:connect:read",
  "content:connect:write",
  "users:read",
  "users:write",
];

export const ROLE_PERMISSIONS = {
  super_admin: PERMISSIONS,
  admin: [
    "admin:access",
    "content:homepage:read",
    "content:homepage:write",
    "content:ventures:read",
    "content:ventures:write",
    "content:expeditions:read",
    "content:expeditions:write",
    "content:journal:read",
    "content:journal:write",
    "content:archive:read",
    "content:archive:write",
    "content:about:read",
    "content:about:write",
    "content:store:read",
    "content:store:write",
    "content:support:read",
    "content:support:write",
    "content:connect:read",
    "content:connect:write",
  ],
  editor: [
    "admin:access",
    "content:homepage:read",
    "content:homepage:write",
    "content:ventures:read",
    "content:ventures:write",
    "content:expeditions:read",
    "content:expeditions:write",
    "content:journal:read",
    "content:journal:write",
    "content:archive:read",
    "content:archive:write",
    "content:about:read",
    "content:about:write",
    "content:store:read",
    "content:store:write",
    "content:support:read",
    "content:support:write",
    "content:connect:read",
    "content:connect:write",
  ],
  viewer: [
    "admin:access",
    "content:homepage:read",
    "content:ventures:read",
    "content:expeditions:read",
    "content:journal:read",
    "content:archive:read",
    "content:about:read",
    "content:store:read",
    "content:support:read",
    "content:connect:read",
  ],
};

export function isRole(value) {
  return ROLES.includes(value);
}

export function parseRole(value, fallback = "viewer") {
  return isRole(value) ? value : fallback;
}

export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[parseRole(role)] ?? [];
  return perms.includes(permission);
}

/** @deprecated Prefer hasEffectivePermission from permissions.js */

export function canAccessAdmin(role) {
  return hasPermission(role, "admin:access");
}

export const ROLE_LABELS = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};
