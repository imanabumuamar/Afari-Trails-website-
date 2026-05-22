import { env } from "@/config/env";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  adminSecret?: string;
};

/**
 * Base HTTP client for the Afari Trails Express API.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, adminSecret } = options;

  const res = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(adminSecret ? { "x-admin-secret": adminSecret } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string })?.error ?? res.statusText,
      res.status,
      data
    );
  }

  return data as T;
}
