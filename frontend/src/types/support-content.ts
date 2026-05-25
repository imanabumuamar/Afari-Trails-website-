export type SupportRelatedLink = {
  label: string;
  href: string;
};

export type SupportSection = {
  heading: string;
  paragraphs: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqPageContent = {
  label: string;
  title: string;
  intro: string;
  items: FaqItem[];
  relatedLinks: SupportRelatedLink[];
};

export type PolicyPageContent = {
  label: string;
  title: string;
  intro: string;
  sections: SupportSection[];
  relatedLinks: SupportRelatedLink[];
};

export type SupportContentData = {
  faq: FaqPageContent;
  shipping: PolicyPageContent;
  returns: PolicyPageContent;
};

export type SupportContentDocument = {
  key: string;
  data: SupportContentData;
  updatedAt: string;
};
