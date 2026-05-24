import Image from "next/image";
import Link from "next/link";
import type {
  ArchiveLatestMoment,
  ArchivePageContent,
} from "@/types/archive-content";

type LatestMomentsProps = {
  moments: ArchiveLatestMoment[];
  section: ArchivePageContent["latestMomentsSection"];
};

export function LatestMoments({ moments, section }: LatestMomentsProps) {
  return (
    <section className="bg-beige py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-charcoal/55">
            {section.label}
          </p>
          <Link
            href={section.viewAllHref}
            className="text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/50 transition-colors hover:text-gold"
          >
            View All Photos →
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none lg:gap-4">
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="hover-zoom relative h-[220px] w-[140px] shrink-0 overflow-hidden bg-charcoal/10 sm:h-[260px] sm:w-[160px] lg:h-[300px] lg:w-[180px]"
            >
              <Image
                src={moment.image}
                alt={moment.alt}
                fill
                className="object-cover"
                sizes="180px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
