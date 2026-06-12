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

export type StorePageMode = "coming-soon" | "live";

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
  /** When true, hidden from the live store page but kept in the CMS. */
  hidden?: boolean;
};

/** @deprecated Migrated to newArrivals — kept for reading legacy CMS JSON. */
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

/** Named choice list on a product, e.g. Size or Color. */
export type ProductOption = {
  name: string;
  values: string[];
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
  /** Shopper choices such as Size or Color (label + list of values). */
  options?: ProductOption[];
  isNew?: boolean;
  related: string[];
};

export type StoreContentData = {
  /** Public /store layout: hero-only coming soon vs full storefront. */
  pageMode: StorePageMode;
  hero: StoreHero;
  collections: EditorialCollection[];
  /** Product slugs featured in the New Arrivals section (order matters). */
  newArrivals: string[];
  worldOfAfari: WorldOfAfari;
  products: Product[];
};

export type StoreContentDocument = {
  key: string;
  data: StoreContentData;
  updatedAt: string;
};
