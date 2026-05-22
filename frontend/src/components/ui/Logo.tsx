import Link from "next/link";

/** Compass rose — fine lines, long cardinals, short diagonals, center point (per brand mockups) */
function CompassMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="0.55" strokeLinecap="round">
        <line x1="16" y1="5" x2="16" y2="35" />
        <line x1="5" y1="20" x2="27" y2="20" />
        <line x1="8.8" y1="11.2" x2="16" y2="20" />
        <line x1="23.2" y1="11.2" x2="16" y2="20" />
        <line x1="8.8" y1="28.8" x2="16" y2="20" />
        <line x1="23.2" y1="28.8" x2="16" y2="20" />
      </g>
      <g fill="currentColor">
        <path d="M16 2.5 17 10.5 16 9 15 10.5Z" />
        <path d="M16 37.5 17 29.5 16 31 15 29.5Z" />
        <path d="M2.5 20 10.5 19 9 20 10.5 21Z" />
        <path d="M29.5 20 21.5 19 23 20 21.5 21Z" />
        <circle cx="16" cy="20" r="1.1" />
      </g>
    </svg>
  );
}

type LogoProps = {
  light?: boolean;
  className?: string;
};

export function Logo({ light = false, className = "" }: LogoProps) {
  const iconColor = light ? "text-gold" : "text-gold-muted";
  const afariColor = light ? "text-ivory" : "text-charcoal";
  const trailsColor = light ? "text-ivory/90" : "text-charcoal/75";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3.5 ${className}`}
      aria-label="Afari Trails — Home"
    >
      <CompassMark className={`h-10 w-8 shrink-0 ${iconColor}`} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-[15px] font-normal tracking-[0.38em] sm:text-base ${afariColor}`}
        >
          AFARI
        </span>
        <span
          className={`mt-1 font-sans text-[9px] font-medium tracking-[0.52em] sm:text-[10px] sm:tracking-[0.58em] ${trailsColor}`}
        >
          TRAILS
        </span>
      </span>
    </Link>
  );
}
