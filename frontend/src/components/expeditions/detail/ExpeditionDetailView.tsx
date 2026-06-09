import { ExpeditionAccommodation } from "@/components/expeditions/detail/ExpeditionAccommodation";
import { ExpeditionDetailFooterCta } from "@/components/expeditions/detail/ExpeditionDetailFooterCta";
import { ExpeditionDetailHero } from "@/components/expeditions/detail/ExpeditionDetailHero";
import { ExpeditionExperiences } from "@/components/expeditions/detail/ExpeditionExperiences";
import { ExpeditionFaq } from "@/components/expeditions/detail/ExpeditionFaq";
import { ExpeditionGallery } from "@/components/expeditions/detail/ExpeditionGallery";
import { ExpeditionInquiry } from "@/components/expeditions/detail/ExpeditionInquiry";
import { ExpeditionIntro } from "@/components/expeditions/detail/ExpeditionIntro";
import { ExpeditionItinerary } from "@/components/expeditions/detail/ExpeditionItinerary";
import { ExpeditionMapPricing } from "@/components/expeditions/detail/ExpeditionMapPricing";
import { ExpeditionRelated } from "@/components/expeditions/detail/ExpeditionRelated";
import { ExpeditionStories } from "@/components/expeditions/detail/ExpeditionStories";
import { isExpeditionSectionVisible } from "@/lib/expeditions/expedition-page-sections";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionDetailViewProps = {
  expedition: ExpeditionDetail;
};

export async function ExpeditionDetailView({
  expedition,
}: ExpeditionDetailViewProps) {
  return (
    <>
      {isExpeditionSectionVisible(expedition, "hero") && (
        <ExpeditionDetailHero expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "overview") && (
        <ExpeditionIntro expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "itinerary") && (
        <ExpeditionItinerary expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "experiences") && (
        <ExpeditionExperiences expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "gallery") && (
        <ExpeditionGallery expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "accommodation") && (
        <ExpeditionAccommodation expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "mapPricing") && (
        <ExpeditionMapPricing expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "stories") && (
        <ExpeditionStories expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "faq") && (
        <ExpeditionFaq expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "inquiry") && (
        <ExpeditionInquiry expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "footerCta") && (
        <ExpeditionDetailFooterCta expedition={expedition} />
      )}
      {isExpeditionSectionVisible(expedition, "related") && (
        <ExpeditionRelated expedition={expedition} />
      )}
    </>
  );
}
