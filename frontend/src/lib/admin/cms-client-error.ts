/** User-facing messages for admin CMS fetch responses. */
export function cmsClientStatusMessage(status: number): string {
  if (status === 503) {
    return "API is not running. Open a terminal in the project folder and run: npm run dev";
  }
  if (status === 401) {
    return "Session expired. Sign out, then sign in again at /admin/login.";
  }
  if (status === 403) {
    return "You do not have permission to edit this content.";
  }
  return "";
}

export async function readAdminApiError(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    // ignore
  }
  return cmsClientStatusMessage(res.status) || fallback;
}
