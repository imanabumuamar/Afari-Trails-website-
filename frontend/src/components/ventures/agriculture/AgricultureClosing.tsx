import { agricultureClosing as default_agricultureClosing } from "@/lib/data/agriculture";
import { getVenturePageContent } from "@/services/content/ventures";

export async function AgricultureClosing() {
  const content = await getVenturePageContent("agriculture");
  const agricultureClosing = content.agricultureClosing as typeof default_agricultureClosing;

  return (
    <section className="relative flex min-h-[55vh] items-center justify-center bg-matte-black px-6 py-28 lg:min-h-[60vh]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#2a3528_0%,_var(--matte-black)_75%)]" />
      <blockquote className="relative z-10 max-w-3xl text-center">
        <p className="font-serif text-3xl font-light leading-snug text-ivory sm:text-4xl md:text-[2.75rem] md:leading-[1.25]">
          {agricultureClosing.quote}
        </p>
      </blockquote>
    </section>
  );
}
