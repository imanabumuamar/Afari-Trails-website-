export type CollectionId =
  | "wildlife"
  | "landscapes"
  | "expedition-life"
  | "culture-people"
  | "the-afari-lens"
  | "behind-afari";

export type ArchiveGridCategory = CollectionId | "all";

export const archiveHero = {
  label: "Archive",
  heading: "Collected Moments From the Trail.",
  description:
    "A visual journey through landscapes, wildlife, people, and the spirit of Africa.",
  image:
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2400&q=80",
} as const;

export const collectionsSection = {
  label: "Explore Collections",
  heading: "Curated stories captured across Africa.",
  viewAllHref: "#grid",
} as const;

export const collections = [
  {
    id: "wildlife" as const,
    title: "Wildlife",
    description: "The untamed. In their natural world.",
    icon: "wildlife",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "landscapes" as const,
    title: "Landscapes",
    description: "Earth in its rawest, most beautiful form.",
    icon: "landscapes",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "expedition-life" as const,
    title: "Expedition Life",
    description: "The moments between destinations.",
    icon: "expedition",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "culture-people" as const,
    title: "Culture & People",
    description: "The soul of Africa, its people, its stories.",
    icon: "culture",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "the-afari-lens" as const,
    title: "The Afari Lens",
    description: "Community perspectives. Captured by you.",
    icon: "lens",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "behind-afari" as const,
    title: "Behind Afari",
    description: "Behind the scenes. The journey within.",
    icon: "behind",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  },
];

export const afariLens = {
  label: "The Afari Lens",
  heading: "Photograph of the Month",
  title: "Morning Mist, South Luangwa",
  photographer: "Chileshe Mwansa",
  story:
    "First light through mahogany smoke — a moment of stillness before the valley wakes. Selected from our community edition.",
  image:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  submitHref: "/archive/submit",
  entriesHref: "/archive#grid",
  editionsHref: "/archive#grid",
} as const;

export const latestMomentsSection = {
  label: "Latest Moments",
  viewAllHref: "#grid",
} as const;

export const latestMoments = [
  {
    id: "lm-1",
    alt: "Elephant in golden light",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lm-2",
    alt: "Bird in flight",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lm-3",
    alt: "River at sunset",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lm-4",
    alt: "Forest path",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lm-5",
    alt: "Lion cub",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lm-6",
    alt: "Waterfall",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lm-7",
    alt: "Elder portrait",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lm-8",
    alt: "Campfire under stars",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
  },
] as const;

export const archiveSubmit = {
  quote:
    "We do not inherit the earth from our ancestors, we borrow it from our children.",
  attribution: "African Proverb",
  body: "Share your perspective. Be part of the story.",
  cta: "Submit Your Photograph",
  href: "/archive/submit",
} as const;

export type ArchiveImage = {
  id: string;
  title: string;
  location: string;
  photographer: string;
  caption: string;
  category: CollectionId;
  image: string;
  span?: "tall" | "wide";
  related?: {
    label: string;
    href: string;
  };
};

export const archiveImages: ArchiveImage[] = [
  {
    id: "elephant-dawn",
    title: "Elephant at Dawn",
    location: "South Luangwa, Zambia",
    photographer: "Afari Trails",
    caption: "First light on the floodplain — giants moving through mist.",
    category: "wildlife",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    span: "tall",
    related: { label: "In the Presence of Giants", href: "/journal/in-the-presence-of-giants" },
  },
  {
    id: "zambezi-aerial",
    title: "Zambezi from Above",
    location: "Lower Zambezi, Zambia",
    photographer: "Afari Trails",
    caption: "The river as a living map — silver at dusk.",
    category: "landscapes",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    span: "wide",
    related: { label: "Lower Zambezi Expedition", href: "/expeditions/lower-zambezi" },
  },
  {
    id: "dust-road",
    title: "Dust on the Trail",
    location: "Kafue, Zambia",
    photographer: "Afari Trails",
    caption: "Between camps — the road as ritual.",
    category: "expedition-life",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "artisan-hands",
    title: "Artisan Hands",
    location: "Livingstone, Zambia",
    photographer: "Community",
    caption: "Craft passed through generations of touch.",
    category: "culture-people",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    related: { label: "Traditions That Endure", href: "/journal/traditions-that-endure" },
  },
  {
    id: "lens-feature",
    title: "Valley Silence",
    location: "South Luangwa, Zambia",
    photographer: "Chileshe Mwansa",
    caption: "The Afari Lens — March edition.",
    category: "the-afari-lens",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
    span: "tall",
  },
  {
    id: "camp-evening",
    title: "Evening at Camp",
    location: "Okavango Delta, Botswana",
    photographer: "Afari Trails",
    caption: "Lantern light and the sound of distant water.",
    category: "expedition-life",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "leopard-dusk",
    title: "Leopard Hour",
    location: "South Luangwa, Zambia",
    photographer: "Afari Trails",
    caption: "When the valley belongs to shadow.",
    category: "wildlife",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
    related: { label: "The Art of Patience", href: "/journal/the-art-of-patience" },
  },
  {
    id: "desert-line",
    title: "Desert Horizon",
    location: "Namibia",
    photographer: "Afari Trails",
    caption: "Earth and sky in a single breath.",
    category: "landscapes",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
    span: "wide",
  },
  {
    id: "guide-portrait",
    title: "Guide at First Light",
    location: "Lower Zambezi, Zambia",
    photographer: "Afari Trails",
    caption: "Those who read the land before the sun rises.",
    category: "culture-people",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    related: { label: "Guides of the Trail", href: "/journal/guides-of-the-trail" },
  },
  {
    id: "behind-brand",
    title: "Field Notes",
    location: "Livingstone, Zambia",
    photographer: "Afari Trails",
    caption: "Behind Afari — sketches of what we are building.",
    category: "behind-afari",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
    related: { label: "Our Ventures", href: "/ventures" },
  },
  {
    id: "wetland",
    title: "Wetland Mirror",
    location: "Kafue, Zambia",
    photographer: "Afari Trails",
    caption: "Still water holding the sky.",
    category: "landscapes",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
    span: "tall",
  },
  {
    id: "conservation",
    title: "On Patrol",
    location: "Lower Zambezi, Zambia",
    photographer: "Afari Trails",
    caption: "Guardianship as daily practice.",
    category: "wildlife",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    related: { label: "Guardians of the Wild", href: "/journal/guardians-of-the-wild" },
  },
];
