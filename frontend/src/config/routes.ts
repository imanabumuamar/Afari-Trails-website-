/**
 * Central route paths for navigation and links.
 * Use these constants instead of hardcoded strings.
 */
export const ROUTES = {
  home: "/",
  ventures: "/ventures",
  venturesPartner: "/contact",
  venturesEcoLodge: "/ventures/eco-lodge",
  venturesConservation: "/ventures/conservation",
  venturesCommunity: "/ventures/community",
  venturesAgriculture: "/ventures/agriculture",
  venturesHospitality: "/ventures/hospitality",
  expeditions: "/expeditions",
  expeditionsAll: "/expeditions/all",
  journal: "/journal",
  journalArchive: "/journal/archive",
  archive: "/archive",
  archiveSubmit: "/archive/submit",
  store: "/store",
  storeCart: "/store/cart",
  storeCheckoutSuccess: "/store/checkout/success",
  storeCheckoutCancel: "/store/checkout/cancel",
  storeCollection: (slug: string) => `/store/collections/${slug}`,
  storeProduct: (slug: string) => `/store/${slug}`,
  about: "/about",
  contact: "/contact",
  connect: "/contact",
  expeditionsConnect: "/expeditions/connect",
  venturesConnect: "/contact",
  ventureProject: (slug: string) => `/ventures/projects/${slug}`,
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
    { label: "Connect With Us", href: ROUTES.contact },
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
  ROUTES.venturesEcoLodge,
  ROUTES.venturesConservation,
  ROUTES.venturesCommunity,
  ROUTES.venturesAgriculture,
  ROUTES.venturesHospitality,
  ROUTES.expeditions,
  ROUTES.expeditionsAll,
  ROUTES.journal,
  ROUTES.archive,
  ROUTES.store,
  ROUTES.about,
  ROUTES.contact,
  ROUTES.expeditionsConnect,
];

/** Expedition detail pages use fullscreen cinematic heroes */
export function isExpeditionDetailPath(pathname: string): boolean {
  return (
    pathname.startsWith("/expeditions/") &&
    pathname !== ROUTES.expeditions &&
    pathname !== ROUTES.expeditionsAll &&
    pathname !== ROUTES.expeditionsConnect
  );
}

export function isVentureProjectPath(pathname: string): boolean {
  return pathname.startsWith("/ventures/projects/");
}
