/**
 * Central route paths for navigation and links.
 * Use these constants instead of hardcoded strings.
 */
export const ROUTES = {
  home: "/",
  ventures: "/ventures",
  expeditions: "/expeditions",
  journal: "/journal",
  journalArchive: "/journal/archive",
  archive: "/archive",
  archiveSubmit: "/archive/submit",
  store: "/store",
  storeCollection: (slug: string) => `/store/collections/${slug}`,
  storeProduct: (slug: string) => `/store/${slug}`,
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  shipping: "/shipping",
  returns: "/returns",
  admin: "/admin",
  adminHomepage: "/admin/homepage",
} as const;

export const navLinks = [
  { label: "Home", href: ROUTES.home },
  { label: "Ventures", href: ROUTES.ventures },
  { label: "Expeditions", href: ROUTES.expeditions },
  { label: "Journal", href: ROUTES.journal },
  { label: "Archive", href: ROUTES.archive },
  { label: "Store", href: ROUTES.store },
  { label: "About", href: ROUTES.about },
] as const;

export const footerLinks = {
  explore: [
    { label: "Expeditions", href: ROUTES.expeditions },
    { label: "Ventures", href: ROUTES.ventures },
    { label: "Journal", href: ROUTES.journal },
    { label: "Archive", href: ROUTES.archive },
    { label: "Store", href: ROUTES.store },
  ],
  company: [
    { label: "About Us", href: ROUTES.about },
    { label: "Our Story", href: ROUTES.about },
    { label: "Contact", href: ROUTES.contact },
  ],
  support: [
    { label: "FAQ", href: ROUTES.faq },
    { label: "Shipping", href: ROUTES.shipping },
    { label: "Returns", href: ROUTES.returns },
  ],
} as const;

/** Pages with dark hero treatment (transparent header) */
export const DARK_HERO_PATHS: readonly string[] = [
  ROUTES.home,
  ROUTES.ventures,
  ROUTES.expeditions,
  ROUTES.journal,
  ROUTES.archive,
  ROUTES.store,
  ROUTES.about,
];
