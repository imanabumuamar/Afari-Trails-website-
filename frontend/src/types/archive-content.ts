/** URL slug for an archive collection (e.g. wildlife, landscapes). */
export type CollectionId = string;

export type ArchiveGridCategory = CollectionId | "all";

export type ArchiveCollection = {
  id: CollectionId;
  title: string;
  description: string;
  icon: string;
  image: string;
};

export type ArchiveLatestMoment = {
  id: string;
  alt: string;
  image: string;
};

export type ArchiveImageRecord = {
  id: string;
  title: string;
  location: string;
  photographer: string;
  caption: string;
  category: CollectionId;
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
    submitHref: string;
    entriesHref: string;
    editionsHref: string;
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
  latestMoments: ArchiveLatestMoment[];
  images: ArchiveImageRecord[];
};

export type ArchiveContentDocument = {
  key: string;
  data: ArchiveContentData;
  updatedAt: string;
};
