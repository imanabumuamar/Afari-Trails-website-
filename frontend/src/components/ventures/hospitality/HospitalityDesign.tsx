import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { hospitalityDesign as default_hospitalityDesign } from "@/lib/data/hospitality";

type DesignImage = { src: string; alt: string };

function resolveImage(data: Record<string, unknown>): DesignImage {
  if (typeof data.image === "string" && data.image) {
    return {
      src: data.image,
      alt: typeof data.imageAlt === "string" ? data.imageAlt : "",
    };
  }
  const moodboard = Array.isArray(data.moodboard) ? data.moodboard : [];
  const first = moodboard[0];
  if (first && typeof first === "object") {
    const r = first as Record<string, unknown>;
    if (typeof r.src === "string" && r.src) {
      return {
        src: r.src,
        alt: typeof r.alt === "string" ? r.alt : "",
      };
    }
  }
  return {
    src: default_hospitalityDesign.image,
    alt: default_hospitalityDesign.imageAlt,
  };
}

export async function HospitalityDesign() {
  const content = await getVenturePageContent("hospitality");
  const raw = (content.hospitalityDesign ?? {}) as Record<string, unknown>;

  const label =
    typeof raw.label === "string" ? raw.label : default_hospitalityDesign.label;
  const heading =
    typeof raw.heading === "string"
      ? raw.heading
      : default_hospitalityDesign.heading;
  const body =
    typeof raw.body === "string" ? raw.body : default_hospitalityDesign.body;
  const image = resolveImage(raw);

  return (
    <section className="bg-sand-light py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 sm:grid-cols-2 sm:items-stretch sm:gap-10 lg:px-10">
        <div className="order-1 flex flex-col justify-center">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
            {heading}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {body}
          </p>
        </div>
        <div className="relative order-2 aspect-[3/4] w-full overflow-hidden bg-sand-light sm:aspect-auto sm:h-full sm:min-h-0">
          <Image
            src={image.src}
            alt={image.alt || heading}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
