import { getAboutContent } from "@/services/content/about";

export async function FinalQuote() {
  const { finalQuote } = await getAboutContent();

  return (
    <section className="bg-safari-green-deep px-6 py-24 lg:py-32">
      <blockquote className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-2xl font-light italic leading-relaxed text-ivory/90 sm:text-3xl md:text-4xl lg:text-5xl">
          &ldquo;{finalQuote.text}&rdquo;
        </p>
      </blockquote>
    </section>
  );
}
