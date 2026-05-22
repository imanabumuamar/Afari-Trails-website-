/**
 * Typed environment variables (client-safe values use NEXT_PUBLIC_ prefix).
 */
function required(name: string, value: string | undefined): string {
  if (!value && process.env.NODE_ENV === "production") {
    console.warn(`[env] Missing ${name}`);
  }
  return value ?? "";
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  adminSecret: process.env.ADMIN_SECRET ?? "",
} as const;

export const serverEnv = {
  adminSecret: required("ADMIN_SECRET", process.env.ADMIN_SECRET),
} as const;
