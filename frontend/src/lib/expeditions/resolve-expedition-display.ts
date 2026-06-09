import type {
  ExpeditionDetail,
  ExpeditionHeroStat,
  ExpeditionSectionCopy,
} from "@/types/expedition-detail";

export const DEFAULT_EXPEDITION_SECTIONS: ExpeditionSectionCopy = {
  overviewLabel: "Overview",
  overviewHeading: "",
  itineraryLabel: "Your Journey",
  itineraryHeading: "Expedition Itinerary",
  itinerarySubtext:
    "A day-by-day rhythm through the landscape — paced for presence, not performance.",
  itineraryCtaLabel: "View detailed itinerary",
  experiencesLabel: "What You'll Experience",
  experiencesHeading: "",
  galleryLabel: "Gallery",
  galleryHeading: "Moments from the trail",
  galleryCtaLabel: "View full gallery",
  accommodationLabel: "Accommodation",
  mapLabel: "Map & Route",
  mapHeading: "Your route through the wild",
  mapCtaLabel: "View on Google Maps",
  includedLabel: "What's included",
  notIncludedLabel: "What's not included",
  pricingLabel: "Starting from",
  storiesLabel: "Traveler Stories",
  storiesHeading: "Voices from the trail",
  faqLabel: "FAQ",
  faqHeading: "Before you travel",
  footerCtaHeading: "Ready for your next African adventure?",
  enquireLabel: "Enquire now",
  brochureLabel: "Download brochure",
  whatsappLabel: "Chat on WhatsApp",
};

function highlightValue(
  expedition: ExpeditionDetail,
  label: string,
): string | undefined {
  return expedition.highlights.find((h) => h.label === label)?.value;
}

export function resolveHeroStats(expedition: ExpeditionDetail): ExpeditionHeroStat[] {
  if (expedition.heroStats && expedition.heroStats.length > 0) {
    return expedition.heroStats.filter((s) => s.label !== "Difficulty");
  }
  const picks = ["Duration", "Best Season", "Style", "Group Size"];
  const stats: ExpeditionHeroStat[] = [];
  for (const label of picks) {
    const value = highlightValue(expedition, label);
    if (value) stats.push({ label, value });
    if (stats.length >= 4) break;
  }
  return stats;
}

export function resolveLocationLabel(expedition: ExpeditionDetail): string {
  if (expedition.locationLabel?.trim()) return expedition.locationLabel.trim();
  const location = highlightValue(expedition, "Location");
  if (location) return location.toUpperCase();
  return expedition.quickDetails[0]?.toUpperCase() ?? "";
}

export function resolveSectionCopy(
  expedition: ExpeditionDetail,
): ExpeditionSectionCopy {
  const s = expedition.sections ?? {};
  return {
    ...DEFAULT_EXPEDITION_SECTIONS,
    ...s,
    overviewHeading:
      s.overviewHeading?.trim() || expedition.intro.statement,
    experiencesHeading:
      s.experiencesHeading?.trim() || "The experience",
  };
}

export function resolveItineraryDayLabel(day: {
  day: number;
  dayLabel?: string;
}): string {
  return day.dayLabel?.trim() || `Day ${day.day}`;
}
