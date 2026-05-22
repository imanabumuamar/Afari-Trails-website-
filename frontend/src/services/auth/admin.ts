import { serverEnv } from "@/config/env";

export function isAdminAuthorized(secret: string | null | undefined): boolean {
  const expected = serverEnv.adminSecret;
  return Boolean(expected && secret && secret === expected);
}

export function requireAdminSecret(secret: string | null | undefined): void {
  if (!isAdminAuthorized(secret)) {
    throw new AdminUnauthorizedError();
  }
}

export class AdminUnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AdminUnauthorizedError";
  }
}
