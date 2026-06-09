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
  | "service-grid"
  | "experience-grid"
  | "design-moodboard"
  | "pillars-block"
  | "image-gallery"
  | "quote-block"
  | "location-block"
  | "partner-cta"
  | "community-stories"
  | "string-list-block"
  | "craftsmanship-block"
  | "connect-page";

export type VentureSectionConfig = {
  key: string;
  type: VentureSectionType;
  title: string;
  description?: string;
  /** Show a photo uploader for section types that render an image (e.g. philosophy-block). */
  hasImage?: boolean;
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
    {
      key: "ecoLodgeWhoWeAre",
      type: "location-block",
      title: "Who we are",
      description: "Label, heading, body, and section photo.",
    },
    {
      key: "ecoLodgeWhatWeDo",
      type: "focus-items",
      title: "What we do",
      description: "Service cards with photo, title, and description.",
    },
    { key: "ecoLodgeWhyAfrica", type: "location-block", title: "Why Africa" },
    { key: "ecoLodgeApproach", type: "pillars-block", title: "Our approach" },
    { key: "ecoLodgeInvestment", type: "philosophy-block", title: "Investment & partnerships" },
    { key: "ecoLodgeGalleryIntro", type: "text-block", title: "Gallery heading" },
    { key: "ecoLodgeGallery", type: "image-gallery", title: "Gallery images" },
    { key: "ecoLodgeFinalCta", type: "partner-cta", title: "Final call to action" },
  ],
  conservation: [
    { key: "conservationHero", type: "sub-hero", title: "Hero" },
    { key: "conservationPhilosophy", type: "philosophy-block", title: "Philosophy" },
    { key: "conservationFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "conservationCommunity", type: "location-block", title: "Community & local impact" },
    { key: "conservationInitiatives", type: "text-block", title: "Initiatives" },
    { key: "conservationGallery", type: "image-gallery", title: "Gallery" },
    { key: "conservationPartners", type: "text-block", title: "Partners" },
    { key: "conservationValues", type: "pillars-block", title: "Values" },
    { key: "conservationInvolvement", type: "text-block", title: "Get involved" },
    { key: "conservationClosing", type: "quote-block", title: "Closing quote" },
  ],
  community: [
    { key: "communityHero", type: "sub-hero", title: "Hero" },
    { key: "communityPhilosophy", type: "philosophy-block", title: "Philosophy", hasImage: true },
    { key: "communityFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "communityStories", type: "community-stories", title: "Local stories", description: "Heading text, plus pick which archive photos appear as stories." },
    { key: "communityCraftsmanship", type: "craftsmanship-block", title: "Craftsmanship", description: "Text, highlight list, and three moodboard photos." },
    { key: "communityInitiatives", type: "string-list-block", title: "Future initiatives", description: "Label, heading, intro, and the list of initiative items." },
    { key: "communityPartners", type: "text-block", title: "Partners" },
    { key: "communityCta", type: "partner-cta", title: "Call to action" },
    { key: "communityClosing", type: "quote-block", title: "Closing quote" },
  ],
  agriculture: [
    { key: "agricultureHero", type: "sub-hero", title: "Hero" },
    {
      key: "agricultureApproach",
      type: "text-block",
      title: "Approach",
      description: "Label, statement, and supporting paragraph.",
    },
    { key: "agricultureFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "agricultureLand", type: "location-block", title: "The land" },
    { key: "agricultureCommunity", type: "location-block", title: "Community impact" },
    { key: "agricultureInitiatives", type: "string-list-block", title: "Future initiatives", description: "Label, heading, intro, and the list of initiative items." },
    { key: "agricultureGallery", type: "image-gallery", title: "Gallery" },
    { key: "agriculturePartners", type: "text-block", title: "Partners" },
    { key: "agricultureEcosystem", type: "pillars-block", title: "Ecosystem" },
    { key: "agricultureClosing", type: "quote-block", title: "Closing quote" },
  ],
  hospitality: [
    { key: "hospitalityHero", type: "sub-hero", title: "Hero" },
    { key: "hospitalityPhilosophy", type: "philosophy-block", title: "Philosophy", hasImage: true },
    { key: "hospitalityFocusAreas", type: "focus-items", title: "Focus areas" },
    { key: "hospitalityDesign", type: "location-block", title: "Architecture & design", description: "Label, heading, body, and one section photo." },
    { key: "hospitalityExperience", type: "quote-block", title: "Experience quote" },
    { key: "hospitalitySustainability", type: "pillars-block", title: "Sustainability" },
    { key: "hospitalityPartnership", type: "partner-cta", title: "Partnership" },
    { key: "hospitalityEcosystem", type: "text-block", title: "Ecosystem" },
    { key: "hospitalityClosing", type: "quote-block", title: "Closing quote" },
  ],
  partner: [
    { key: "partnerHero", type: "sub-hero", title: "Hero" },
    { key: "partnerIntro", type: "text-block", title: "Introduction" },
    { key: "partnerVision", type: "quote-block", title: "Vision" },
    { key: "partnerCollaborators", type: "text-block", title: "Collaborators" },
    { key: "partnerForm", type: "text-block", title: "Form copy" },
    { key: "partnerClosing", type: "quote-block", title: "Closing quote" },
  ],
  connect: [
    { key: "venturesConnectConfig", type: "connect-page", title: "Connect page" },
  ],
};
