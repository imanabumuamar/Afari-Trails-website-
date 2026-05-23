export const partnerHero = {
  label: "Partner With Afari",
  heading: "Building the Future of African Exploration Together.",
  subheading:
    "Collaborations rooted in storytelling, culture, conservation, hospitality, and meaningful experiences across Africa.",
  cta: "Start a Conversation",
  image:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=85",
  imageAlt: "Aerial view of misty African mountains at golden hour",
} as const;

export const partnerIntro = {
  statement:
    "Afari Trails seeks partnerships that elevate exploration, preserve landscapes, and create experiences with lasting impact.",
  body: "We are building a long-term ecosystem — where hospitality, conservation, media, and design converge around a shared belief in Africa's future. Our collaborations are intentional, creative, and rooted in respect for the land and the people who steward it. We work with those who think in decades, not quarters.",
} as const;

export const partnershipTypes = [
  {
    id: "hospitality",
    title: "Hospitality",
    description: "Safari lodges, retreats, and camps shaped by place and purpose.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85",
  },
  {
    id: "conservation",
    title: "Conservation",
    description: "Wildlife and environmental projects that protect what we explore.",
    image:
      "https://images.unsplash.com/photo-1589552603490-efd4e1f2836b?w=1200&q=85",
  },
  {
    id: "tourism",
    title: "Tourism & Expeditions",
    description: "Local guides, operators, and experiences crafted with care.",
    image:
      "https://images.unsplash.com/photo-1549366021-9f792d8d5e3c?w=1200&q=85",
  },
  {
    id: "media",
    title: "Media & Storytelling",
    description: "Photographers, filmmakers, and writers who see Africa with depth.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=85",
  },
  {
    id: "brand",
    title: "Brand Collaborations",
    description: "Fashion, gear, and travel products aligned with the trail.",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85",
  },
  {
    id: "cultural",
    title: "Cultural Projects",
    description: "Communities, artisans, and heritage initiatives worth preserving.",
    image:
      "https://images.unsplash.com/photo-1593113598332-32a0a134757f?w=1200&q=85",
  },
] as const;

export const partnerVision = {
  quote:
    "We believe Africa's future belongs to experiences that protect, inspire, and reconnect people with the land.",
} as const;

export const partnerMoodboard = [
  {
    src: "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=900&q=85",
    alt: "Golden savanna at dusk",
  },
  {
    src: "https://images.unsplash.com/photo-1540541338287-417e03dee08f?w=900&q=85",
    alt: "Safari lodge architecture overlooking wilderness",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=85",
    alt: "River winding through African landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1473496167754-a98300e3ee24?w=900&q=85",
    alt: "Campfire glow in the wilderness",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85",
    alt: "Aerial mountain ridges",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-32a0a134757f?w=900&q=85",
    alt: "Artisan craftsmanship",
  },
  {
    src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=900&q=85",
    alt: "Cultural gathering in warm light",
  },
] as const;

export const partnerCollaborators = {
  label: "Who We Work With",
  heading: "Aligned partners across the continent.",
  body: "We are currently building relationships with partners across exploration, conservation, design, and hospitality sectors.",
  placeholders: [
    "Conservation organizations",
    "Safari camps & lodges",
    "Photographers & filmmakers",
    "Creative studios",
    "Tourism boards",
    "Hospitality brands",
  ],
} as const;

export const partnerForm = {
  label: "Begin Together",
  heading: "Start a conversation.",
  subtext:
    "Share your vision. We review every inquiry with care and respond to aligned opportunities.",
  submitLabel: "Begin the Conversation",
  partnershipOptions: [
    { value: "hospitality", label: "Hospitality" },
    { value: "conservation", label: "Conservation" },
    { value: "media", label: "Media" },
    { value: "brand", label: "Brand Collaboration" },
    { value: "investment", label: "Investment" },
    { value: "other", label: "Other" },
  ],
} as const;

export const partnerClosing = {
  quote: "The strongest journeys are never built alone.",
} as const;
