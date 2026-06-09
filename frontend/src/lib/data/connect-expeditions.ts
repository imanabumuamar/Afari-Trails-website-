import type { ConnectPageConfig } from "@/types/connect-page";

export const expeditionsConnectConfig: ConnectPageConfig = {
  hero: {
    label: "Plan Your Journey",
    heading: "Every Great Expedition Begins With a Conversation.",
    subheading:
      "Tell us how you imagine Africa — pace, places, companions, and the kind of journey you want to remember for a lifetime.",
    cta: "Start Planning",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
    imageAlt: "Safari vehicle on the savanna at golden hour",
  },
  intro: {
    label: "For Travelers",
    statement:
      "We design expeditions for people who want more than a checklist — presence, wonder, and connection to wild places.",
    body: "Share your dates, interests, group size, and dream destinations. Our team will help shape a curated itinerary across Zambia and beyond — paced for stillness, not rush.",
  },
  categories: {
    label: "",
    heading: "",
    items: [],
  },
  form: {
    label: "Your Journey",
    heading: "Tell us about your expedition",
    subtext:
      "We read every inquiry personally and respond with care — usually within a few days.",
    submitLabel: "Send Inquiry",
    successMessage:
      "Thank you. Your journey begins here — we'll be in touch soon to start planning.",
    inquiryOptions: [
      { value: "custom-safari", label: "Custom Safari" },
      { value: "group", label: "Group Expedition" },
      { value: "private", label: "Private Journey" },
      { value: "dates", label: "Dates & Availability" },
      { value: "family", label: "Family Travel" },
      { value: "general", label: "General Question" },
    ],
  },
  direct: {
    email: "journeys@afaritrails.com",
    location: "Lusaka, Zambia",
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
    ],
  },
  gallery: [],
  newsletter: {
    heading: "Stories From the Trail",
    subtext: "Expedition inspiration, field notes, and new journeys across Africa.",
    placeholder: "Your email",
    submitLabel: "Subscribe",
    successMessage: "Welcome — the trail awaits.",
  },
  closing: {
    quote: "The wilderness does not rush. Neither should the journey to reach it.",
  },
};
