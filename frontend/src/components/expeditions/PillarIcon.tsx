type PillarIconProps = { type: string };

export function PillarIcon({ type }: PillarIconProps) {
  const cls = "mx-auto h-8 w-8 text-sand";
  switch (type) {
    case "group":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <circle cx="12" cy="11" r="4" />
          <circle cx="22" cy="13" r="3" />
          <path d="M4 26c0-4 3.5-7 8-7s8 3 8 7M16 26c0-3 2.5-5 6-5s6 2 6 5" />
        </svg>
      );
    case "guide":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <circle cx="16" cy="10" r="5" />
          <path d="M8 28c0-5 3.5-9 8-9s8 4 8 9" />
          <path d="M22 8l4-2v6l-4-2" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <path d="M16 4C8 12 6 22 16 28c10-6 8-16 0-24z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cls} aria-hidden>
          <path d="M16 26c-6-4-8-10-6-14 2-4 6-6 6-6s4 2 6 6c2 4 0 10-6 14z" />
        </svg>
      );
  }
}
