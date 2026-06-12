import type {
  VentureFeaturedProject,
  VentureProjectSectionKey,
  VentureProjectSectionVisibility,
} from "@/types/venture-project";

export type {
  VentureProjectSectionKey,
  VentureProjectSectionVisibility,
} from "@/types/venture-project";

export type VentureProjectSectionConfig = {
  key: VentureProjectSectionKey;
  label: string;
  description: string;
};

export const VENTURE_PROJECT_PAGE_SECTIONS: readonly VentureProjectSectionConfig[] =
  [
    {
      key: "hero",
      label: "Hero",
      description: "Banner image, title, status, and short description.",
    },
    {
      key: "story",
      label: "Project story",
      description: "Main narrative section.",
    },
    {
      key: "vision",
      label: "Vision & goals",
      description: "Dark quote-style vision block.",
    },
    {
      key: "location",
      label: "Location",
      description: "Location heading, copy, and optional image.",
    },
    {
      key: "gallery",
      label: "Photos / renders",
      description: "Horizontal image gallery.",
    },
    {
      key: "communityImpact",
      label: "Community impact",
      description: "Community impact copy.",
    },
    {
      key: "conservation",
      label: "Conservation",
      description: "Conservation aspects copy.",
    },
    {
      key: "timeline",
      label: "Timeline & progress",
      description: "Milestone timeline.",
    },
    {
      key: "cta",
      label: "Get in touch",
      description: "Closing call-to-action to /contact.",
    },
  ];

export const DEFAULT_VENTURE_PROJECT_SECTION_VISIBILITY: VentureProjectSectionVisibility =
  {
    hero: true,
    story: true,
    vision: true,
    location: true,
    gallery: true,
    communityImpact: true,
    conservation: true,
    timeline: true,
    cta: true,
  };

export function resolveVentureProjectSectionVisibility(
  project: VentureFeaturedProject,
): VentureProjectSectionVisibility {
  const remote = project.sectionVisibility ?? {};
  const merged = { ...DEFAULT_VENTURE_PROJECT_SECTION_VISIBILITY };

  for (const section of VENTURE_PROJECT_PAGE_SECTIONS) {
    const value = remote[section.key];
    if (typeof value === "boolean") {
      merged[section.key] = value;
    }
  }

  return merged;
}

export function isVentureProjectPublished(project: VentureFeaturedProject): boolean {
  if (project.published === false) return false;
  if (project.hidden === true) return false;
  return true;
}
