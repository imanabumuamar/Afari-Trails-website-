import { venturesPartnersCollaborations as defaultSection } from "@/lib/data/ventures";
import type {
  VenturePartnerLogo,
  VenturesPartnersCollaborations,
} from "@/types/ventures-partners";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizePartner(
  item: unknown,
  index: number,
): VenturePartnerLogo | null {
  const row =
    item && typeof item === "object" && !Array.isArray(item)
      ? (item as Record<string, unknown>)
      : {};

  const name = asString(row.name);
  const id = asString(row.id) || `partner-${index + 1}`;
  if (!name && !asString(row.logo)) return null;

  return {
    id,
    name: name || "Partner Logo",
    logo: asString(row.logo),
    href: asString(row.href),
  };
}

export function resolveVenturesPartnersCollaborations(
  data: Record<string, unknown>,
): VenturesPartnersCollaborations {
  const raw = data.venturesPartnersCollaborations as
    | Partial<VenturesPartnersCollaborations>
    | undefined;

  const partners = Array.isArray(raw?.partners)
    ? raw.partners
        .map((item, index) => normalizePartner(item, index))
        .filter((item): item is VenturePartnerLogo => Boolean(item))
    : [...defaultSection.partners];

  return {
    visible: raw?.visible === true,
    heading: raw?.heading?.trim() || defaultSection.heading,
    description: raw?.description?.trim() || defaultSection.description,
    partners: partners.length > 0 ? partners : [...defaultSection.partners],
    ctaLabel: raw?.ctaLabel?.trim() || defaultSection.ctaLabel,
    ctaHref: raw?.ctaHref?.trim() || defaultSection.ctaHref,
  };
}

export function isVenturesPartnersCollaborationsVisible(
  section: VenturesPartnersCollaborations,
): boolean {
  return section.visible === true;
}
