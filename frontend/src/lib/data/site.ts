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
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2400&q=80",
} as const;

// Re-export navigation for backward compatibility
export { footerLinks, navLinks } from "@/config/routes";
