"use client";

import {
  EXPEDITION_PAGE_SECTIONS,
  resolveExpeditionSectionVisibility,
  type ExpeditionPageSectionKey,
} from "@/lib/expeditions/expedition-page-sections";
import type { ExpeditionDetailRecord } from "@/types/expeditions-content";

type ExpeditionSectionVisibilityEditorProps = {
  draft: ExpeditionDetailRecord;
  readOnly?: boolean;
  setDraft: React.Dispatch<React.SetStateAction<ExpeditionDetailRecord>>;
};

export function ExpeditionSectionVisibilityEditor({
  draft,
  readOnly = false,
  setDraft,
}: ExpeditionSectionVisibilityEditorProps) {
  const visibility = resolveExpeditionSectionVisibility(draft);

  function setVisible(key: ExpeditionPageSectionKey, visible: boolean) {
    setDraft({
      ...draft,
      sectionVisibility: {
        ...draft.sectionVisibility,
        [key]: visible,
      },
    });
  }

  const visibleCount = EXPEDITION_PAGE_SECTIONS.filter(
    (s) => visibility[s.key],
  ).length;

  return (
    <div className="rounded border border-charcoal/12 bg-beige/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
            Page sections
          </h4>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-charcoal/55">
            Choose which sections appear on the public expedition page. Hidden
            sections keep their content saved — you can turn them back on anytime.
          </p>
        </div>
        <p className="text-xs text-charcoal/45">
          {visibleCount} of {EXPEDITION_PAGE_SECTIONS.length} visible
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXPEDITION_PAGE_SECTIONS.map((section) => (
          <label
            key={section.key}
            className={`flex cursor-pointer gap-3 rounded border px-4 py-3 transition-colors ${
              visibility[section.key]
                ? "border-safari-green/35 bg-ivory"
                : "border-charcoal/10 bg-ivory/60 opacity-80"
            } ${readOnly ? "cursor-default" : "hover:border-charcoal/25"}`}
          >
            <input
              type="checkbox"
              className="mt-0.5 shrink-0"
              checked={visibility[section.key]}
              disabled={readOnly}
              onChange={(e) => setVisible(section.key, e.target.checked)}
            />
            <span className="min-w-0">
              <span className="block text-sm text-charcoal">{section.label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-charcoal/50">
                {section.description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
