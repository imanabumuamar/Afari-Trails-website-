import {
  featuredProjects as defaultFeaturedProjects,
  featuredProjectsSection as defaultFeaturedProjectsSection,
  featuredProject as legacyFeaturedProject,
} from "@/lib/data/ventures";
import { DEFAULT_VENTURE_PROJECT_SECTION_VISIBILITY } from "@/lib/ventures/venture-project-sections";
import type {
  FeaturedProjectsSection,
  VentureFeaturedProject,
  VentureProjectGalleryImage,
  VentureProjectSectionVisibility,
  VentureProjectTimelineEntry,
} from "@/types/venture-project";

export const VENTURE_PROJECT_BASE_PATH = "/ventures/projects";

export function ventureProjectHref(id: string): string {
  const slug = id.trim().toLowerCase();
  return slug ? `${VENTURE_PROJECT_BASE_PATH}/${slug}` : VENTURE_PROJECT_BASE_PATH;
}

function resolveProjectPublished(
  row: Record<string, unknown>,
  fallback?: Partial<VentureFeaturedProject>,
): boolean {
  if (row.published === false || row.hidden === true) return false;
  if (row.published === true || row.hidden === false) return true;
  return fallback?.published !== false && fallback?.hidden !== true;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeGallery(value: unknown): VentureProjectGalleryImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Record<string, unknown>;
      const src = asString(row.src);
      if (!src) return null;
      return { src, alt: asString(row.alt) };
    })
    .filter((item): item is VentureProjectGalleryImage => Boolean(item));
}

function normalizeSectionVisibility(
  raw: unknown,
  fallback?: Partial<VentureProjectSectionVisibility>,
): VentureProjectSectionVisibility {
  const merged = { ...DEFAULT_VENTURE_PROJECT_SECTION_VISIBILITY };
  const remote =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Partial<VentureProjectSectionVisibility>)
      : {};

  for (const key of Object.keys(
    DEFAULT_VENTURE_PROJECT_SECTION_VISIBILITY,
  ) as (keyof VentureProjectSectionVisibility)[]) {
    if (typeof remote[key] === "boolean") {
      merged[key] = remote[key] as boolean;
    } else if (typeof fallback?.[key] === "boolean") {
      merged[key] = fallback[key] as boolean;
    }
  }

  return merged;
}

function normalizeTimeline(value: unknown): VentureProjectTimelineEntry[] {
  if (!Array.isArray(value)) return [];
  const entries: VentureProjectTimelineEntry[] = [];
  for (const item of value) {
    const row = item as Record<string, unknown>;
    const title = asString(row.title);
    const date = asString(row.date);
    if (!title && !date) continue;
    const body = asString(row.body);
    entries.push({
      date,
      title,
      ...(body ? { body } : {}),
    });
  }
  return entries;
}

export function normalizeFeaturedProject(
  raw: unknown,
  index = 0,
): VentureFeaturedProject {
  const row =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const fallback = (defaultFeaturedProjects[index] ??
    defaultFeaturedProjects[0]) as unknown as VentureFeaturedProject;

  const id =
    asString(row.id) ||
    asString(fallback?.id) ||
    `project-${index + 1}`;

  return {
    id,
    title: asString(row.title, fallback?.title ?? "Untitled project"),
    description: asString(row.description, fallback?.description ?? ""),
    status: asString(row.status, fallback?.status ?? "Planned"),
    image: asString(row.image, fallback?.image ?? ""),
    imageAlt: asString(row.imageAlt, fallback?.imageAlt ?? ""),
    ctaLabel: asString(row.ctaLabel, fallback?.ctaLabel ?? "View Project →"),
    published: resolveProjectPublished(row, fallback),
    hidden: !resolveProjectPublished(row, fallback),
    sectionVisibility: normalizeSectionVisibility(
      row.sectionVisibility,
      fallback?.sectionVisibility,
    ),
    story: asString(row.story, fallback?.story ?? ""),
    vision: asString(row.vision, fallback?.vision ?? ""),
    locationLabel: asString(
      row.locationLabel,
      fallback?.locationLabel ?? "Location",
    ),
    locationHeading: asString(row.locationHeading, fallback?.locationHeading ?? ""),
    locationBody: asString(row.locationBody, fallback?.locationBody ?? ""),
    locationImage: asString(row.locationImage, fallback?.locationImage ?? ""),
    gallery: normalizeGallery(row.gallery).length
      ? normalizeGallery(row.gallery)
      : [...(fallback?.gallery ?? [])],
    communityImpact: asString(
      row.communityImpact,
      fallback?.communityImpact ?? "",
    ),
    conservation: asString(row.conservation, fallback?.conservation ?? ""),
    timeline: normalizeTimeline(row.timeline).length
      ? normalizeTimeline(row.timeline)
      : [...(fallback?.timeline ?? [])],
  };
}

