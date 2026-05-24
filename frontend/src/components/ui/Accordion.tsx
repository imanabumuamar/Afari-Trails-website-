"use client";

import { useId, useState } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  light?: boolean;
};

export function Accordion({ items, light = false }: AccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const border = light ? "border-ivory/15" : "border-charcoal/12";
  const titleClass = light
    ? "text-ivory group-hover:text-sand"
    : "text-charcoal group-hover:text-gold-muted";
  const bodyClass = light ? "text-ivory/65" : "text-charcoal/65";
  const iconClass = light ? "text-ivory/50" : "text-charcoal/40";

  return (
    <div className={`divide-y ${border}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}`;

        return (
          <div key={item.id} className="group">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-8"
            >
              <span
                className={`font-serif text-xl font-light leading-snug transition-colors md:text-2xl ${titleClass}`}
              >
                {item.title}
              </span>
              <span
                className={`mt-1 shrink-0 text-lg transition-transform duration-300 ${iconClass} ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              hidden={!isOpen}
              className={`overflow-hidden transition-all ${isOpen ? "pb-8" : "pb-0"}`}
            >
              {isOpen && (
                <div
                  className={`max-w-2xl text-sm leading-[1.85] ${bodyClass} animate-fade-in`}
                >
                  {item.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
