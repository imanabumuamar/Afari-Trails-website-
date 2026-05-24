import { ExpeditionAccommodation } from "@/components/expeditions/detail/ExpeditionAccommodation";
import { ExpeditionClosing } from "@/components/expeditions/detail/ExpeditionClosing";
import { ExpeditionDetailHero } from "@/components/expeditions/detail/ExpeditionDetailHero";
import { ExpeditionExperiences } from "@/components/expeditions/detail/ExpeditionExperiences";
import { ExpeditionFaq } from "@/components/expeditions/detail/ExpeditionFaq";
import { ExpeditionGallery } from "@/components/expeditions/detail/ExpeditionGallery";
import { ExpeditionHighlights } from "@/components/expeditions/detail/ExpeditionHighlights";
import { ExpeditionIncluded } from "@/components/expeditions/detail/ExpeditionIncluded";
import { ExpeditionInquiry } from "@/components/expeditions/detail/ExpeditionInquiry";
import { ExpeditionIntro } from "@/components/expeditions/detail/ExpeditionIntro";
import { ExpeditionItinerary } from "@/components/expeditions/detail/ExpeditionItinerary";
import { ExpeditionPhilosophy } from "@/components/expeditions/detail/ExpeditionPhilosophy";
import { ExpeditionRelated } from "@/components/expeditions/detail/ExpeditionRelated";
import { ExpeditionVisualStrip } from "@/components/expeditions/detail/ExpeditionVisualStrip";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionDetailViewProps = {
  expedition: ExpeditionDetail;
};

export async function ExpeditionDetailView({
  expedition,
}: ExpeditionDetailViewProps) {
  return (
    <>
      <ExpeditionDetailHero expedition={expedition} />
      <ExpeditionIntro expedition={expedition} />
      <ExpeditionHighlights expedition={expedition} />
      <ExpeditionVisualStrip expedition={expedition} />
      <ExpeditionItinerary expedition={expedition} />
      <ExpeditionAccommodation expedition={expedition} />
      <ExpeditionExperiences expedition={expedition} />
      <ExpeditionGallery expedition={expedition} />
      <ExpeditionIncluded expedition={expedition} />
      <ExpeditionPhilosophy expedition={expedition} />
      <ExpeditionFaq expedition={expedition} />
      <ExpeditionInquiry expedition={expedition} />
      <ExpeditionRelated expedition={expedition} />
      <ExpeditionClosing expedition={expedition} />
    </>
  );
}
