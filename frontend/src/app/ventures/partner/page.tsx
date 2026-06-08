import { PartnerClosing } from "@/components/ventures/partner/PartnerClosing";
import { PartnerCollaborators } from "@/components/ventures/partner/PartnerCollaborators";
import { PartnerForm } from "@/components/ventures/partner/PartnerForm";
import { PartnerHero } from "@/components/ventures/partner/PartnerHero";
import { PartnerIntro } from "@/components/ventures/partner/PartnerIntro";
import { PartnerVision } from "@/components/ventures/partner/PartnerVision";

export const metadata = {
  title: "Partner With Us",
  description:
    "Join Afari Trails in building the future of African exploration — collaborations in hospitality, conservation, media, and meaningful experiences.",
};

export default function PartnerPage() {
  return (
    <>
      <PartnerHero />
      <PartnerIntro />
      <PartnerVision />
      <PartnerCollaborators />
      <PartnerForm />
      <PartnerClosing />
    </>
  );
}
