"use client";

import { useState } from "react";
import type { ExpeditionDetailRecord } from "@/types/expeditions-content";
import { createBlankExpedition } from "@/lib/expeditions/blank-expedition";
import { slugifyExpeditionId } from "@/lib/expeditions/expedition-slug";

type ExpeditionsListManagerProps = {
  expeditions: ExpeditionDetailRecord[];
  selectedId: string | null;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onAdd: (expedition: ExpeditionDetailRecord) => void;
  onRemove: (id: string) => void;
};

export function ExpeditionsListManager({
  expeditions,
  selectedId,
  readOnly = false,
  onSelect,
  onAdd,
  onRemove,
}: ExpeditionsListManagerProps) {
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const id = slugifyExpeditionId(newName);
    if (!id) return;
    onAdd(createBlankExpedition(id, newName.trim() || "New Expedition"));
    setNewName("");
    setShowAdd(false);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
        Expeditions ({expeditions.length})
      </h3>
      <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
        {expeditions.map((exp) => (
          <li key={exp.id}>
            <button
              type="button"
              onClick={() => onSelect(exp.id)}
              className={`w-full px-3 py-2.5 text-left text-sm transition ${
                selectedId === exp.id
                  ? "bg-charcoal text-ivory"
                  : "hover:bg-charcoal/5"
              }`}
            >
              <span className="block font-medium">{exp.name}</span>
              <span
                className={`text-xs ${
                  selectedId === exp.id ? "text-ivory/70" : "text-charcoal/45"
                }`}
              >
                {exp.id}
                {exp.published === false ? " · hidden" : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {!readOnly && (
        <div className="space-y-3 border-t border-charcoal/10 pt-4">
          {showAdd ? (
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                className="w-full border border-charcoal/20 px-3 py-2 text-sm"
                placeholder="Expedition name (used for URL slug)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-charcoal py-2 text-xs uppercase tracking-wider text-ivory"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="border border-charcoal/20 px-3 py-2 text-xs"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="w-full border border-dashed border-charcoal/25 py-2 text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:border-charcoal/40"
              onClick={() => setShowAdd(true)}
            >
              + Add expedition
            </button>
          )}
          {selectedId && (
            <button
              type="button"
              className="w-full py-2 text-xs text-red-800/80 hover:underline"
              onClick={() => {
                if (
                  confirm(
                    `Delete "${selectedId}"? This cannot be undone.`,
                  )
                ) {
                  onRemove(selectedId);
                }
              }}
            >
              Delete selected
            </button>
          )}
        </div>
      )}
    </div>
  );
}
