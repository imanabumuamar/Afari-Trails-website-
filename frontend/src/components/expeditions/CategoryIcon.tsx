type CategoryIconProps = {
  type: string;
  className?: string;
};

export function CategoryIcon({ type, className = "h-10 w-10" }: CategoryIconProps) {
  const cls = `${className} text-sand`;
  switch (type) {
    case "elephant":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <path d="M12 28c0-6 4-12 12-12s12 6 12 12v8H12v-8z" />
          <path d="M8 32h4M36 32h4M18 20c-2-4 0-8 6-8" />
        </svg>
      );
    case "mountain":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <path d="M6 36L18 14l8 14 6-10 10 18H6z" />
        </svg>
      );
    case "mask":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <ellipse cx="24" cy="22" rx="14" ry="16" />
          <path d="M14 22h20M18 30c2 4 10 4 12 0" />
          <circle cx="18" cy="20" r="2" fill="currentColor" />
          <circle cx="30" cy="20" r="2" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <circle cx="24" cy="24" r="14" />
          <path d="M24 10v28M10 24h28" />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
        </svg>
      );
  }
}
