import type { ConnectPageConfig } from "@/types/connect-page";

/** Main site connect page — general inquiries across Afari */
export const generalConnectConfig: ConnectPageConfig = {
  hero: {
    label: "Connect With Afari",
    heading: "Every Meaningful Journey Begins With a Conversation.",
    subheading:
      "Whether you're exploring partnerships, creative collaborations, hospitality, or future ventures — we'd love to hear from you.",
    cta: "Begin the Conversation",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2400&q=80",
    imageAlt: "Travelers gathered around a campfire at dusk",
  },
  intro: {
    label: "Welcome",
    statement:
      "Afari Trails exists through connection — between people, landscapes, stories, and ideas.",
    body: "Reach out for hospitality and venture partnerships, media and storytelling collaborations, conservation and community initiatives, or simply to share a vision. We read every message with care.",
  },
  categories: {
    label: "",
    heading: "",
    items: [],
  },
  form: {
    label: "Begin Together",
    heading: "Begin the Conversation",
    subtext:
      "We look forward to hearing your story, ideas, and vision.",
    submitLabel: "Begin the Conversation",
    successMessage:
      "Thank you. Your message has been received — we will be in touch when the trail aligns.",
    inquiryOptions: [
      { value: "partnerships", label: "Partnerships" },
      { value: "hospitality", label: "Hospitality Development" },
      { value: "conservation", label: "Conservation" },
      { value: "community", label: "Community" },
      { value: "agriculture", label: "Sustainable Agriculture" },
      { value: "investment", label: "Investment" },
      { value: "media", label: "Media" },
      { value: "store", label: "Store" },
      { value: "general", label: "General Inquiry" },
    ],
  },
  direct: {
    email: "hello@afaritrails.com",
    location: "Lusaka, Zambia",
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
    ],
  },
  gallery: [],
  newsletter: {
    heading: "Stay Close to the Trail",
    subtext: "Stories, expeditions, and reflections from across Africa.",
    placeholder: "Your email",
    submitLabel: "Join",
    successMessage: "Welcome to the trail — we'll be in touch.",
  },
  closing: {
    quote: "The best journeys begin with connection.",
  },
};
