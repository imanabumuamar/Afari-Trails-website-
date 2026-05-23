import { SectionLabel } from "@/components/ui/SectionLabel";
import { conservationInitiatives } from "@/lib/data/conservation";

export function ConservationInitiatives() {
  return (
    <section
      id="initiatives"
      className="scroll-mt-24 bg-safari-green-deep py-24 text-ivory lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel light>{conservationInitiatives.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light md:text-5xl">
            {conservationInitiatives.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ivory/60 md:text-base">
            {conservationInitiatives.intro}
          </p>
        </div>

        <ul className="mt-16 grid gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {conservationInitiatives.items.map((item) => (
            <li
              key={item}
              className="flex items-center bg-safari-green-deep px-8 py-10 lg:px-10 lg:py-12"
            >
              <span className="font-serif text-xl font-light text-ivory lg:text-2xl">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
