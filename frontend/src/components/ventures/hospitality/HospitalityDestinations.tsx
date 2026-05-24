import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { hospitalityDestinations as default_hospitalityDestinations } from "@/lib/data/hospitality";

export async function HospitalityDestinations() {
  const content = await getVenturePageContent("hospitality");
  const hospitalityDestinations = content.hospitalityDestinations as typeof default_hospitalityDestinations;

  return (
    <section className="bg-safari-green-deep py-24 text-ivory lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel light>{hospitalityDestinations.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light md:text-5xl">
            {hospitalityDestinations.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ivory/60 md:text-base">
            {hospitalityDestinations.intro}
          </p>
        </div>

        <ul className="mt-16 space-y-0 border-t border-ivory/15">
          {hospitalityDestinations.items.map((item) => (
            <li
              key={item}
              className="border-b border-ivory/15 py-8 lg:py-10"
            >
              <span className="font-serif text-2xl font-light text-ivory lg:text-3xl">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
