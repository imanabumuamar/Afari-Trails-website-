import { FeaturedExpeditions } from "@/components/home/FeaturedExpeditions";
import { FromTheJournal } from "@/components/home/FromTheJournal";
import { Hero } from "@/components/home/Hero";
import { OurEssence } from "@/components/home/OurEssence";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <OurEssence />
      <FeaturedExpeditions />
      <FromTheJournal />
    </>
  );
}
