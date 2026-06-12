export const VENTURE_PROJECT_STATUSES = [
  "Active",
  "Planned",
  "In Development",
] as const;

export type VentureProjectStatus = (typeof VENTURE_PROJECT_STATUSES)[number];

export type VentureProjectGalleryImage = {
  src: string;
  alt: string;
};

export type VentureProjectTimelineEntry = {
  date: string;
  title: string;
  body?: string;
};

export type VentureProjectSectionKey =
  | "hero"
  | "story"
  | "vision"
  | "location"
  | "gallery"
  | "communityImpact"
  | "conservation"
  | "timeline"
  | "cta";

export type VentureProjectSectionVisibility = Record<
  VentureProjectSectionKey,
  boolean
>;

export type VentureProjectListingStatus = "published" | "hidden";

export type VentureFeaturedProject = {
  id: string;
  title: string;
  description: string;
  status: VentureProjectStatus | string;
  image: string;
  imageAlt?: string;
  ctaLabel?: string;
  /** When false, project is hidden from the ventures page and its URL. */
  published?: boolean;
  /** @deprecated Use published — kept for older saved content */
  hidden?: boolean;
  sectionVisibility?: Partial<VentureProjectSectionVisibility>;
  story: string;
  vision: string;
  locationLabel?: string;
  locationHeading?: string;
  locationBody: string;
  locationImage?: string;
  gallery: VentureProjectGalleryImage[];
  communityImpact: string;
  conservation: string;
  timeline: VentureProjectTimelineEntry[];
};

export type FeaturedProjectsSection = {
  label: string;
  intro: string;
};
