import type { VentureSlug } from "@/lib/data/venture-defaults";

export type VentureSectionType =
  | "main-hero"
  | "mission-block"
  | "stats-bar"
  | "focus-cards"
  | "card-list"
  | "section-header"
  | "project-list"
  | "featured-project"
  | "cta-banner"
  | "sub-hero"
  | "text-block"
  | "philosophy-block"
  | "focus-items"
  | "experience-grid"
  | "design-moodboard"
  | "pillars-block"
  | "image-gallery"
  | "quote-block"
  | "location-block"
  | "partner-cta"
  | "connect-page";

export type VentureSectionConfig = {
  key: string;
  type: VentureSectionType;
  title: string;
  description?: string;
};

export const VENTURE_PAGE_SECTIONS: Record<VentureSlug, VentureSectionConfig[]> = {
  main: [
    { key: "venturesHero", type: "main-hero", title: "Hero section", description: "Top banner — title, tagline, intro, and background image." },
    { key: "venturesMission", type: "mission-block", title: "Our mission", description: "Editorial block with image beside mission copy." },
    { key: "ventureStats", type: "stats-bar", title: "Stats bar", description: "Numbers row below the hero. Add or remove stats with + / −." },
    { key: "focusAreasSection", type: "section-header", title: "Focus areas heading", description: "Section label above the focus area cards." },
    { key: "focusAreas", type: "focus-cards", title: "Our focus areas", description: "Cards linking to each venture focus page." },
    { key: "featuredProject", type: "featured-project", title: "Featured project", description: "Split layout — dark panel with title, copy, and CTA beside a large project image." },
    { key: "venturesCta", type: "cta-banner", title: "Closing section", description: "Final quote, heading, body, and background image." },
  ],
  "eco-lodge": [
    { key: "ecoLodgeHero", type: "sub-hero", title: "Hero" },
    { key: "ecoLodgeConcept", type: "text-block", title: "The concept" },
    { key: "ecoLodgeExperiences", type: "experience-grid", title: "Experiences" },
    { key: "ecoLodgeDesign", type: "design-moodboard", title: "Architecture & design" },
    { key: "ecoLodgeSustainability", type: "pillars-block", title: "Sustainability" },
    { key: "ecoLodgeGallery", type: "image-gallery", title: "Gallery" },
    { key: "ecoLodgeFutureVision", type: "quote-block", title: "Future vision" },
    { key: "ecoLodgeLocation", type: "location-block", title: "Location" },
    { key: "ecoLodgePartnerCta", type: "partner-cta", title: "Partner CTA" },
    { key: "ecoLodgeClosing", type: "quote-block", title: "Closing quote" },
  ],
  conservation: [
    { key: "conservationHero", type: "sub-hero", title: "Hero" },
    { key: "conservationPhilosophy", type: "philosophy-block", title: "Philosophy" },
    { key: "conservationFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "conservationCommunity", type: "text-block", title: "Community" },
    { key: "conservationInitiatives", type: "text-block", title: "Initiatives" },
    { key: "conservationGallery", type: "image-gallery", title: "Gallery" },
    { key: "conservationPartners", type: "text-block", title: "Partners" },
    { key: "conservationValues", type: "pillars-block", title: "Values" },
    { key: "conservationInvolvement", type: "text-block", title: "Get involved" },
    { key: "conservationClosing", type: "quote-block", title: "Closing quote" },
  ],
  community: [
    { key: "communityHero", type: "sub-hero", title: "Hero" },
    { key: "communityPhilosophy", type: "philosophy-block", title: "Philosophy" },
    { key: "communityFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "communityStories", type: "experience-grid", title: "Stories" },
    { key: "communityCraftsmanship", type: "design-moodboard", title: "Craftsmanship" },
    { key: "communityInitiatives", type: "text-block", title: "Initiatives" },
    { key: "communityGallery", type: "image-gallery", title: "Gallery" },
    { key: "communityPartners", type: "text-block", title: "Partners" },
    { key: "communityCta", type: "partner-cta", title: "Call to action" },
    { key: "communityClosing", type: "quote-block", title: "Closing quote" },
  ],
  agriculture: [
    { key: "agricultureHero", type: "sub-hero", title: "Hero" },
    { key: "agricultureApproach", type: "text-block", title: "Approach" },
    { key: "agricultureFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "agricultureLand", type: "location-block", title: "The land" },
    { key: "agricultureCommunity", type: "text-block", title: "Community" },
    { key: "agricultureInitiatives", type: "text-block", title: "Initiatives" },
    { key: "agricultureGallery", type: "image-gallery", title: "Gallery" },
    { key: "agriculturePartners", type: "text-block", title: "Partners" },
    { key: "agricultureEcosystem", type: "pillars-block", title: "Ecosystem" },
    { key: "agricultureClosing", type: "quote-block", title: "Closing quote" },
  ],
  hospitality: [
    { key: "hospitalityHero", type: "sub-hero", title: "Hero" },
    { key: "hospitalityPhilosophy", type: "philosophy-block", title: "Philosophy" },
    { key: "hospitalityFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "hospitalityDesign", type: "design-moodboard", title: "Design" },
    { key: "hospitalityExperience", type: "quote-block", title: "Experience quote" },
    { key: "hospitalityDestinations", type: "text-block", title: "Destinations" },
    { key: "hospitalitySustainability", type: "pillars-block", title: "Sustainability" },
    { key: "hospitalityGallery", type: "image-gallery", title: "Gallery" },
    { key: "hospitalityPartnership", type: "partner-cta", title: "Partnership" },
    { key: "hospitalityEcosystem", type: "text-block", title: "Ecosystem" },
    { key: "hospitalityClosing", type: "quote-block", title: "Closing quote" },
  ],
  partner: [
    { key: "partnerHero", type: "sub-hero", title: "Hero" },
    { key: "partnerIntro", type: "text-block", title: "Introduction" },
    { key: "partnershipTypes", type: "card-list", title: "Partnership types" },
    { key: "partnerVision", type: "quote-block", title: "Vision" },
    { key: "partnerMoodboard", type: "image-gallery", title: "Moodboard" },
    { key: "partnerCollaborators", type: "text-block", title: "Collaborators" },
    { key: "partnerForm", type: "text-block", title: "Form copy" },
    { key: "partnerClosing", type: "quote-block", title: "Closing quote" },
  ],
  connect: [
    { key: "venturesConnectConfig", type: "connect-page", title: "Connect page" },
  ],
};
