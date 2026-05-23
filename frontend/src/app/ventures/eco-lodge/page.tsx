import { EcoLodgeClosing } from "@/components/ventures/eco-lodge/EcoLodgeClosing";
import { EcoLodgeConcept } from "@/components/ventures/eco-lodge/EcoLodgeConcept";
import { EcoLodgeDesign } from "@/components/ventures/eco-lodge/EcoLodgeDesign";
import { EcoLodgeExperiences } from "@/components/ventures/eco-lodge/EcoLodgeExperiences";
import { EcoLodgeGallery } from "@/components/ventures/eco-lodge/EcoLodgeGallery";
import { EcoLodgeHero } from "@/components/ventures/eco-lodge/EcoLodgeHero";
import { EcoLodgeLocation } from "@/components/ventures/eco-lodge/EcoLodgeLocation";
import { EcoLodgePartnerCta } from "@/components/ventures/eco-lodge/EcoLodgePartnerCta";
import { EcoLodgeSustainability } from "@/components/ventures/eco-lodge/EcoLodgeSustainability";
import { EcoLodgeVision } from "@/components/ventures/eco-lodge/EcoLodgeVision";

export const metadata = {
  title: "Afari Eco Lodge",
  description:
    "A future hospitality vision — immersive African living rooted in wilderness, stillness, slow luxury, and sustainable design.",
};

export default function EcoLodgePage() {
  return (
    <>
      <EcoLodgeHero />
      <EcoLodgeConcept />
      <EcoLodgeExperiences />
      <EcoLodgeDesign />
      <EcoLodgeSustainability />
      <EcoLodgeGallery />
      <EcoLodgeVision />
      <EcoLodgeLocation />
      <EcoLodgePartnerCta />
      <EcoLodgeClosing />
    </>
  );
}
