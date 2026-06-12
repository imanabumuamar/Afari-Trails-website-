"use client";

import {
  DEFAULT_VENTURE_PROJECT_SECTION_VISIBILITY,
  resolveVentureProjectSectionVisibility,
  VENTURE_PROJECT_PAGE_SECTIONS,
} from "@/lib/ventures/venture-project-sections";
import type {
  VentureFeaturedProject,
  VentureProjectSectionKey,
} from "@/types/venture-project";

type VentureProjectSectionVisibilityEditorProps = {
  project: VentureFeaturedProject;
  readOnly?: boolean;
  onChange: (project: VentureFeaturedProject) => void;
};

export function VentureProjectSectionVisibilityEditor({
  project,
  readOnly = false,
  onChange,
}: VentureProjectSectionVisibilityEditorProps) {
  const visibility = resolveVentureProjectSectionVisibility(project);
  const visibleCount = VENTURE_PROJECT_PAGE_SECTIONS.filter(
    (section) => visibility[section.key],
  ).length;

  function setVisible(key: VentureProjectSectionKey, visible: boolean) {
    onChange({
      ...project,
      sectionVisibility: {
        ...DEFAULT_VENTURE_PROJECT_SECTION_VISIBILITY,
        ...project.sectionVisibility,
        [key]: visible,
      },
    });
  }

  return (
    <div className="rounded border border-charcoal/12 bg-beige/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
            Project page sections
          </h4>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-charcoal/55">
            Choose which sections appear on this project&apos;s public page.
            Hidden sections keep their content saved.
          </p>
        </div>
        <p className="text-xs text-charcoal/45">
          {visibleCount} of {VENTURE_PROJECT_PAGE_SECTIONS.length} visible
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {VENTURE_PROJECT_PAGE_SECTIONS.map((section) => (
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
