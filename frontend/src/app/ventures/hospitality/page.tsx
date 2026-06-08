import { HospitalityClosing } from "@/components/ventures/hospitality/HospitalityClosing";
import { HospitalityDesign } from "@/components/ventures/hospitality/HospitalityDesign";
import { HospitalityEcosystem } from "@/components/ventures/hospitality/HospitalityEcosystem";
import { HospitalityExperience } from "@/components/ventures/hospitality/HospitalityExperience";
import { HospitalityFocusAreas } from "@/components/ventures/hospitality/HospitalityFocusAreas";
import { HospitalityHero } from "@/components/ventures/hospitality/HospitalityHero";
import { HospitalityPartnership } from "@/components/ventures/hospitality/HospitalityPartnership";
import { HospitalityPhilosophy } from "@/components/ventures/hospitality/HospitalityPhilosophy";
import { HospitalitySustainability } from "@/components/ventures/hospitality/HospitalitySustainability";

export const metadata = {
  title: "Hospitality Development",
  description:
    "Afari Trails — visionary African hospitality. Architecture, wilderness, sustainability, and immersive experience design rooted in landscape and culture.",
};

export default function HospitalityPage() {
  return (
    <>
      <HospitalityHero />
      <HospitalityPhilosophy />
      <HospitalityFocusAreas />
      <HospitalityDesign />
      <HospitalityExperience />
      <HospitalitySustainability />
      <HospitalityPartnership />
      <HospitalityEcosystem />
      <HospitalityClosing />
    </>
  );
}
