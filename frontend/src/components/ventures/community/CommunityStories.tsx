import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { communityStories } from "@/lib/data/community";

export function CommunityStories() {
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
          {communityStories.profiles.map((profile) => (
            <article key={profile.name} className="group">
              <div className="hover-zoom relative aspect-[3/4] overflow-hidden bg-charcoal/10">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover grayscale-[15%] transition-[filter] duration-700 group-hover:grayscale-0"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold-muted">
                  {profile.role}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-light text-charcoal">
                  {profile.name}
                </h3>
                <blockquote className="mt-4 text-sm leading-[1.85] text-charcoal/65 italic">
                  &ldquo;{profile.quote}&rdquo;
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
