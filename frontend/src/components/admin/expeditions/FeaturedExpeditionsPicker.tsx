"use client";

import { useState } from "react";
import type { ExpeditionDetailRecord } from "@/types/expeditions-content";

type FeaturedExpeditionsPickerProps = {
  expeditions: ExpeditionDetailRecord[];
  featuredIds: string[];
  readOnly?: boolean;
  onSave: (featuredIds: string[]) => void;
};

export function FeaturedExpeditionsPicker({
  expeditions,
  featuredIds,
  readOnly = false,
  onSave,
}: FeaturedExpeditionsPickerProps) {
  const [draft, setDraft] = useState(featuredIds);
  const published = expeditions.filter((e) => e.published !== false);

  function toggle(id: string) {
    if (readOnly) return;
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function move(id: string, dir: -1 | 1) {
    if (readOnly) return;
    const i = draft.indexOf(id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= draft.length) return;
    const next = [...draft];
    [next[i], next[j]] = [next[j], next[i]];
    setDraft(next);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave(draft);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 border-t border-charcoal/10 pt-10">
      <div>
        <h3 className="font-serif text-2xl font-light">Featured on main page</h3>
        <p className="mt-2 max-w-xl text-sm text-charcoal/60">
          Choose which expeditions appear on{" "}
          <code className="text-charcoal">/expeditions</code>. Order controls
          left-to-right layout. Only published expeditions are listed.
        </p>
      </div>

      <ul className="space-y-3">
        {published.map((exp) => {
          const checked = draft.includes(exp.id);
          const orderIndex = draft.indexOf(exp.id);
          return (
            <li
              key={exp.id}
              className="flex flex-wrap items-center gap-3 rounded border border-charcoal/10 bg-beige/30 px-4 py-3"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={readOnly}
                  onChange={() => toggle(exp.id)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-charcoal">
                  <strong>{exp.name}</strong>
                  <span className="ml-2 text-charcoal/50">{exp.tagline}</span>
                </span>
              </label>
              {checked && !readOnly && (
                <span className="flex gap-1">
                  <button
                    type="button"
                    className="border border-charcoal/20 px-2 py-1 text-xs"
                    onClick={() => move(exp.id, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="border border-charcoal/20 px-2 py-1 text-xs"
                    onClick={() => move(exp.id, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <span className="px-2 text-xs text-charcoal/45">
                    #{orderIndex + 1}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save featured selection
        </button>
      )}
    </form>
  );
}
