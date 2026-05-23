import { AgricultureApproach } from "@/components/ventures/agriculture/AgricultureApproach";
import { AgricultureClosing } from "@/components/ventures/agriculture/AgricultureClosing";
import { AgricultureCommunity } from "@/components/ventures/agriculture/AgricultureCommunity";
import { AgricultureEcosystem } from "@/components/ventures/agriculture/AgricultureEcosystem";
import { AgricultureFocusAreas } from "@/components/ventures/agriculture/AgricultureFocusAreas";
import { AgricultureGallery } from "@/components/ventures/agriculture/AgricultureGallery";
import { AgricultureHero } from "@/components/ventures/agriculture/AgricultureHero";
import { AgricultureInitiatives } from "@/components/ventures/agriculture/AgricultureInitiatives";
import { AgricultureLand } from "@/components/ventures/agriculture/AgricultureLand";
import { AgriculturePartners } from "@/components/ventures/agriculture/AgriculturePartners";

export const metadata = {
  title: "Sustainable Agriculture",
  description:
    "Regenerative African agriculture — land stewardship, community partnership, food security, and long-term resilience within the Afari Trails vision.",
};

export default function AgriculturePage() {
  return (
    <>
      <AgricultureHero />
      <AgricultureApproach />
      <AgricultureFocusAreas />
      <AgricultureLand />
      <AgricultureCommunity />
      <AgricultureInitiatives />
      <AgricultureGallery />
      <AgriculturePartners />
      <AgricultureEcosystem />
      <AgricultureClosing />
    </>
  );
}
