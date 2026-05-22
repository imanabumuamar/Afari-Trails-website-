import { auth } from "@/auth";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new AdminAuthError();
  }
  return session;
}

export class AdminAuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AdminAuthError";
  }
}
