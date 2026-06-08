import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectClosingProps = {
  config: ConnectPageConfig;
  compact?: boolean;
};

export function ConnectClosing({ config, compact = false }: ConnectClosingProps) {
  return (
    <section
      className={`relative flex items-center justify-center bg-matte-black px-6 ${
        compact
          ? "min-h-[36vh] py-16 lg:min-h-[40vh] lg:py-20"
          : "min-h-[50vh] py-28 lg:min-h-[55vh]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--safari-green-deep)_0%,_var(--matte-black)_75%)]" />
      <blockquote className="relative z-10 max-w-3xl text-center">
        <p className="font-serif text-3xl font-light leading-snug text-ivory sm:text-4xl md:text-[2.75rem] md:leading-[1.25]">
          {config.closing.quote}
        </p>
      </blockquote>
    </section>
  );
}
