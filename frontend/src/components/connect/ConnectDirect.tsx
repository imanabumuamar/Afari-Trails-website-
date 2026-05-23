import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectDirectProps = {
  config: ConnectPageConfig;
};

export function ConnectDirect({ config }: ConnectDirectProps) {
  const { direct } = config;

  return (
    <section className="border-y border-charcoal/10 bg-beige py-16 lg:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center gap-12 px-6 text-center sm:flex-row sm:flex-wrap sm:gap-16 lg:px-10">
        <div>
          <SectionLabel>Direct</SectionLabel>
          <a
            href={`mailto:${direct.email}`}
            className="mt-4 block font-serif text-2xl font-light text-charcoal transition-colors hover:text-gold md:text-3xl"
          >
            {direct.email}
          </a>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
            Location
          </p>
          <p className="mt-4 font-serif text-2xl font-light text-charcoal">
            {direct.location}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
            Follow
          </p>
          <ul className="mt-4 flex justify-center gap-8">
            {direct.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium uppercase tracking-[0.22em] text-charcoal/60 transition-colors hover:text-gold"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
