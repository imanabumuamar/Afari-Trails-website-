import { ABOUT_CONTENT_DEFAULTS } from "@/lib/data/about-defaults";
import type {
  AboutBehindImage,
  AboutContentData,
} from "@/types/about-content";

function normalizeBehindImage(
  img: string | AboutBehindImage | Record<string, unknown>,
): AboutBehindImage {
  if (typeof img === "string") {
    return { src: img, name: "", position: "" };
  }
  const record = img as Record<string, unknown>;
  return {
    src: typeof record.src === "string" ? record.src : "",
    name: typeof record.name === "string" ? record.name : "",
    position: typeof record.position === "string" ? record.position : "",
  };
}

function mergeSection<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

/** Keep name/position from whichever copy has them filled in. */
export function preferFilledBehindPeople(
  primary: AboutContentData,
  secondary: AboutContentData,
): AboutContentData {
  const images = primary.behindTheBrand.images.map((img, idx) => {
    const other = secondary.behindTheBrand.images[idx];
    if (!other) return img;
    return {
      ...img,
      name: img.name.trim() ? img.name : other.name,
      position: img.position.trim() ? img.position : other.position,
    };
  });
  return {
    ...primary,
    behindTheBrand: { ...primary.behindTheBrand, images },
  };
}

export function mergeAboutData(
  remote?: Partial<AboutContentData> | null,
): AboutContentData {
  const d = ABOUT_CONTENT_DEFAULTS;
  if (!remote) return d;

  const brandStory = mergeSection(d.brandStory, remote.brandStory);
  if (remote.brandStory?.leftManifesto?.length) {
    brandStory.leftManifesto = remote.brandStory.leftManifesto;
  }
  if (remote.brandStory?.rightBody?.length) {
    brandStory.rightBody = remote.brandStory.rightBody;
  }

  const visualStrip = mergeSection(d.visualStrip, remote.visualStrip);
  if (remote.visualStrip?.images?.length) {
    visualStrip.images = remote.visualStrip.images;
  }

  const philosophy = mergeSection(d.philosophy, remote.philosophy);
  if (remote.philosophy?.principles?.length) {
    philosophy.principles = remote.philosophy.principles;
  }

  const behindTheBrand = mergeSection(d.behindTheBrand, remote.behindTheBrand);
  if (remote.behindTheBrand?.images?.length) {
    behindTheBrand.images = remote.behindTheBrand.images.map((img) =>
      normalizeBehindImage(img as string | AboutBehindImage),
    );
  }

  const futureVision = mergeSection(d.futureVision, remote.futureVision);
  if (remote.futureVision?.pillars?.length) {
    futureVision.pillars = remote.futureVision.pillars;
  }

  return {
    hero: mergeSection(d.hero, remote.hero),
    brandStory,
    visualStrip,
    philosophy,
    whyWeExist: mergeSection(d.whyWeExist, remote.whyWeExist),
    behindTheBrand,
    futureVision,
    finalQuote: mergeSection(d.finalQuote, remote.finalQuote),
    getInTouch: mergeSection(d.getInTouch, remote.getInTouch),
  };
}
