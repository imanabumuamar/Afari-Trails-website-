export const ROLES = ["super_admin", "admin", "editor", "viewer"] as const;

export type Role = (typeof ROLES)[number];

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
  "users:read",
  "users:write",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: "Full access, including user management",
  admin: "Edit all CMS content",
  editor: "Edit homepage, ventures, expeditions, journal, and archive content",
  viewer: "View admin content (read-only)",
};

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
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
  ],
  viewer: [
    "admin:access",
    "content:homepage:read",
    "content:ventures:read",
    "content:expeditions:read",
    "content:journal:read",
    "content:archive:read",
  ],
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function parseRole(value: string | null | undefined, fallback: Role = "viewer"): Role {
  if (value && isRole(value)) return value;
  return fallback;
}

export function permissionsForRole(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}
