/** Global site copy and media (not navigation — see config/routes.ts) */
export const site = {
  name: "Afari Trails",
  nameUpper: "AFARI TRAILS",
  tagline: "Rooted in Africa. Designed for the journey.",
  footerTagline: "Proudly African. Globally Inspired.",
  quote: "Every trail changes the person walking it.",
  heroSubtext:
    "Curated expeditions. Meaningful ventures. Timeless safari-inspired living.",
  heroVideo: "/videos/hero.mp4",
  heroPoster:
    "https://images.unsplash.com/photo-1587595431973-c026f9778660?w=2400&q=85",
} as const;

// Re-export navigation for backward compatibility
export { footerLinks, navLinks } from "@/config/routes";
