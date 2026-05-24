import {
  isRole,
  parseRole,
  permissionsForRole,
  type Permission,
  type Role,
} from "@/lib/auth/roles";

export function hasPermission(role: string, permission: Permission): boolean {
  const parsed = isRole(role) ? role : parseRole(role, "viewer");
  return permissionsForRole(parsed).includes(permission);
}

export function canAccessAdmin(role: string): boolean {
  return hasPermission(role, "admin:access");
}

export function canWriteHomepage(role: string): boolean {
  return hasPermission(role, "content:homepage:write");
}

export function roleAtLeast(role: string, minimum: Role): boolean {
  const order: Role[] = ["viewer", "editor", "admin", "super_admin"];
  const parsed = parseRole(role);
  return order.indexOf(parsed) >= order.indexOf(minimum);
}
