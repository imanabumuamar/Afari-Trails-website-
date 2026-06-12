export const venturesHero = {
  title: "Ventures",
  tagline: "Investing in Africa. Building legacies.",
  intro:
    "Afari Trails Ventures is committed to sustainable development across hospitality, conservation, and community — creating long-term value for the land, its people, and those who journey through it.",
  image:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
} as const;

export const venturesMission = {
  label: "Our Mission",
  heading: "Developing Africa's potential with purpose.",
  body: "We partner on ventures that honor wilderness, empower communities, and build hospitality rooted in authenticity — bridging tourism, conservation, and local development for generations to come.",
  approachHref: "#focus-areas",
  image:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    icon: "lodge",
    href: "/ventures/eco-lodge" as const,
  },
  {
    id: "conservation",
    title: "Conservation",
    description:
      "Wildlife preservation and eco-conscious operations across wild places.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    icon: "leaf",
    href: "/ventures/conservation" as const,
  },
  {
    id: "community",
    title: "Community Empowerment",
    description:
      "Local employment, education, and artisan collaborations that endure.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    icon: "people",
    href: "/ventures/community" as const,
  },
  {
    id: "agriculture",
    title: "Sustainable Agriculture",
    description:
      "Regenerative land stewardship and agricultural partnerships.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    icon: "crop",
    href: "/ventures/agriculture" as const,
  },
  {
    id: "hospitality",
    title: "Hospitality Development",
    description:
      "Safari retreats, wellness camps, and boutique properties.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
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

/** @deprecated Legacy single featured project — migrated to featuredProjects */
export const featuredProject = {
  label: "Featured Projects",
  title: "Zambezi Lodge Development",
  description:
    "An eco-lodge vision along the Zambezi corridor — low-impact hospitality designed for stillness, river views, and deep connection to the valley.",
  status: "In Development",
  image:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
  href: "/ventures/projects/zambezi-lodge",
  ctaLabel: "View Project →",
} as const;

export const featuredProjectsSection = {
  label: "Featured Projects",
  intro:
    "Long-term hospitality, conservation, and community ventures — each with its own story, vision, and path forward.",
} as const;

export const featuredProjects = [
  {
    id: "zambezi-lodge",
    title: "Zambezi Lodge Development",
    description:
      "An eco-lodge vision along the Zambezi corridor — low-impact hospitality designed for stillness, river views, and deep connection to the valley.",
    status: "In Development",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
    imageAlt: "River valley at golden hour",
    ctaLabel: "View Project →",
    published: true,
    hidden: false,
    story:
      "Along the Zambezi corridor, Afari Trails is developing a low-impact eco-lodge vision — architecture that defers to the river, the forest, and the rhythm of the valley.",
    vision:
      "To create a hospitality destination that protects wild corridors, employs local communities, and offers guests a deeply grounded sense of place.",
    locationLabel: "Location",
    locationHeading: "Zambezi Valley, Zambia",
    locationBody:
      "A riverside site selected for minimal ecological disturbance, access to conservation partnerships, and long-term community benefit.",
    locationImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
        alt: "Lodge concept overlooking wilderness",
      },
      {
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
        alt: "River and forest landscape",
      },
    ],
    communityImpact:
      "Local employment in construction and operations, artisan partnerships, and training programs tied to hospitality and conservation skills.",
    conservation:
      "Low-density design, renewable energy targets, waste reduction systems, and collaboration with regional wildlife initiatives.",
    timeline: [
      {
        date: "2024",
        title: "Site selection & partnerships",
        body: "Land assessment and alignment with conservation stakeholders.",
      },
      {
        date: "2025",
        title: "Concept & design development",
        body: "Architecture, guest experience planning, and impact framework.",
      },
      {
        date: "2026",
        title: "In development",
        body: "Advancing permits, partnerships, and phased build planning.",
      },
    ],
  },
  {
    id: "conservation-field-program",
    title: "Conservation Field Program",
    description:
      "A long-horizon conservation initiative supporting wildlife monitoring, habitat restoration, and community-led stewardship.",
    status: "Planned",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80",
    imageAlt: "Savanna at dusk",
    ctaLabel: "View Project →",
    published: true,
    hidden: false,
    story:
      "This program connects field research, local guardianship, and tourism revenue to protect landscapes Afari Trails explores.",
    vision:
      "Build durable conservation capacity through partnerships, training, and measurable ecological outcomes.",
    locationLabel: "Location",
    locationHeading: "Southern Africa",
    locationBody:
      "Pilot landscapes selected with community consent and existing conservation networks.",
    locationImage: "",
    gallery: [],
    communityImpact:
      "Ranger training, local employment, and revenue-sharing models tied to conservation outcomes.",
    conservation:
      "Habitat monitoring, anti-poaching collaboration, and regenerative land practices.",
    timeline: [
      {
        date: "2026",
        title: "Program design",
        body: "Partner mapping and pilot site evaluation.",
      },
    ],
  },
] as const;

export const venturesPartnersCollaborations = {
  visible: false,
  heading: "Partners & Collaborations",
  description:
    "We collaborate with organizations, communities, and industry leaders who share our vision for sustainable tourism, conservation, and responsible development.",
  partners: [
    { id: "partner-1", name: "Partner Logo", logo: "", href: "" },
    { id: "partner-2", name: "Partner Logo", logo: "", href: "" },
    { id: "partner-3", name: "Partner Logo", logo: "", href: "" },
    { id: "partner-4", name: "Partner Logo", logo: "", href: "" },
    { id: "partner-5", name: "Partner Logo", logo: "", href: "" },
    { id: "partner-6", name: "Partner Logo", logo: "", href: "" },
  ],
  ctaLabel: "Become a Partner",
  ctaHref: "/contact",
} as const;

export const venturesCta = {
  quote: "When we invest in Africa, we invest in a future worth leaving behind.",
  heading: "Let's Build Together",
  body: "We welcome conversations with landowners, hospitality partners, conservation groups, and aligned investors.",
  image:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
  ctaLabel: "Get In Touch →",
  ctaHref: "/ventures/connect",
} as const;

export const focusAreasSection = {
  label: "Our Focus Areas",
} as const;
