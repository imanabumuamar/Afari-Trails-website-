/** Editable image slot on the homepage */
export type ContentImage = {
  src: string;
  alt: string;
};

export type HomepageContent = {
  featureCards: {
    expeditions: ContentImage;
    ventures: ContentImage;
    store: ContentImage;
  };
  ourEssence: ContentImage;
  updatedAt: string;
};

export type HomepageImageField =
  | "featureCards.expeditions"
  | "featureCards.ventures"
  | "featureCards.store"
  | "ourEssence";

export const HOMEPAGE_IMAGE_FIELDS: Record<
  HomepageImageField,
  { filename: string; label: string }
> = {
  "featureCards.expeditions": {
    filename: "home-expeditions-featured",
    label: "Expeditions card (under hero)",
  },
  "featureCards.ventures": {
    filename: "home-ventures-featured",
    label: "Ventures card (under hero)",
  },
  "featureCards.store": {
    filename: "home-store-featured",
    label: "Store card (under hero)",
  },
  ourEssence: {
    filename: "home-our-essence",
    label: "Our Essence section",
  },
};
