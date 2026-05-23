type CollectionIconProps = {
  type: string;
};

export function CollectionIcon({ type }: CollectionIconProps) {
  const cls = "h-7 w-7 text-sand";

  switch (type) {
    case "wildlife":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <path d="M8 22c2-6 6-10 8-10s6 4 8 10" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
        </svg>
      );
    case "landscapes":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <path d="M4 24 L12 14 L18 18 L28 8" />
          <circle cx="24" cy="10" r="3" />
        </svg>
      );
    case "expedition":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <path d="M8 20c4-8 12-8 16 0" />
          <path d="M16 20v4M12 24h8" />
        </svg>
      );
    case "culture":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <circle cx="16" cy="10" r="4" />
          <path d="M8 26c0-5 3.5-8 8-8s8 3 8 8" />
        </svg>
      );
    case "lens":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <circle cx="16" cy="16" r="6" />
          <circle cx="16" cy="16" r="2" />
          <path d="M22 10l4-3v6l-4-3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <rect x="8" y="10" width="16" height="12" rx="1" />
          <path d="M12 10V8a4 4 0 018 0v2" />
        </svg>
      );
  }
}
