import type { ExpeditionDetailRecord } from "@/types/expeditions-content";

export function createBlankExpedition(
  id: string,
  name: string,
): ExpeditionDetailRecord {
  return {
    id,
    regionId: "zambia",
    published: true,
    comingSoon: false,
    name,
    title: name,
    tagline: "",
    metaDescription: "",
    heroImage:
      "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=2400&q=85",
    locationLabel: "",
    heroStats: [],
    brochureUrl: "",
    quickDetails: ["Zambia", "5 Days", "Small Group", "Guided Experience"],
    intro: {
      statement: "",
      body: "",
    },
    highlights: [
      { label: "Duration", value: "5 Days" },
      { label: "Group Size", value: "6 – 8 Guests" },
      { label: "Location", value: "Zambia" },
      { label: "Accommodation", value: "Safari Camp" },
      { label: "Best Season", value: "May – October" },
      { label: "Style", value: "Safari" },
    ],
    visualStrip: [],
    itinerary: [
      {
        day: 1,
        title: "Arrival",
        description: "",
      },
    ],
    accommodation: {
      heading: "Where you stay",
      body: "",
      image:
        "https://images.unsplash.com/photo-1475928296734-496f6edc8174?w=1600&q=85",
      imageAlt: "Safari camp",
      features: [],
      sideImages: [],
    },
    experiences: [],
    gallery: [],
    included: [],
    notIncluded: [],
    map: {
      image: "",
      imageAlt: "Route map",
      mapsUrl: "",
    },
    pricing: {
      amount: "",
      currency: "USD",
      note: "per person",
    },
    stories: [],
    philosophy: { quote: "" },
    faq: [],
    inquiry: {
      heading: "Plan this journey",
      subtext: "Tell us when you would like to travel.",
    },
    relatedIds: [],
    closingQuote: "",
  };
}
