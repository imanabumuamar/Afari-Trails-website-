import type { ConnectPageConfig } from "@/types/connect-page";

/** Main site connect page — general inquiries across Afari */
export const generalConnectConfig: ConnectPageConfig = {
  hero: {
    label: "Connect With Afari",
    heading: "Every Meaningful Journey Begins With a Conversation.",
    subheading:
      "Whether you're exploring partnerships, expeditions, creative collaborations, or future ventures, we'd love to hear from you.",
    cta: "Begin the Conversation",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2400&q=80",
    imageAlt: "Travelers gathered around a campfire at dusk",
  },
  intro: {
    label: "Welcome",
    statement:
      "Afari Trails exists through connection — between people, landscapes, stories, and ideas.",
    body: "Reach out for expedition inquiries, hospitality and venture partnerships, media and storytelling collaborations, conservation and community initiatives, or simply to share a vision. We read every message with care.",
  },
  categories: {
    label: "How Can We Connect",
    heading: "Find your path in.",
    items: [
      {
        id: "expeditions",
        title: "Expeditions",
        description: "Safari and travel inquiries.",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
        href: "/expeditions/connect",
      },
      {
        id: "ventures",
        title: "Ventures & Partnerships",
        description: "Hospitality, conservation, and collaboration.",
        image:
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80",
        href: "/ventures/connect",
      },
      {
        id: "media",
        title: "Media & Storytelling",
        description: "Photography, film, journalism, and content.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
        href: "#form",
        inquiry: "media",
      },
      {
        id: "store",
        title: "Store",
        description: "Orders, products, and collaborations.",
        image:
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80",
        href: "#form",
        inquiry: "store",
      },
      {
        id: "general",
        title: "General Inquiries",
        description: "Everything else — we're listening.",
        image:
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80",
        href: "#form",
        inquiry: "general",
      },
    ],
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
      { value: "expeditions", label: "Expeditions" },
      { value: "partnerships", label: "Partnerships" },
      { value: "media", label: "Media" },
      { value: "hospitality", label: "Hospitality" },
      { value: "conservation", label: "Conservation" },
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
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
      alt: "Aerial wilderness landscape",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80",
      alt: "Golden savanna exploration",
    },
    {
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
      alt: "Campfire gathering",
    },
    {
      src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80",
      alt: "River at sunset",
    },
  ],
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
