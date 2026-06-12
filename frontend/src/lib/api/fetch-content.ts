import { getApiBaseUrl } from "@/lib/api/backend";

const CMS_FETCH_MS = 5_000;

type FetchCmsOptions = {
  /** Seconds to cache the response. Pass false for admin-fresh content. */
  revalidate?: number | false;
};

/** Fetch CMS JSON from the API with a timeout so pages still load if the API is slow or down. */
export async function fetchCmsJson<T>(
  path: string,
  options: FetchCmsOptions = {},
): Promise<T | null> {
  const { revalidate = 30 } = options;
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...(revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate } }),
      signal: AbortSignal.timeout(CMS_FETCH_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
