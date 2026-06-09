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
    <section className="grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-ivory px-6 py-20 lg:px-14 lg:py-28">
        <SectionLabel>{label}</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
          {body}
        </p>
      </div>
      <div className="relative min-h-[360px] lg:min-h-[560px]">
        <Image
          src={image.src}
          alt={image.alt || heading}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
