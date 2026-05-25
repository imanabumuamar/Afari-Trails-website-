import Image from "next/image";
import { PhilosophyIcon } from "@/components/about/PhilosophyIcon";
import { getAboutContent } from "@/services/content/about";

export async function PhilosophyWhySplit() {
  const { philosophy, whyWeExist } = await getAboutContent();

  return (
    <section className="grid lg:grid-cols-2">
      <div className="bg-[#3c3228] px-6 py-16 text-ivory lg:px-12 lg:py-24">
        <h2 className="font-serif text-3xl font-light md:text-4xl">
          {philosophy.heading}
        </h2>
        <div className="mt-14 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {philosophy.principles.map((item) => (
            <div key={item.title} className="text-center">
              <PhilosophyIcon type={item.icon} />
              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-ivory/80">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-[400px] items-center lg:min-h-auto">
        <Image
          src={whyWeExist.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-matte-black/55" />
        <blockquote className="relative z-10 px-8 py-16 lg:px-14">
          <p className="font-serif text-2xl font-light leading-snug text-ivory md:text-3xl lg:text-4xl">
            {whyWeExist.quote}
          </p>
        </blockquote>
      </div>
    </section>
  );
}
