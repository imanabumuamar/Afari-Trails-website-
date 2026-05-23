import { SectionLabel } from "@/components/ui/SectionLabel";
import { hospitalitySustainability } from "@/lib/data/hospitality";

export function HospitalitySustainability() {
  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{hospitalitySustainability.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {hospitalitySustainability.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/60">
            {hospitalitySustainability.intro}
          </p>
        </div>

        <ul className="mx-auto mt-16 grid max-w-5xl gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {hospitalitySustainability.pillars.map((pillar) => (
            <li key={pillar.title}>
              <h3 className="font-serif text-xl font-light text-charcoal lg:text-2xl">
                {pillar.title}
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-charcoal/55 md:text-sm">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
