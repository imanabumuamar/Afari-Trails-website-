import { CommunityClosing } from "@/components/ventures/community/CommunityClosing";
import { CommunityCraftsmanship } from "@/components/ventures/community/CommunityCraftsmanship";
import { CommunityCta } from "@/components/ventures/community/CommunityCta";
import { CommunityFocusAreas } from "@/components/ventures/community/CommunityFocusAreas";
import { CommunityGallery } from "@/components/ventures/community/CommunityGallery";
import { CommunityHero } from "@/components/ventures/community/CommunityHero";
import { CommunityInitiatives } from "@/components/ventures/community/CommunityInitiatives";
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
      <CommunityInitiatives />
      <CommunityGallery />
      <CommunityPartners />
      <CommunityCta />
      <CommunityClosing />
    </>
  );
}
