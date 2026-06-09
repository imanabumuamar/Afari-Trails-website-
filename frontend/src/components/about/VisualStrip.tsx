import Image from "next/image";
import { getAboutContent } from "@/services/content/about";

export async function VisualStrip() {
  const { visualStrip } = await getAboutContent();

  if (visualStrip.images.length === 0) return null;

  return (
    <section className="bg-[#e8dfd0]">
      <div className="flex w-full">
        {visualStrip.images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] min-w-0 flex-1 overflow-hidden"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
