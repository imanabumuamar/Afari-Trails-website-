import { hospitalityExperience } from "@/lib/data/hospitality";

export function HospitalityExperience() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-matte-black px-6 py-28 lg:min-h-[80vh]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--safari-green-deep)_0%,_var(--matte-black)_70%)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-sand">
          {hospitalityExperience.label}
        </p>
        <blockquote className="mx-auto mt-10 max-w-3xl font-serif text-3xl font-light leading-[1.35] text-ivory sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.3]">
          {hospitalityExperience.quote}
        </blockquote>
        <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-4">
          {hospitalityExperience.themes.map((theme) => (
            <li
              key={theme}
              className="text-xs font-medium uppercase tracking-[0.22em] text-ivory/45"
            >
              {theme}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
