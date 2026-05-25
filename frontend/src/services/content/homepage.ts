import { writeFileSync } from "fs";
import path from "path";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import {
  HOMEPAGE_IMAGE_FIELDS,
  HOMEPAGE_VIDEO_FIELDS,
  type ContentImage,
  type HomepageContent,
  type HomepageHero,
  type HomepageImageField,
  type HomepageMediaField,
} from "@/types/homepage";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";

const FILENAME = "homepage.json";

const DEFAULT_HERO: HomepageHero = {
  heading: "Every trail changes the person walking it.",
  subtext:
    "Curated expeditions. Meaningful ventures. Timeless safari-inspired living.",
  poster: {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
    alt: "Safari landscape at golden hour",
  },
  video: "/videos/hero.mp4",
  primaryCta: { label: "Explore Expeditions", href: "/expeditions" },
  secondaryCta: { label: "Discover Ventures", href: "/ventures" },
};

const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: DEFAULT_HERO,
  featureCards: {
    expeditions: {
      src: "/images/home-expeditions-featured.png",
      alt: "Lush gorge with a bridge spanning the valley and river below",
    },
    ventures: {
      src: "/images/home-ventures-featured.png",
      alt: "Saddle-billed storks walking through sunlit grassland",
    },
    store: {
      src: "/images/home-store-featured.png",
      alt: "Afari Trails safari cap with embroidered logo on stone in the savanna",
    },
  },
  ourEssence: {
    src: "/images/home-our-essence.png",
    alt: "Waterbuck standing between trees in sunlit African woodland",
  },
  updatedAt: new Date(0).toISOString(),
};

function normalizeHomepage(raw: Partial<HomepageContent>): HomepageContent {
  return {
    hero: {
      ...DEFAULT_HERO,
      ...raw.hero,
      poster: { ...DEFAULT_HERO.poster, ...raw.hero?.poster },
      primaryCta: { ...DEFAULT_HERO.primaryCta, ...raw.hero?.primaryCta },
      secondaryCta: { ...DEFAULT_HERO.secondaryCta, ...raw.hero?.secondaryCta },
    },
    featureCards: {
      expeditions: raw.featureCards?.expeditions ?? DEFAULT_HOMEPAGE.featureCards.expeditions,
      ventures: raw.featureCards?.ventures ?? DEFAULT_HOMEPAGE.featureCards.ventures,
      store: raw.featureCards?.store ?? DEFAULT_HOMEPAGE.featureCards.store,
    },
    ourEssence: raw.ourEssence ?? DEFAULT_HOMEPAGE.ourEssence,
    updatedAt: raw.updatedAt ?? DEFAULT_HOMEPAGE.updatedAt,
  };
}

function setNestedImage(
  content: HomepageContent,
  field: HomepageImageField,
  image: ContentImage
): HomepageContent {
  if (field === "hero.poster") {
    return { ...content, hero: { ...content.hero, poster: image } };
  }
  if (field === "ourEssence") {
    return { ...content, ourEssence: image };
  }
  const key = field.split(".")[1] as keyof HomepageContent["featureCards"];
  return {
    ...content,
    featureCards: { ...content.featureCards, [key]: image },
  };
}

function getNestedImage(
  content: HomepageContent,
  field: HomepageImageField
): ContentImage {
  if (field === "hero.poster") return content.hero.poster;
  if (field === "ourEssence") return content.ourEssence;
  const key = field.split(".")[1] as keyof HomepageContent["featureCards"];
  return content.featureCards[key];
}

export function getHomepage(): HomepageContent {
  try {
    return normalizeHomepage(readJsonFile<Partial<HomepageContent>>(FILENAME));
  } catch {
    return DEFAULT_HOMEPAGE;
  }
}

/** Loads homepage from MongoDB API with JSON file fallback. */
export async function getHomepageAsync(): Promise<HomepageContent> {
  const remote = await fetchCmsJson<Partial<HomepageContent>>("/content/homepage");
  if (remote) return normalizeHomepage(remote);
  return getHomepage();
}

export function saveHomepage(
  patch: Partial<Pick<HomepageContent, "hero" | "featureCards" | "ourEssence">>
): HomepageContent {
  const current = getHomepage();
  const next = normalizeHomepage({
    hero: patch.hero ? { ...current.hero, ...patch.hero } : current.hero,
    featureCards: patch.featureCards
      ? {
          expeditions: patch.featureCards.expeditions ?? current.featureCards.expeditions,
          ventures: patch.featureCards.ventures ?? current.featureCards.ventures,
          store: patch.featureCards.store ?? current.featureCards.store,
        }
      : current.featureCards,
    ourEssence: patch.ourEssence ?? current.ourEssence,
    updatedAt: new Date().toISOString(),
  });
  return writeJsonFile(FILENAME, next);
}

export function updateHomepageImage(
  field: HomepageImageField,
  file: Buffer,
  mimeType: string,
  alt?: string
): HomepageContent {
  const { filename } = HOMEPAGE_IMAGE_FIELDS[field];
  const ext =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : "jpg";

  const publicDir = path.join(process.cwd(), "public", "images");
  const imagePath = path.join(publicDir, `${filename}.${ext}`);
  writeFileSync(imagePath, file);

  const src = `/images/${filename}.${ext}`;
  const current = getHomepage();
  const existing = getNestedImage(current, field);

  const next = setNestedImage(current, field, {
    src,
    alt: alt?.trim() || existing.alt,
  });

  return writeJsonFile(FILENAME, {
    ...next,
    updatedAt: new Date().toISOString(),
  });
}

export function updateHomepageVideo(
  field: "hero.video",
  file: Buffer
): HomepageContent {
  const { filename } = HOMEPAGE_VIDEO_FIELDS[field];
  const publicDir = path.join(process.cwd(), "public", "videos");
  const videoPath = path.join(publicDir, `${filename}.mp4`);
  writeFileSync(videoPath, file);

  const current = getHomepage();
  const next: HomepageContent = {
    ...current,
    hero: { ...current.hero, video: `/videos/${filename}.mp4` },
    updatedAt: new Date().toISOString(),
  };

  return writeJsonFile(FILENAME, next);
}

export function isHomepageImageField(
  field: string
): field is HomepageImageField {
  return field in HOMEPAGE_IMAGE_FIELDS;
}

export function isHomepageVideoField(field: string): field is "hero.video" {
  return field === "hero.video";
}

export type { HomepageMediaField };
