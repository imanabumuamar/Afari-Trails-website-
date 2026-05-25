import { getApiBaseUrl } from "@/lib/api/backend";

const CMS_FETCH_MS = 5_000;

/** Fetch CMS JSON from the API with a timeout so pages still load if the API is slow or down. */
export async function fetchCmsJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(CMS_FETCH_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
