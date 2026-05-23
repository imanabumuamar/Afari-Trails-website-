import { FeaturedProject } from "@/components/ventures/FeaturedProject";
import { FocusAreas } from "@/components/ventures/FocusAreas";
import { VenturesProjects } from "@/components/ventures/VenturesProjects";
import { VenturesCTA } from "@/components/ventures/VenturesCTA";
import { VenturesHero } from "@/components/ventures/VenturesHero";
import { VenturesMission } from "@/components/ventures/VenturesMission";
import { VenturesStats } from "@/components/ventures/VenturesStats";

export const metadata = {
  title: "Ventures",
  description:
    "Investing in Africa. Building legacies — sustainable hospitality, conservation, and community ventures by Afari Trails.",
};

export default function VenturesPage() {
  return (
    <>
      <VenturesHero />
      <VenturesMission />
      <VenturesStats />
      <FocusAreas />
      <VenturesProjects />
      <FeaturedProject />
      <VenturesCTA />
    </>
  );
}
