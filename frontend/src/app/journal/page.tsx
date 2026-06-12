import { JournalPageContent } from "@/components/journal/JournalPageContent";
import { getJournalContent } from "@/services/content/journal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journal",
  description:
    "Stories, field notes, and reflections from Afari Trails journeys across Africa.",
};

export default async function JournalPage() {
  const content = await getJournalContent();

  return <JournalPageContent content={content} />;
}
