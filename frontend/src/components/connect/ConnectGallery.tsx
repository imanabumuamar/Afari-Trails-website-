import Image from "next/image";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectGalleryProps = {
  config: ConnectPageConfig;
};

export function ConnectGallery({ config }: ConnectGalleryProps) {
  if (!config.gallery.length) return null;

  return (
    <section className="overflow-hidden bg-matte-black py-4 lg:py-6" aria-label="Visual storytelling">
      <div className="flex gap-1 overflow-x-auto scrollbar-none lg:gap-1.5">
        {config.gallery.map((frame, index) => (
          <div
            key={`${index}-${frame.alt}`}
            className="relative h-[45vh] min-h-[280px] w-[min(92vw,640px)] shrink-0 lg:h-[60vh] lg:w-[720px]"
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              className="object-cover opacity-95"
              sizes="720px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
