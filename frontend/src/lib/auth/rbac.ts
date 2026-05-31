import {
  isRole,
  parseRole,
  permissionsForRole,
  type Permission,
  type Role,
} from "@/lib/auth/roles";

export function resolvePermissions(
  role: string,
  effectivePermissions?: readonly Permission[] | null,
): readonly Permission[] {
  const parsed = isRole(role) ? role : parseRole(role, "viewer");

  if (parsed === "super_admin") {
    return permissionsForRole("super_admin");
  }

  if (effectivePermissions && effectivePermissions.length > 0) {
    return effectivePermissions;
  }

  return permissionsForRole(parsed);
}

export function hasPermission(
  role: string,
  permission: Permission,
  effectivePermissions?: readonly Permission[] | null,
): boolean {
  return resolvePermissions(role, effectivePermissions).includes(permission);
}

export function canAccessAdmin(
  role: string,
  effectivePermissions?: readonly Permission[] | null,
): boolean {
  return hasPermission(role, "admin:access", effectivePermissions);
}

export function canWriteHomepage(
  role: string,
  effectivePermissions?: readonly Permission[] | null,
): boolean {
  return hasPermission(role, "content:homepage:write", effectivePermissions);
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return parseRole(role, "viewer") === "super_admin";
}

export function roleAtLeast(role: string, minimum: Role): boolean {
  const order: Role[] = ["viewer", "editor", "admin", "super_admin"];
  const parsed = parseRole(role);
  return order.indexOf(parsed) >= order.indexOf(minimum);
}
