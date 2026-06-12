import type { VentureFeaturedProject } from "@/types/venture-project";
import type { VentureProjectListingStatus } from "@/types/venture-project";

export const VENTURE_PROJECT_LISTING_OPTIONS: {
  value: VentureProjectListingStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "published",
    label: "Published",
    description: "Shown on the ventures page and available at /ventures/projects/[slug].",
  },
  {
    value: "hidden",
    label: "Hidden",
    description: "Removed from the public site. Still editable here in admin.",
  },
];

export function getVentureProjectListingStatus(
  project: VentureFeaturedProject,
): VentureProjectListingStatus {
  if (project.published === false || project.hidden === true) return "hidden";
  return "published";
}

export function applyVentureProjectListingStatus(
  project: VentureFeaturedProject,
  status: VentureProjectListingStatus,
): VentureFeaturedProject {
  const published = status === "published";
  return {
    ...project,
    published,
    hidden: !published,
  };
}
