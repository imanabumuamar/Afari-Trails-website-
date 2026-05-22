import { writeFileSync } from "fs";
import path from "path";
import {
  HOMEPAGE_IMAGE_FIELDS,
  type ContentImage,
  type HomepageContent,
  type HomepageImageField,
} from "@/types/homepage";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";

const FILENAME = "homepage.json";

const DEFAULT_HOMEPAGE: HomepageContent = {
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

function setNestedImage(
  content: HomepageContent,
  field: HomepageImageField,
  image: ContentImage
): HomepageContent {
  const [root, key] = field.split(".") as [keyof HomepageContent, string?];

  if (root === "ourEssence" && !key) {
    return { ...content, ourEssence: image };
  }

  if (root === "featureCards" && key) {
    return {
      ...content,
      featureCards: {
        ...content.featureCards,
        [key]: image,
      },
    };
  }

  return content;
}

function getNestedImage(
  content: HomepageContent,
  field: HomepageImageField
): ContentImage {
  if (field === "ourEssence") return content.ourEssence;
  const key = field.split(".")[1] as keyof HomepageContent["featureCards"];
  return content.featureCards[key];
}

export function getHomepage(): HomepageContent {
  try {
    return readJsonFile<HomepageContent>(FILENAME);
  } catch {
    return DEFAULT_HOMEPAGE;
  }
}

export function saveHomepage(
  patch: Partial<Pick<HomepageContent, "featureCards" | "ourEssence">> & {
    featureCards?: Partial<HomepageContent["featureCards"]>;
  }
): HomepageContent {
  const current = getHomepage();
  const next: HomepageContent = {
    featureCards: {
      expeditions: patch.featureCards?.expeditions ?? current.featureCards.expeditions,
      ventures: patch.featureCards?.ventures ?? current.featureCards.ventures,
      store: patch.featureCards?.store ?? current.featureCards.store,
    },
    ourEssence: patch.ourEssence ?? current.ourEssence,
    updatedAt: new Date().toISOString(),
  };
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
