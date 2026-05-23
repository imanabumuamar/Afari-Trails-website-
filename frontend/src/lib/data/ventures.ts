export const venturesHero = {
  title: "Ventures",
  tagline: "Investing in Africa. Building legacies.",
  intro:
    "Afari Trails Ventures is committed to sustainable development across hospitality, conservation, and community — creating long-term value for the land, its people, and those who journey through it.",
  image:
    "https://images.unsplash.com/photo-1540541338287-417e03dee08f?w=2400&q=85",
} as const;

export const venturesMission = {
  label: "Our Mission",
  heading: "Developing Africa's potential with purpose.",
  body: "We partner on ventures that honor wilderness, empower communities, and build hospitality rooted in authenticity — bridging tourism, conservation, and local development for generations to come.",
  approachHref: "#focus-areas",
  image:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=85",
} as const;

export const ventureStats = [
  { value: "8+", label: "Active Projects" },
  { value: "4", label: "Countries" },
  { value: "20+", label: "Local Partners" },
  { value: "1000+", label: "Lives Impacted" },
] as const;

export const focusAreas = [
  {
    id: "eco-lodges",
    title: "Eco-Lodges",
    description:
      "Boutique safari camps and wilderness stays immersed in the landscape.",
    image:
      "https://images.unsplash.com/photo-1549366021-9f792d8d5e3c?w=800&q=85",
    icon: "lodge",
    href: "/ventures/eco-lodge" as const,
  },
  {
    id: "conservation",
    title: "Conservation",
    description:
      "Wildlife preservation and eco-conscious operations across wild places.",
    image:
      "https://images.unsplash.com/photo-1589552603490-efd4e1f2836b?w=800&q=85",
    icon: "leaf",
    href: "/ventures/conservation" as const,
  },
  {
    id: "community",
    title: "Community Empowerment",
    description:
      "Local employment, education, and artisan collaborations that endure.",
    image:
      "https://images.unsplash.com/photo-1593113598332-32a0a134757f?w=800&q=85",
    icon: "people",
    href: "/ventures/community" as const,
  },
  {
    id: "agriculture",
    title: "Sustainable Agriculture",
    description:
      "Regenerative land stewardship and agricultural partnerships.",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=85",
    icon: "crop",
    href: "/ventures/agriculture" as const,
  },
  {
    id: "hospitality",
    title: "Hospitality Development",
    description:
      "Safari retreats, wellness camps, and boutique properties.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=85",
    icon: "home",
    href: "/ventures/hospitality" as const,
  },
] as const;

export const venturesProjectsSection = {
  label: "What We're Building",
  intro:
    "Active ventures and initiatives across hospitality, conservation, community, and land.",
} as const;

export const venturesProjects = [
  {
    id: "zambezi-lodge",
    title: "Zambezi Lodge Development",
    status: "In Development",
    category: "Hospitality",
    href: "/ventures/eco-lodge",
    featured: true,
  },
  {
    id: "conservation-field",
    title: "Conservation Field Program",
    status: "Exploring",
    category: "Conservation",
    href: "/ventures/conservation",
  },
  {
    id: "artisan-network",
    title: "Artisan Supply Network",
    status: "In Development",
    category: "Community",
    href: "/ventures/community",
  },
  {
    id: "regenerative-farm",
    title: "Regenerative Farm Pilot",
    status: "Planned",
    category: "Agriculture",
    href: "/ventures/agriculture",
  },
  {
    id: "wellness-retreat",
    title: "Wilderness Wellness Retreat",
    status: "Concept",
    category: "Hospitality",
    href: "/ventures/hospitality",
  },
] as const;

export const featuredProject = {
  label: "Featured Project",
  title: "Zambezi Lodge Development",
  description:
    "An eco-lodge vision along the Zambezi corridor — low-impact hospitality designed for stillness, river views, and deep connection to the valley.",
  status: "In Development",
  category: "Hospitality · Eco Lodge",
  image:
    "https://images.unsplash.com/photo-1540541338287-417e03dee08f?w=2400&q=85",
  href: "/ventures/eco-lodge",
} as const;

export const venturesCta = {
  quote: "When we invest in Africa, we invest in a future worth leaving behind.",
  heading: "Let's Build Together",
  body: "We welcome conversations with landowners, hospitality partners, conservation groups, and aligned investors.",
  image:
    "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=2400&q=85",
} as const;
