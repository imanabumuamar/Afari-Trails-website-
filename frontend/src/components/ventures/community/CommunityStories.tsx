import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { getArchiveContent, getPublishedImages } from "@/services/content/archive";
import { communityStories as default_communityStories } from "@/lib/data/community";
import {
  isCommunityStoryVisible,
  resolveCommunityArchiveItems,
  resolveCommunityProfiles,
  usesArchiveCommunityStories,
} from "@/lib/ventures/community-stories-shared";

type StoryCard = {
  key: string;
  image: string;
  role: string;
  name: string;
  quote: string;
};

export async function CommunityStories() {
  const content = await getVenturePageContent("community");
  const communityStories =
    content.communityStories as typeof default_communityStories;
  const storiesData = communityStories as Record<string, unknown>;

  let cards: StoryCard[];

  if (usesArchiveCommunityStories(storiesData)) {
    const archive = await getArchiveContent();
    const published = getPublishedImages(archive.images);
    const byId = new Map(published.map((img) => [img.id, img]));
    const items = resolveCommunityArchiveItems(storiesData).filter(
      isCommunityStoryVisible,
    );

    cards = items
      .map((item) => byId.get(item.archiveId))
      .filter((img): img is NonNullable<typeof img> => Boolean(img))
      .map((img) => ({
        key: img.id,
        image: img.image,
        role: img.location,
        name: img.title,
        quote: img.caption,
      }));
  } else {
    cards = resolveCommunityProfiles(storiesData)
      .filter(isCommunityStoryVisible)
      .map((profile) => ({
        key: profile.name,
        image: profile.image,
        role: profile.role,
        name: profile.name,
        quote: profile.quote,
      }));
  }

  if (cards.length === 0) return null;

  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>{communityStories.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {communityStories.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/60 md:text-base">
            {communityStories.intro}
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <article key={card.key} className="group">
              <div className="hover-zoom relative aspect-[3/4] overflow-hidden bg-charcoal/10">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover grayscale-[15%] transition-[filter] duration-700 group-hover:grayscale-0"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold-muted">
                  {card.role}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-light text-charcoal">
                  {card.name}
                </h3>
                {card.quote && (
                  <blockquote className="mt-4 text-sm leading-[1.85] text-charcoal/65 italic">
                    &ldquo;{card.quote}&rdquo;
                  </blockquote>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
