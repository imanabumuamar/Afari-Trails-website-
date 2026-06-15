/** Editable image slot on the homepage */
export type ContentImage = {
  src: string;
  alt: string;
};

export type HomepageCta = {
  label: string;
  href: string;
};

export type HeroTextAlign = "left" | "center";
export type HeroVerticalPosition = "top" | "center" | "bottom";
export type HeroTextColor = "light" | "dark";
export type HeroHeight = "full" | "tall" | "medium";
export type HeroBackgroundMode = "photo" | "video";

export type HomepageHero = {
  /** Small label shown above the headline */
  eyebrow: string;
  heading: string;
  subtext: string;
  poster: ContentImage;
  /** MP4 path when backgroundMode is video */
  video: string;
  /** Photo-only or video background (video falls back to poster if file missing). */
  backgroundMode: HeroBackgroundMode;
  /** Darkness of the overlay over the background, 0–90 */
  overlayOpacity: number;
  textAlign: HeroTextAlign;
  verticalPosition: HeroVerticalPosition;
  textColor: HeroTextColor;
  height: HeroHeight;
  primaryCta: HomepageCta;
  secondaryCta: HomepageCta;
  showPrimaryCta: boolean;
  showSecondaryCta: boolean;
};

export type HomepageContent = {
  hero: HomepageHero;
  featureCards: {
    expeditions: ContentImage;
    ventures: ContentImage;
    store: ContentImage;
  };
  ourEssence: ContentImage;
  updatedAt: string;
};

export type HomepageImageField =
  | "hero.poster"
  | "featureCards.expeditions"
  | "featureCards.ventures"
  | "featureCards.store"
  | "ourEssence";

export type HomepageMediaField = HomepageImageField | "hero.video";

export const HOMEPAGE_IMAGE_FIELDS: Record<
  HomepageImageField,
  { filename: string; label: string }
> = {
  "hero.poster": {
    filename: "home-hero-poster",
    label: "Hero poster image",
  },
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

export const HOMEPAGE_VIDEO_FIELDS: Record<
  "hero.video",
  { filename: string; label: string }
> = {
  "hero.video": {
    filename: "hero",
    label: "Hero background video",
  },
};
