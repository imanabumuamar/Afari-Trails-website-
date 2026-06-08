"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { slugifyRegionId } from "@/lib/expeditions/region-slug";
import type { ExpeditionRegion } from "@/lib/data/expeditions-all-page";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";

type ExpeditionRegionsEditorProps = {
  regions: ExpeditionRegion[];
  readOnly?: boolean;
  onSave: (regions: ExpeditionRegion[]) => void;
  onStatus?: (message: string) => void;
};

function validateRegions(regions: ExpeditionRegion[]): string | null {
  if (!regions.some((r) => r.id === "all")) {
    return 'Include an "All" filter (id: all) as the first option.';
  }
  const seen = new Set<string>();
  for (const region of regions) {
    const id = region.id === "all" ? "all" : slugifyRegionId(region.id);
    if (!id) return "Each region needs an ID.";
    if (!region.label.trim()) return `Region "${id}" needs a label.`;
    if (seen.has(id)) return `Duplicate region ID: ${id}`;
    seen.add(id);
  }
  return null;
}

export function ExpeditionRegionsEditor({
  regions,
  readOnly = false,
  onSave,
  onStatus,
}: ExpeditionRegionsEditorProps) {
  const [draft, setDraft] = useState(regions);

  useEffect(() => {
    setDraft(regions);
  }, [regions]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const normalized = draft.map((region) => ({
      id: region.id === "all" ? "all" : slugifyRegionId(region.id),
      label: region.label.trim(),
    }));
    const error = validateRegions(normalized);
    if (error) {
      onStatus?.(error);
      return;
    }
    setDraft(normalized);
    onSave(normalized);
    onStatus?.("Region filters saved.");
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded border border-charcoal/15 bg-beige/20 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-light">Region filters</h3>
          <p className="mt-2 max-w-xl text-sm text-charcoal/60">
            Categories shown on{" "}
            <a
              href="/expeditions/all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              All journeys
            </a>
            . Keep <strong className="font-medium text-charcoal">All</strong> first —
            visitors land on it by default. Assign each expedition&apos;s region in
            the editor below.
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            className="shrink-0 border border-charcoal/25 px-4 py-2 text-xs uppercase tracking-[0.2em] text-charcoal/70 hover:border-charcoal/50"
            onClick={() =>
              setDraft([
                ...draft,
                { id: `region-${Date.now()}`, label: "New region" },
              ])
            }
          >
            + Add region
          </button>
        )}
      </div>

      <div className="space-y-3">
        {draft.map((region, i) => (
          <div
            key={`${region.id}-${i}`}
            className="grid gap-3 rounded border border-charcoal/10 bg-ivory px-4 py-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          >
            <AdminField label="ID (slug)">
              <input
                className={inputClass}
                value={region.id}
                disabled={readOnly || region.id === "all"}
                onChange={(e) => {
                  const next = [...draft];
                  next[i] = {
                    ...region,
                    id: slugifyRegionId(e.target.value),
                  };
                  setDraft(next);
                }}
              />
            </AdminField>
            <AdminField label="Label">
              <input
                className={inputClass}
                value={region.label}
                disabled={readOnly}
                onChange={(e) => {
                  const next = [...draft];
                  next[i] = { ...region, label: e.target.value };
                  setDraft(next);
                }}
              />
            </AdminField>
            {!readOnly && region.id !== "all" && (
              <button
                type="button"
                className="pb-2 text-[10px] uppercase tracking-[0.12em] text-red-800/70 hover:text-red-900 sm:pb-3"
                onClick={() => {
                  if (
                    window.confirm(
                      `Remove "${region.label}"? Expeditions in this region will still use its ID until you reassign them.`,
                    )
                  ) {
                    setDraft(draft.filter((_, idx) => idx !== i));
                  }
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save region filters
        </button>
      )}
    </form>
  );
}
