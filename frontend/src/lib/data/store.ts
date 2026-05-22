export type StoreCategory =
  | "all"
  | "new-arrivals"
  | "apparel"
  | "accessories"
  | "field-essentials";

export type GearType =
  | "field-essentials"
  | "expedition-wear"
  | "camp-objects"
  | "travel-accessories";

export const storeHero = {
  label: "STORE",
  heading: "Designed for the Journey.",
  subtext:
    "Safari-inspired apparel and expedition essentials rooted in Africa.",
  image:
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=2400&q=85",
} as const;

export const storeNav = [
  { id: "new-arrivals" as const, label: "New Arrivals" },
  { id: "all" as const, label: "Collections" },
  { id: "apparel" as const, label: "Apparel" },
  { id: "accessories" as const, label: "Accessories" },
  { id: "field-essentials" as const, label: "Field Essentials" },
];

export type CollectionIconType =
  | "giraffe"
  | "vehicle"
  | "campfire"
  | "mountains"
  | "trail"
  | "book";

export const editorialCollections = [
  {
    slug: "safari-collection",
    title: "The Safari Collection",
    description:
      "Earthy expedition wear and timeless silhouettes for life on the trail.",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
    icon: "giraffe" as CollectionIconType,
  },
  {
    slug: "field-essentials",
    title: "Field Essentials",
    description:
      "Caps, bags, and accessories built for dusty roads and long horizons.",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=85",
    icon: "vehicle" as CollectionIconType,
  },
  {
    slug: "camp-collection",
    title: "The Camp Collection",
    description:
      "Relaxed lodge-inspired pieces for fireside evenings and slow mornings.",
    image:
      "https://images.unsplash.com/photo-1475928296734-496f6edc8174?w=1200&q=85",
    icon: "campfire" as CollectionIconType,
  },
  {
    slug: "expedition-layers",
    title: "Expedition Layers",
    description:
      "Lightweight outerwear inspired by African exploration and cool dawns.",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85",
    icon: "mountains" as CollectionIconType,
  },
  {
    slug: "trail-uniforms",
    title: "Trail Uniforms",
    description:
      "Minimal safari lifestyle staples — cut for movement and stillness.",
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=1200&q=85",
    icon: "trail" as CollectionIconType,
  },
  {
    slug: "journey-archive",
    title: "The Journey Archive",
    description:
      "Journals, keepsakes, and objects that hold the rhythm of the road.",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85",
    icon: "book" as CollectionIconType,
  },
];

export const curatedEssentials = [
  {
    slug: "expedition-field-jacket",
    name: "Expedition Field Jacket",
    color: "Khaki",
    priceDisplay: "$75",
  },
  {
    slug: "canvas-duffel",
    name: "Canvas Journey Bag",
    color: "Stone",
    priceDisplay: "$15",
  },
  {
    slug: "safari-cap",
    name: "Safari Cap",
    color: "Olive",
    priceDisplay: "$10",
  },
  {
    slug: "safari-shirt-dress",
    name: "Functional Shirt Dress",
    color: "Clay",
    priceDisplay: "$16",
  },
  {
    slug: "field-notebook",
    name: "Field Notebook Trio",
    color: "Tan",
    priceDisplay: "$16",
  },
  {
    slug: "expedition-scarf",
    name: "Lightweight Expedition Scarf",
    color: "Ivory",
    priceDisplay: "$18",
  },
] as const;

export const worldOfAfari = {
  bandLabel: "THE WORLD OF AFARI",
  quote:
    "Some places cannot be explained. Only experienced.",
  attribution: "— AFRICAN PROVERB",
  body: "Designed between campfires, landscapes, and the rhythm of the trail.",
  cta: "Submit Your Expedition Notes",
  ctaHref: "/archive/submit",
  image:
    "https://images.unsplash.com/photo-1516426122078-c23eafa7ebdb?w=2400&q=85",
} as const;

