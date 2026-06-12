import { EcoLodgeApproach } from "@/components/ventures/eco-lodge/EcoLodgeApproach";
import { EcoLodgeFinalCta } from "@/components/ventures/eco-lodge/EcoLodgeFinalCta";
import { EcoLodgeHero } from "@/components/ventures/eco-lodge/EcoLodgeHero";
import { EcoLodgeInvestment } from "@/components/ventures/eco-lodge/EcoLodgeInvestment";
import { EcoLodgeWhatWeDo } from "@/components/ventures/eco-lodge/EcoLodgeWhatWeDo";
import { EcoLodgeWhoWeAre } from "@/components/ventures/eco-lodge/EcoLodgeWhoWeAre";
import { EcoLodgeWhyAfrica } from "@/components/ventures/eco-lodge/EcoLodgeWhyAfrica";

export const metadata = {
  title: "Afari Eco Lodge",
  description:
    "End-to-end luxury eco lodge development across Africa — sustainable hospitality, conservation, and immersive safari experiences by Afari Trails.",
};

export default function EcoLodgePage() {
  return (
    <>
      <EcoLodgeHero />
      <EcoLodgeWhoWeAre />
      <EcoLodgeWhatWeDo />
      <EcoLodgeApproach />
      <EcoLodgeInvestment />
      <EcoLodgeWhyAfrica />
      <EcoLodgeFinalCta />
    </>
  );
}