function legacyToProject(): VentureFeaturedProject {
  return normalizeFeaturedProject({
    id: "zambezi-lodge",
    title: legacyFeaturedProject.title,
    description: legacyFeaturedProject.description,
    status: legacyFeaturedProject.status,
    image: legacyFeaturedProject.image,
    ctaLabel: legacyFeaturedProject.ctaLabel,
    story:
      "Along the Zambezi corridor, Afari Trails is developing a low-impact eco-lodge vision — architecture that defers to the river, the forest, and the rhythm of the valley.",
    vision:
      "To create a hospitality destination that protects wild corridors, employs local communities, and offers guests a deeply grounded sense of place.",
    locationLabel: "Location",
    locationHeading: "Zambezi Valley, Zambia",
    locationBody:
      "A riverside site selected for minimal ecological disturbance, access to conservation partnerships, and long-term community benefit.",
    communityImpact:
      "Local employment in construction and operations, artisan partnerships, and training programs tied to hospitality and conservation skills.",
    conservation:
      "Low-density design, renewable energy targets, waste reduction systems, and collaboration with regional wildlife initiatives.",
    timeline: [
      {
        date: "2024",
        title: "Site selection & partnerships",
        body: "Land assessment and alignment with conservation stakeholders.",
      },
      {
        date: "2025",
        title: "Concept & design development",
        body: "Architecture, guest experience planning, and impact framework.",
      },
      {
        date: "2026",
        title: "In development",
        body: "Advancing permits, partnerships, and phased build planning.",
      },
    ],
  });
}

export function resolveFeaturedProjects(
  data: Record<string, unknown>,
): VentureFeaturedProject[] {
  if (Array.isArray(data.featuredProjects) && data.featuredProjects.length > 0) {
    return data.featuredProjects.map((item, index) =>
      normalizeFeaturedProject(item, index),
    );
  }

  if (data.featuredProject) {
    return [legacyToProject()];
  }

  return defaultFeaturedProjects.map((item, index) =>
    normalizeFeaturedProject(item, index),
  );
}

export function resolveFeaturedProjectsSection(
  data: Record<string, unknown>,
): FeaturedProjectsSection {
  const section = data.featuredProjectsSection as
    | Partial<FeaturedProjectsSection>
    | undefined;

  if (section?.label || section?.intro) {
    return {
      label: section.label ?? defaultFeaturedProjectsSection.label,
      intro: section.intro ?? defaultFeaturedProjectsSection.intro,
    };
  }

  const legacy = data.featuredProject as { label?: string } | undefined;
  if (legacy?.label) {
    return {
      label: legacy.label,
      intro: defaultFeaturedProjectsSection.intro,
    };
  }

  return { ...defaultFeaturedProjectsSection };
}

export function getVisibleFeaturedProjects(
  projects: VentureFeaturedProject[],
): VentureFeaturedProject[] {
  return projects.filter(
    (project) =>
      project.id.trim() &&
      project.published !== false &&
      project.hidden !== true,
  );
}

export function slugifyVentureProjectId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
