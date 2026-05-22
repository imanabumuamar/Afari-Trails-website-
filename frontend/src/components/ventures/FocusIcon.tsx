type FocusIconProps = {
  type: string;
};

export function FocusIcon({ type }: FocusIconProps) {
  const cls = "h-5 w-5 text-sand";
  switch (type) {
    case "lodge":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
          <path d="M4 20h16M6 20V10l6-6 6 6v10" />
          <path d="M10 14h4" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
          <path d="M12 3c-4 6-6 10-6 14a6 6 0 0012 0c0-4-2-8-6-14z" />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M14 20c.5-2 2-3.5 4-3.5" />
        </svg>
      );
    case "crop":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
          <path d="M12 3v18M8 7c-2 0-4 2-4 4M16 7c2 0 4 2 4 4M8 11c-2 0-4 2-4 4M16 11c2 0 4 2 4 4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
          <path d="M4 12h16M4 12l4-8h8l4 8M4 12v8h16v-8" />
        </svg>
      );
  }
}
