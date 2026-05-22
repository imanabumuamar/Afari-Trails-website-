export type JournalCategory =
  | "all"
  | "expeditions"
  | "conservation"
  | "culture"
  | "wildlife"
  | "people"
  | "reflections";

export const journalCategories: { id: JournalCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "expeditions", label: "Expeditions" },
  { id: "conservation", label: "Conservation" },
  { id: "culture", label: "Culture" },
  { id: "wildlife", label: "Wildlife" },
  { id: "people", label: "People" },
  { id: "reflections", label: "Reflections" },
];

export type JournalStory = {
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<JournalCategory, "all">;
  categoryLabel: string;
  readTime: string;
  dateDisplay: string;
  image: string;
  featured?: boolean;
  featuredSide?: boolean;
};

export const journalHero = {
  label: "Stories From the Trail",
  heading: "Journal",
  description:
    "Thoughts, stories, and field notes from our journeys across Africa. Reflections on nature, culture, conservation, and the human experience.",
  image:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=85",
} as const;

export const journalNewsletter = {
  heading: "Stories. Inspiration. Africa.",
  image:
    "https://images.unsplash.com/photo-1540541338287-417e03dee08f?w=2400&q=85",
} as const;

export const journalStories: JournalStory[] = [
  {
    slug: "rhythm-of-the-zambezi",
    title: "The Rhythm of the Zambezi",
    excerpt:
      "On the river, time moves differently — guided by current, light, and the quiet pulse of the wild.",
    category: "expeditions",
    categoryLabel: "Expeditions",
    readTime: "7 MIN READ",
    dateDisplay: "MAR 28, 2026",
    image:
      "https://images.unsplash.com/photo-1549366021-9f792d8d5e3c?w=1400&q=85",
    featured: true,
  },
  {
    slug: "guardians-of-the-wild",
    title: "Guardians of the Wild",
    excerpt:
      "The rangers and communities who stand between wilderness and loss.",
    category: "conservation",
    categoryLabel: "Conservation",
    readTime: "6 MIN READ",
    dateDisplay: "MAR 18, 2026",
    image:
      "https://images.unsplash.com/photo-1564760055778-dfe77213f821?w=800&q=85",
    featuredSide: true,
  },
  {
    slug: "traditions-that-endure",
    title: "Traditions That Endure",
    excerpt:
      "Heritage passed through hands, song, and the rituals of place.",
    category: "culture",
    categoryLabel: "Culture",
    readTime: "5 MIN READ",
    dateDisplay: "MAR 10, 2026",
    image:
      "https://images.unsplash.com/photo-1593113598332-32a0a134757f?w=800&q=85",
    featuredSide: true,
  },
  {
    slug: "in-the-presence-of-giants",
    title: "In the Presence of Giants",
    excerpt:
      "Standing still where elephants meet the river at dusk.",
    category: "wildlife",
    categoryLabel: "Wildlife",
    readTime: "4 MIN READ",
    dateDisplay: "FEB 24, 2026",
    image:
      "https://images.unsplash.com/photo-1589552603490-efd4e1f2836b?w=800&q=85",
    featuredSide: true,
  },
  {
    slug: "the-art-of-patience",
    title: "The Art of Patience",
    excerpt:
      "Waiting with the leopard — when the trail teaches you to see.",
    category: "wildlife",
    categoryLabel: "Wildlife",
    readTime: "5 MIN READ",
    dateDisplay: "MAR 22, 2026",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=800&q=85",
  },
  {
    slug: "life-around-the-campfire",
    title: "Life Around the Campfire",
    excerpt:
      "Night sounds, shared stories, and the warmth between expeditions.",
    category: "expeditions",
    categoryLabel: "Expeditions",
    readTime: "6 MIN READ",
    dateDisplay: "MAR 15, 2026",
    image:
      "https://images.unsplash.com/photo-1475928296734-496f6edc8174?w=800&q=85",
  },
  {
    slug: "voices-of-the-delta",
    title: "Voices of the Delta",
    excerpt:
      "Water, wingbeat, and the vast grammar of the Okavango.",
    category: "reflections",
    categoryLabel: "Reflections",
    readTime: "8 MIN READ",
    dateDisplay: "MAR 8, 2026",
    image:
      "https://images.unsplash.com/photo-1535330014194-e6e8b0e8b8b0?w=800&q=85",
  },
  {
    slug: "guides-of-the-trail",
    title: "Guides of the Trail",
    excerpt:
      "The people who read the land — and open it with care.",
    category: "people",
    categoryLabel: "People",
    readTime: "5 MIN READ",
    dateDisplay: "FEB 28, 2026",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa12f7f?w=800&q=85",
  },
  {
    slug: "conservation-is-community",
    title: "Conservation Is Community",
    excerpt:
      "Protecting wild places means investing in the people who steward them.",
    category: "conservation",
    categoryLabel: "Conservation",
    readTime: "8 MIN READ",
    dateDisplay: "FEB 14, 2026",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=85",
  },
  {
    slug: "walking-slower",
    title: "Why We Walk Slower",
    excerpt:
      "On foot, the landscape unfolds in chapters — not headlines.",
    category: "reflections",
    categoryLabel: "Reflections",
    readTime: "7 MIN READ",
    dateDisplay: "JAN 30, 2026",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=85",
  },
];

export const featuredStory = journalStories.find((s) => s.featured)!;

export const featuredSideStories = journalStories.filter((s) => s.featuredSide);

export const latestStories = journalStories.filter(
  (s) => !s.featured && !s.featuredSide,
);
