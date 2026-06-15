export type ConnectPageSectionKey =
  | "hero"
  | "intro"
  | "categories"
  | "form"
  | "direct"
  | "gallery"
  | "newsletter"
  | "closing";

export type ConnectPageSectionVisibility = Record<
  ConnectPageSectionKey,
  boolean
>;

export const CONNECT_PAGE_SECTION_LABELS: Record<ConnectPageSectionKey, string> =
  {
    hero: "Hero",
    intro: "Intro",
    categories: "Categories",
    form: "Form",
    direct: "Direct contact",
    gallery: "Gallery",
    newsletter: "Newsletter",
    closing: "Closing quote",
  };

/** Sections shown on each public connect page (and in admin). */
export const CONNECT_PAGE_SECTIONS: Record<
  "contact" | "expeditions",
  ConnectPageSectionVisibility
> = {
  contact: {
    hero: true,
    intro: true,
    categories: false,
    form: true,
    direct: true,
    gallery: false,
    newsletter: true,
    closing: true,
  },
  expeditions: {
    hero: true,
    intro: true,
    categories: false,
    form: true,
    direct: true,
    gallery: false,
    newsletter: true,
    closing: true,
  },
};

export function visibleConnectSections(
  pageKey: "contact" | "expeditions",
): ConnectPageSectionKey[] {
  const visibility = CONNECT_PAGE_SECTIONS[pageKey];
  return (
    Object.keys(CONNECT_PAGE_SECTION_LABELS) as ConnectPageSectionKey[]
  ).filter((key) => visibility[key]);
}
