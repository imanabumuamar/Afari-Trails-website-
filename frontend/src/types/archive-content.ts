/** URL slug for an archive collection (e.g. wildlife, landscapes). */
export type CollectionId = string;

export type ArchiveGridCategory = CollectionId | "all";

export type ArchiveCollection = {
  id: CollectionId;
  title: string;
  description: string;
  icon: string;
  image: string;
  /** When true, hidden from the live archive page and gallery filters. */
  hidden?: boolean;
};

export type ArchiveImageRecord = {
  id: string;
  title: string;
  location: string;
  photographer: string;
  caption: string;
  /** Collections this photo appears in (one or more). */
  categories: CollectionId[];
  image: string;
  span?: "tall" | "wide";
  published?: boolean;
  related?: {
    label: string;
    href: string;
  };
};

export type ArchivePageContent = {
  hero: {
    label: string;
    heading: string;
    description: string;
    image: string;
  };
  collectionsSection: {
    label: string;
    heading: string;
    viewAllHref: string;
  };
  afariLens: {
    label: string;
    heading: string;
    title: string;
    photographer: string;
    story: string;
    image: string;
    entriesLabel: string;
    entriesHref: string;
    editionsLabel: string;
    editionsHref: string;
    submitHref: string;
  };
  latestMomentsSection: {
    label: string;
    viewAllHref: string;
  };
  archiveSubmit: {
    quote: string;
    attribution: string;
    body: string;
    cta: string;
    href: string;
  };
  submitPage: {
    label: string;
    heading: string;
    intro: string;
    backHref: string;
  };
};

export type ArchiveContentData = {
  page: ArchivePageContent;
  collections: ArchiveCollection[];
  /** Ordered gallery image IDs shown in the Latest Moments strip. */
  latestMoments: string[];
  images: ArchiveImageRecord[];
};

export type ArchiveContentDocument = {
  key: string;
  data: ArchiveContentData;
  updatedAt: string;
};
