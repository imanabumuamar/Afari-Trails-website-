export type AboutHero = {
  label: string;
  heading: string;
  subtext: string;
  image: string;
};

export type AboutBrandStory = {
  label: string;
  leftManifesto: string[];
  rightBody: string[];
};

export type AboutVisualImage = {
  src: string;
  alt: string;
};

export type AboutVisualStrip = {
  sectionLabel: string;
  images: AboutVisualImage[];
};

export type AboutPrinciple = {
  title: string;
  icon: string;
};

export type AboutPhilosophy = {
  heading: string;
  principles: AboutPrinciple[];
};

export type AboutWhyWeExist = {
  quote: string;
  image: string;
};

export type AboutBehindImage = {
  src: string;
  name: string;
  /** Role or title shown under the name (e.g. Founder, Creative Director). */
  position: string;
};

export type AboutBehindTheBrand = {
  heading: string;
  images: AboutBehindImage[];
};

export type AboutPillar = {
  label: string;
  href: string;
  icon: string;
};

export type AboutFutureVision = {
  heading: string;
  body: string;
  pillars: AboutPillar[];
};

export type AboutFinalQuote = {
  text: string;
};

export type AboutGetInTouch = {
  heading: string;
  body: string;
  cta: string;
  href: string;
};

export type AboutContentData = {
  hero: AboutHero;
  brandStory: AboutBrandStory;
  visualStrip: AboutVisualStrip;
  philosophy: AboutPhilosophy;
  whyWeExist: AboutWhyWeExist;
  behindTheBrand: AboutBehindTheBrand;
  futureVision: AboutFutureVision;
  finalQuote: AboutFinalQuote;
  getInTouch: AboutGetInTouch;
};

export type AboutContentDocument = {
  key: string;
  data: AboutContentData;
  updatedAt: string;
};
