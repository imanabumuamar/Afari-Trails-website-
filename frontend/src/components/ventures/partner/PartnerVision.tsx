import { partnerVision as default_partnerVision } from "@/lib/data/partner";
import { getVenturePageContent } from "@/services/content/ventures";

export async function PartnerVision() {
  const content = await getVenturePageContent("partner");
  const partnerVision = content.partnerVision as typeof default_partnerVision;

  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-matte-black px-6 py-32 lg:min-h-[85vh] lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--safari-green-deep)_0%,_var(--matte-black)_65%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-matte-black/40 via-transparent to-matte-black/50" />

      <blockquote className="animate-fade-in relative z-10 max-w-4xl text-center">
        <p className="font-serif text-3xl font-light leading-[1.35] text-ivory sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.3]">
          {partnerVision.quote}
        </p>
      </blockquote>
    </section>
  );
}
