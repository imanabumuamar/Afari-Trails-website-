import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionComingSoonProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionComingSoon({ expedition }: ExpeditionComingSoonProps) {
  return (
    <section
      id="coming-soon"
      className="scroll-mt-24 bg-ivory py-24 lg:py-32"
    >
      <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
        <ExpeditionEyebrow>Coming Soon</ExpeditionEyebrow>
        <h2 className="mt-4 font-serif text-3xl font-light leading-[1.15] text-charcoal md:text-4xl lg:text-[2.65rem]">
          This journey is still being crafted
        </h2>
        <p className="mt-6 text-sm leading-[1.9] text-charcoal/70 md:text-base">
          We are shaping every detail of the {expedition.name} expedition. Enquiry
          and brochure will be available here when the full experience is ready
          to share.
        </p>
      </div>
    </section>
  );
}
