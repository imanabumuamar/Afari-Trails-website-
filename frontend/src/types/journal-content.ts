export type JournalCategoryId =
  | "all"
  | "expeditions"
  | "conservation"
  | "culture"
  | "wildlife"
  | "people"
  | "reflections";

export type JournalCategory = {
  id: JournalCategoryId;
  label: string;
};

export type JournalStoryRecord = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: Exclude<JournalCategoryId, "all">;
  categoryLabel: string;
  readTime: string;
  dateDisplay: string;
  image: string;
  featured?: boolean;
  featuredSide?: boolean;
  published?: boolean;
};

export type JournalPageContent = {
  hero: {
    label: string;
    heading: string;
    description: string;
    image: string;
  };
  newsletter: {
    heading: string;
    image: string;
  };
  categories: JournalCategory[];
};

export type JournalContentData = {
  page: JournalPageContent;
  stories: JournalStoryRecord[];
};

export type JournalContentDocument = {
  key: string;
  data: JournalContentData;
  updatedAt: string;
};
