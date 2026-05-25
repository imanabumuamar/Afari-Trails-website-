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
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2400&q=80",
} as const;

export const journalNewsletter = {
  heading: "Stories. Inspiration. Africa.",
  image:
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2400&q=80",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
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
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  },
];

export const featuredStory = journalStories.find((s) => s.featured)!;

export const featuredSideStories = journalStories.filter((s) => s.featuredSide);

export const latestStories = journalStories.filter(
  (s) => !s.featured && !s.featuredSide,
);
