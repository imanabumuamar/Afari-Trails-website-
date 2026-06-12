import { CommunityClosing } from "@/components/ventures/community/CommunityClosing";
import { CommunityCraftsmanship } from "@/components/ventures/community/CommunityCraftsmanship";
import { CommunityCta } from "@/components/ventures/community/CommunityCta";
import { CommunityFocusAreas } from "@/components/ventures/community/CommunityFocusAreas";
import { CommunityHero } from "@/components/ventures/community/CommunityHero";
import { CommunityPartners } from "@/components/ventures/community/CommunityPartners";
import { CommunityPhilosophy } from "@/components/ventures/community/CommunityPhilosophy";
import { CommunityStories } from "@/components/ventures/community/CommunityStories";

export const metadata = {
  title: "Community Empowerment",
  description:
    "Afari Trails — collaboration, opportunity, and cultural preservation. Community at the center of exploration, not the edges.",
};

export default function CommunityPage() {
  return (
    <>
      <CommunityHero />
      <CommunityPhilosophy />
      <CommunityFocusAreas />
      <CommunityStories />
      <CommunityCraftsmanship />
      <CommunityPartners />
      <CommunityCta />
      <CommunityClosing />
    </>
  );
}
