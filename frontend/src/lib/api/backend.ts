import { env } from "@/config/env";

export function getApiBaseUrl() {
  return (
    process.env.API_INTERNAL_URL ??
    env.apiUrl ??
    "http://localhost:4000/api"
  ).replace(/\/$/, "");
}

type BackendFetchOptions = RequestInit & {
  token?: string | null;
};

export async function backendFetch<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<{ data: T | null; status: number; ok: boolean }> {
  const { token, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers,
    });
  } catch {
    return { data: null, status: 503, ok: false };
  }

  let data: T | null = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }

  return { data, status: res.status, ok: res.ok };
}
