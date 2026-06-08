export type ExpeditionVisual = {
  src: string;
  alt: string;
  wide?: boolean;
};

export type ExpeditionHighlight = {
  label: string;
  value: string;
};

export type ExpeditionItineraryDay = {
  day: number;
  title: string;
  description: string;
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

export type ExpeditionDetail = {
  id: string;
  /** Region filter on /expeditions/all (e.g. zambia, south-africa). */
  regionId?: string;
  /** When false, hidden from “View all” catalog (detail URL may still work). */
  published?: boolean;
  name: string;
  title: string;
  tagline: string;
  metaDescription: string;
  heroImage: string;
  quickDetails: readonly string[];
  intro: {
    statement: string;
    body: string;
  };
  highlights: readonly ExpeditionHighlight[];
  visualStrip: readonly ExpeditionVisual[];
  itinerary: readonly ExpeditionItineraryDay[];
  accommodation: {
    heading: string;
    body: string;
    image: string;
    imageAlt: string;
  };
  experiences: readonly ExpeditionExperience[];
  gallery: readonly ExpeditionVisual[];
  included: readonly string[];
  notIncluded?: readonly string[];
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
