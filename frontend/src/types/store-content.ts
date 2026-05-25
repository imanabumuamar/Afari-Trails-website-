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

export type CollectionIconType =
  | "giraffe"
  | "vehicle"
  | "campfire"
  | "mountains"
  | "trail"
  | "book";

export type StoreHero = {
  label: string;
  heading: string;
  subtext: string;
  image: string;
};

export type EditorialCollection = {
  slug: string;
  title: string;
  description: string;
  image: string;
  icon: CollectionIconType;
};

export type CuratedEssential = {
  slug: string;
  name: string;
  color: string;
  priceDisplay: string;
};

export type WorldOfAfari = {
  bandLabel: string;
  quote: string;
  attribution: string;
  body: string;
  cta: string;
  ctaHref: string;
  image: string;
};

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

export type StoreContentData = {
  hero: StoreHero;
  collections: EditorialCollection[];
  curatedEssentials: CuratedEssential[];
  worldOfAfari: WorldOfAfari;
  products: Product[];
};

export type StoreContentDocument = {
  key: string;
  data: StoreContentData;
  updatedAt: string;
};
