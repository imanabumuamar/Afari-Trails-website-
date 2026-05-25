export const expeditionsHero = {
  heading: "Journeys Into the Wild.",
  subtext:
    "Curated expeditions across Zambia and beyond — designed for travelers seeking deeper encounters with Africa's landscapes, cultures, and untamed beauty.",
  image:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
} as const;

export const ourPromise = {
  label: "Our Promise",
  heading: "More than a trip. A return to what truly matters.",
  body: "Every expedition is designed to reconnect people with nature, stillness, adventure, and the spirit of exploration — paced for presence, not performance.",
  approachHref: "#approach",
  image:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
} as const;

export const categoryBar = [
  {
    id: "safari",
    title: "Safari Expeditions",
    tagline: "Iconic wildlife. Timeless landscapes.",
    icon: "elephant",
  },
  {
    id: "wilderness",
    title: "Wilderness Expeditions",
    tagline: "Off the beaten path. Wild and remote.",
    icon: "mountain",
  },
  {
    id: "cultural",
    title: "Cultural Expeditions",
    tagline: "Discover traditions. Connect with people.",
    icon: "mask",
  },
  {
    id: "private",
    title: "Private Expeditions",
    tagline: "Tailored journeys. Beyond expectations.",
    icon: "compass",
  },
] as const;

export const featuredExpeditions = [
  {
    id: "south-luangwa",
    name: "South Luangwa",
    tagline: "Walking safaris and leopard country.",
    duration: "5 – 7 Days",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lower-zambezi",
    name: "Lower Zambezi",
    tagline: "River channels and golden-hour canoes.",
    duration: "4 – 6 Days",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "livingstone",
    name: "Livingstone",
    tagline: "Victoria Falls and the edge of adventure.",
    duration: "3 – 5 Days",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kafue",
    name: "Kafue National Park",
    tagline: "Floodplains, cheetah, and vast wilderness.",
    duration: "6 – 8 Days",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cultural-heritage",
    name: "Cultural Heritage",
    tagline: "Traditions, artisans, and living heritage.",
    duration: "4 – 5 Days",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export const expeditionApproach = {
  heading: "Thoughtful by nature. Meaningful by design.",
  body: "We craft journeys with intention — small groups, expert guides, sustainable partnerships, and authentic connection to the land and its people.",
  pillars: [
    { title: "Small Groups", icon: "group" },
    { title: "Expert Guides", icon: "guide" },
    { title: "Sustainable Travel", icon: "leaf" },
    { title: "Authentic Connections", icon: "heart" },
  ],
} as const;

export const expeditionsCta = {
  quote: "The wilderness has a way of returning us to ourselves.",
  readyLabel: "Ready to begin your journey?",
  boxText:
    "Let us design a private expedition tailored to your pace, interests, and style.",
  image:
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2400&q=80",
} as const;
