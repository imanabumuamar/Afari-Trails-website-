export function cmsLoadError(status: number, label: string): string {
  if (status === 503) {
    return "API is not running. From the project root run: npm run dev";
  }
  return `Could not load ${label}`;
}
