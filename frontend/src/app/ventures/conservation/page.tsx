import { ConservationClosing } from "@/components/ventures/conservation/ConservationClosing";
import { ConservationCommunity } from "@/components/ventures/conservation/ConservationCommunity";
import { ConservationFocusAreas } from "@/components/ventures/conservation/ConservationFocusAreas";
import { ConservationHero } from "@/components/ventures/conservation/ConservationHero";
import { ConservationInvolvement } from "@/components/ventures/conservation/ConservationInvolvement";
import { ConservationPartners } from "@/components/ventures/conservation/ConservationPartners";
import { ConservationPhilosophy } from "@/components/ventures/conservation/ConservationPhilosophy";
import { ConservationValues } from "@/components/ventures/conservation/ConservationValues";

export const metadata = {
  title: "Conservation",
  description:
    "Afari Trails — exploration rooted in responsibility. Long-term conservation, community collaboration, and ethical stewardship across Africa.",
};

export default function ConservationPage() {
  return (
    <>
      <ConservationHero />
      <ConservationPhilosophy />
      <ConservationFocusAreas />
      <ConservationCommunity />
      <ConservationPartners />
      <ConservationValues />
      <ConservationInvolvement />
      <ConservationClosing />
    </>
  );
}
