import { SectionLabel } from "@/components/ui/SectionLabel";
import { communityPartners } from "@/lib/data/community";

export function CommunityPartners() {
  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{communityPartners.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {communityPartners.heading}
          </h2>
          <p className="mt-8 text-sm leading-[1.9] text-charcoal/65 md:text-base">
            {communityPartners.body}
          </p>
        </div>

        <ul className="mx-auto mt-16 grid max-w-4xl gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          {communityPartners.placeholders.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center bg-ivory px-6 py-10 text-center"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-charcoal/45">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
