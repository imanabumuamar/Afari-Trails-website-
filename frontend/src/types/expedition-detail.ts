export type ExpeditionVisual = {
  src: string;
  alt: string;
  wide?: boolean;
};

export type ExpeditionHighlight = {
  label: string;
  value: string;
};

export type ExpeditionHeroStat = {
  label: string;
  value: string;
};

export type ExpeditionItineraryDay = {
  day: number;
  /** Display label e.g. "DAY 1" or "DAY 2 – 3" */
  dayLabel?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export type ExpeditionExperience = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

export type ExpeditionFaqItem = {
  question: string;
  answer: string;
};

export type ExpeditionStory = {
  quote: string;
  name: string;
  location: string;
};

import type { ExpeditionPageSectionKey } from "@/lib/expeditions/expedition-page-sections";

export type { ExpeditionPageSectionKey };

export type ExpeditionSectionVisibility = Partial<
  Record<ExpeditionPageSectionKey, boolean>
>;

export type ExpeditionSectionCopy = {
  overviewLabel: string;
  overviewHeading: string;
  itineraryLabel: string;
  itineraryHeading: string;
  itinerarySubtext: string;
  itineraryCtaLabel: string;
  experiencesLabel: string;
  experiencesHeading: string;
  galleryLabel: string;
  galleryHeading: string;
  galleryCtaLabel: string;
  accommodationLabel: string;
  mapLabel: string;
  mapHeading: string;
  mapCtaLabel: string;
  includedLabel: string;
  notIncludedLabel: string;
  pricingLabel: string;
  storiesLabel: string;
  storiesHeading: string;
  faqLabel: string;
  faqHeading: string;
  footerCtaHeading: string;
  enquireLabel: string;
  brochureLabel: string;
  whatsappLabel: string;
};

export type ExpeditionDetail = {
  id: string;
  regionId?: string;
  published?: boolean;
  /** When true, the public page shows only the hero image while other content stays saved in CMS. */
  comingSoon?: boolean;
  name: string;
  title: string;
  tagline: string;
  metaDescription: string;
  heroImage: string;
  /** e.g. "Zambia • South Luangwa National Park" */
  locationLabel?: string;
  heroStats?: readonly ExpeditionHeroStat[];
  brochureUrl?: string;
  quickDetails: readonly string[];
  intro: {
    statement: string;
    body: string;
  };
  sections?: Partial<ExpeditionSectionCopy>;
  /** Per-section show/hide on the public expedition page. Omitted sections default to visible. */
  sectionVisibility?: ExpeditionSectionVisibility;
  highlights: readonly ExpeditionHighlight[];
  visualStrip: readonly ExpeditionVisual[];
  itinerary: readonly ExpeditionItineraryDay[];
  accommodation: {
    heading: string;
    body: string;
    image: string;
    imageAlt: string;
    features?: readonly string[];
    sideImages?: readonly ExpeditionVisual[];
  };
  experiences: readonly ExpeditionExperience[];
  gallery: readonly ExpeditionVisual[];
  included: readonly string[];
  notIncluded?: readonly string[];
  map?: {
    image: string;
    imageAlt: string;
    mapsUrl: string;
  };
  pricing?: {
    amount: string;
    currency: string;
    note?: string;
  };
  stories?: readonly ExpeditionStory[];
  philosophy: {
    quote: string;
  };
  faq: readonly ExpeditionFaqItem[];
  inquiry: {
    heading: string;
    subtext: string;
  };
  relatedIds: readonly string[];
  closingQuote: string;
};
