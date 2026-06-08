import { ArchiveSubmitForm } from "@/components/archive/ArchiveSubmitForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getArchiveContent } from "@/services/content/archive";

export const metadata = {
  title: "Submit — The Afari Lens",
  description: "Submit your photography to The Afari Lens — Afari Trails community feature.",
};

export default async function ArchiveSubmitPage() {
  const content = await getArchiveContent();
  const { submitPage } = content.page;

  return (
    <section className="bg-beige pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-xl px-6 lg:px-10">
        <SectionLabel>{submitPage.label}</SectionLabel>
        <h1 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {submitPage.heading}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-charcoal/65">
          {submitPage.intro}
        </p>

        <ArchiveSubmitForm submitPage={submitPage} />
      </div>
    </section>
  );
}
