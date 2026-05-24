import { ecoLodgeClosing as default_ecoLodgeClosing } from "@/lib/data/eco-lodge";
import { getVenturePageContent } from "@/services/content/ventures";

export async function EcoLodgeClosing() {
  const content = await getVenturePageContent("eco-lodge");
  const ecoLodgeClosing = content.ecoLodgeClosing as typeof default_ecoLodgeClosing;

  return (
    <section className="relative flex min-h-[50vh] items-center justify-center bg-matte-black px-6 py-28 lg:min-h-[55vh]">
      <div className="absolute inset-0 bg-gradient-to-t from-safari-green-deep/25 via-transparent to-matte-black" />
      <blockquote className="relative z-10 max-w-3xl text-center">
        <p className="font-serif text-3xl font-light leading-snug text-ivory sm:text-4xl md:text-[2.75rem] md:leading-[1.25]">
          {ecoLodgeClosing.quote}
        </p>
      </blockquote>
    </section>
  );
}