export type Product = {
  slug: string;
  name: string;
  price: number;
  priceDisplay: string;
  shortDescription: string;
  story: string;
  fabric: string;
  fit: string;
  functionality: string;
  weather: string;
  image: string;
  gallery: string[];
  collection: string;
  category: StoreCategory;
  gearType: GearType;
  isNew?: boolean;
  related: string[];
};

export const products: Product[] = [
  {
    slug: "expedition-field-jacket",
    name: "Expedition Field Jacket",
    price: 285,
    priceDisplay: "$285",
    shortDescription: "Lightweight outerwear for cool evenings and dusty roads.",
    story:
      "Inspired by long days on dusty roads and cool evenings beneath African skies — a layer that moves with you, not against the land.",
    fabric: "Cotton canvas blend, garment-washed",
    fit: "Relaxed expedition cut",
    functionality: "Multiple pockets, reinforced seams",
    weather: "Cool mornings, evening camp, light rain",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85",
      "https://images.unsplash.com/photo-1547471080-7cc2caa12f7f?w=1200&q=85",
      "https://images.unsplash.com/photo-1587595431973-c026f9778660?w=1200&q=85",
    ],
    collection: "expedition-layers",
    category: "apparel",
    gearType: "expedition-wear",
    isNew: true,
    related: ["safari-utility-vest", "safari-cap", "canvas-duffel"],
  },
  {
    slug: "safari-shirt-dress",
    name: "Safari Shirt Dress",
    price: 165,
    priceDisplay: "$165",
    shortDescription: "A timeless silhouette in stone-washed khaki.",
    story:
      "Cut for warmth and air — a dress that belongs equally to lodge verandas and open savanna.",
    fabric: "Breathable linen-cotton blend",
    fit: "Relaxed, mid-length",
    functionality: "Rollable sleeves, deep pockets",
    weather: "Warm days, layered evenings",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=85",
    ],
    collection: "safari-collection",
    category: "apparel",
    gearType: "expedition-wear",
    isNew: true,
    related: ["trail-linen-shirt", "expedition-scarf"],
  },
  {
    slug: "safari-utility-vest",
    name: "Safari Utility Vest",
    price: 195,
    priceDisplay: "$195",
    shortDescription: "Functional layers for field days and walking safaris.",
    story:
      "Born from the need to carry less and see more — pockets placed where the trail demands them.",
    fabric: "Waxed cotton, cotton lining",
    fit: "Regular, layerable",
    functionality: "Eight utility pockets, interior zip",
    weather: "All-day field use",
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=1200&q=85",
      "https://images.unsplash.com/photo-1547471080-7cc2caa12f7f?w=1200&q=85",
    ],
    collection: "safari-collection",
    category: "apparel",
    gearType: "expedition-wear",
    related: ["expedition-field-jacket", "field-notebook"],
  },
  {
    slug: "trail-linen-shirt",
    name: "Trail Linen Shirt",
    price: 145,
    priceDisplay: "$145",
    shortDescription: "Neutral overshirt for layered expedition days.",
    story: "Soft structure, sun-washed tone — the shirt you reach for at dawn.",
    fabric: "100% stone-washed linen",
    fit: "Oversized, unisex",
    functionality: "Breathable, quick to layer",
    weather: "Hot climates, humid mornings",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
    ],
    collection: "trail-uniforms",
    category: "apparel",
    gearType: "expedition-wear",
    related: ["safari-shirt-dress", "safari-cap"],
  },
  {
    slug: "safari-cap",
    name: "Safari Cap",
    price: 48,
    priceDisplay: "$48",
    shortDescription: "Classic cotton cap in muted khaki.",
    story: "Simple shade for long horizons — understated, essential.",
    fabric: "Washed cotton twill",
    fit: "Adjustable strap",
    functionality: "UV protection, packable",
    weather: "Sun-intensive days",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e68b?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e68b?w=1200&q=85",
    ],
    collection: "field-essentials",
    category: "accessories",
    gearType: "field-essentials",
    isNew: true,
    related: ["expedition-scarf", "canvas-duffel"],
  },
  {
    slug: "canvas-duffel",
    name: "Canvas Expedition Duffel",
    price: 195,
    priceDisplay: "$195",
    shortDescription: "Hard-wearing duffel for road and river transfers.",
    story:
      "Built for the space between destinations — where gear meets dust and purpose.",
    fabric: "Heavy canvas, leather trim",
    fit: "One size, 45L capacity",
    functionality: "Removable strap, interior pocket",
    weather: "Travel, camp, expedition transfers",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=85",
    ],
    collection: "field-essentials",
    category: "field-essentials",
    gearType: "field-essentials",
    related: ["safari-tote", "travel-journal"],
  },
  {
    slug: "field-notebook",
    name: "Field Notebook",
    price: 32,
    priceDisplay: "$32",
    shortDescription: "Linen-bound journal for trail notes and sketches.",
    story: "For the thoughts that arrive when the engine stops and the valley opens.",
    fabric: "Linen cover, cotton paper",
    fit: "A5, 120 pages",
    functionality: "Lay-flat binding, ribbon marker",
    weather: "Camp, travel, reflection",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85",
    ],
    collection: "field-essentials",
    category: "field-essentials",
    gearType: "field-essentials",
    related: ["travel-journal", "enamel-camp-mug"],
  },
  {
    slug: "expedition-scarf",
    name: "Expedition Scarf",
    price: 85,
    priceDisplay: "$85",
    shortDescription: "Woven scarf in sand and olive tones.",
    story: "Warmth without weight — for dawn drives and open vehicle crossings.",
    fabric: "Merino-cotton blend",
    fit: "Generous length",
    functionality: "Multi-wrap, breathable weave",
    weather: "Cool mornings, evening layers",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85",
    ],
    collection: "camp-collection",
    category: "accessories",
    gearType: "camp-objects",
    related: ["safari-shirt-dress", "enamel-camp-mug"],
  },
  {
    slug: "enamel-camp-mug",
    name: "Enamel Camp Mug",
    price: 28,
    priceDisplay: "$28",
    shortDescription: "Classic enamel mug for fireside evenings.",
    story: "The sound of metal on wood — ritual at every camp.",
    fabric: "Enamel steel",
    fit: "350ml",
    functionality: "Heat-resistant, stackable",
    weather: "Camp, lodge, outdoor dining",
    image:
      "https://images.unsplash.com/photo-1475928296734-496f6edc8174?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1475928296734-496f6edc8174?w=1200&q=85",
    ],
    collection: "camp-collection",
    category: "accessories",
    gearType: "camp-objects",
    related: ["travel-journal", "field-notebook"],
  },
  {
    slug: "safari-tote",
    name: "Safari Tote",
    price: 95,
    priceDisplay: "$95",
    shortDescription: "Canvas tote for market mornings and lodge days.",
    story: "Carry the essentials — nothing more, nothing less.",
    fabric: "Washed canvas",
    fit: "Wide shoulder drop",
    functionality: "Interior pocket, reinforced base",
    weather: "Daily carry, travel",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=85",
    ],
    collection: "field-essentials",
    category: "accessories",
    gearType: "travel-accessories",
    related: ["canvas-duffel", "safari-cap"],
  },
  {
    slug: "travel-journal",
    name: "Travel Journal",
    price: 45,
    priceDisplay: "$45",
    shortDescription: "Leather-bound journal for the long journey.",
    story: "Pages waiting for coordinates, sketches, and names of places.",
    fabric: "Vegetable-tanned leather",
    fit: "A5 format",
    functionality: "Elastic closure, archival paper",
    weather: "Travel, expedition, reflection",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85",
    ],
    collection: "camp-collection",
    category: "field-essentials",
    gearType: "camp-objects",
    related: ["field-notebook", "enamel-camp-mug"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slugs: string[]) {
  return slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => !!p);
}
