import type { ConnectPageConfig } from "@/types/connect-page";

export const expeditionsConnectConfig: ConnectPageConfig = {
  hero: {
    label: "Plan Your Journey",
    heading: "Every Great Expedition Begins With a Conversation.",
    subheading:
      "Tell us how you imagine Africa — pace, places, companions, and the kind of journey you want to remember for a lifetime.",
    cta: "Start Planning",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=2400&q=85",
    imageAlt: "Safari vehicle on the savanna at golden hour",
  },
  intro: {
    label: "For Travelers",
    statement:
      "We design expeditions for people who want more than a checklist — presence, wonder, and connection to wild places.",
    body: "Share your dates, interests, group size, and dream destinations. Our team will help shape a curated itinerary across Zambia and beyond — paced for stillness, not rush.",
  },
  categories: {
    label: "How We Can Help",
    heading: "Choose your starting point.",
    items: [
      {
        id: "custom",
        title: "Custom Safari",
        description: "A journey built entirely around you.",
        image:
          "https://images.unsplash.com/photo-1589552603490-efd4e1f2836b?w=900&q=85",
        href: "#form",
        inquiry: "custom-safari",
      },
      {
        id: "group",
        title: "Group Expedition",
        description: "Travel with a curated small group.",
        image:
          "https://images.unsplash.com/photo-1549366021-9f792d8d5e3c?w=900&q=85",
        href: "#form",
        inquiry: "group",
      },
      {
        id: "private",
        title: "Private Journey",
        description: "Exclusive access and bespoke pacing.",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=85",
        href: "#form",
        inquiry: "private",
      },
      {
        id: "questions",
        title: "Questions & Guidance",
        description: "Not sure where to begin — we're here.",
        image:
          "https://images.unsplash.com/photo-1473496167754-a98300e3ee24?w=900&q=85",
        href: "#form",
        inquiry: "general",
      },
    ],
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
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=1000&q=85",
      alt: "Wildlife on the savanna",
    },
    {
      src: "https://images.unsplash.com/photo-1540541338287-417e03dee08f?w=1000&q=85",
      alt: "River valley expedition",
    },
    {
      src: "https://images.unsplash.com/photo-1473496167754-a98300e3ee24?w=1000&q=85",
      alt: "Campfire on the trail",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=85",
      alt: "Mountain wilderness",
    },
  ],
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
