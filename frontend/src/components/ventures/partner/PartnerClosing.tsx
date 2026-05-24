import { partnerClosing as default_partnerClosing } from "@/lib/data/partner";
import { getVenturePageContent } from "@/services/content/ventures";

export async function PartnerClosing() {
  const content = await getVenturePageContent("partner");
  const partnerClosing = content.partnerClosing as typeof default_partnerClosing;

  return (
    <section className="relative flex min-h-[55vh] items-center justify-center bg-matte-black px-6 py-28 lg:min-h-[60vh]">
      <div className="absolute inset-0 bg-gradient-to-t from-safari-green-deep/30 via-transparent to-matte-black" />
      <blockquote className="animate-fade-in relative z-10 max-w-3xl text-center">
        <p className="font-serif text-3xl font-light leading-snug text-ivory sm:text-4xl md:text-[2.75rem] md:leading-[1.25]">
          {partnerClosing.quote}
        </p>
      </blockquote>
    </section>
  );
}
