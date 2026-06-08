import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getHomepageJournalStories } from "@/lib/journal/helpers";
import { getJournalContent } from "@/services/content/journal";

export async function FromTheJournal() {
  const { stories, homepageStorySlugs } = await getJournalContent();
  const articles = getHomepageJournalStories(stories, homepageStorySlugs);

  return (
    <section className="bg-safari-green-deep py-20 text-ivory lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:py-4">
            <SectionLabel light>From the Journal</SectionLabel>
            <h2 className="font-serif text-4xl font-light leading-tight md:text-[2.75rem]">
              Stories from the trail. Lessons for life.
            </h2>
            <Link
              href="/journal"
              className="mt-8 inline-block text-xs font-medium uppercase tracking-[0.25em] text-sand transition-colors hover:text-ivory"
            >
              Read the Journal →
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/journal/${article.slug}`}
                className="group flex gap-5 border border-ivory/10 bg-matte-black/30 p-4 transition-colors hover:border-ivory/20 hover:bg-matte-black/50 md:gap-6 md:p-5"
              >
                <div className="relative h-24 w-28 shrink-0 overflow-hidden md:h-28 md:w-36">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/45">
                    {article.dateDisplay}
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-light text-ivory transition-colors group-hover:text-sand md:text-2xl">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
