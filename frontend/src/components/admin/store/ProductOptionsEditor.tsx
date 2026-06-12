"use client";

import { AdminField } from "@/components/admin/ventures/AdminField";
import type { ProductOption } from "@/types/store-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y min-h-[72px]`;

type ProductOptionsEditorProps = {
  options: ProductOption[];
  readOnly?: boolean;
  onChange: (options: ProductOption[]) => void;
};

export function ProductOptionsEditor({
  options,
  readOnly = false,
  onChange,
}: ProductOptionsEditorProps) {
  function updateOption(index: number, patch: Partial<ProductOption>) {
    const next = [...options];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function addOption() {
    onChange([...options, { name: "", values: [] }]);
  }

  function removeOption(index: number) {
    onChange(options.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4 border-t border-charcoal/10 pt-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Options (size, color, etc.)
        </p>
        <p className="mt-1 text-sm text-charcoal/55">
          Add a name and list of choices — one value per line. Example: Size → S, M,
          L.
        </p>
      </div>

      {options.length === 0 ? (
        <p className="text-sm text-charcoal/45">No options yet.</p>
      ) : (
        <ul className="space-y-4">
          {options.map((option, index) => (
            <li
              key={index}
              className="space-y-3 rounded border border-charcoal/12 bg-beige/20 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/45">
                  Option {index + 1}
                </span>
                {!readOnly && (
                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-[0.1em] text-red-800/80 hover:text-red-900"
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <AdminField label="Name">
                <input
                  className={inputClass}
                  value={option.name}
                  disabled={readOnly}
                  placeholder="Size"
                  onChange={(e) => updateOption(index, { name: e.target.value })}
                />
              </AdminField>

              <AdminField label="Values (one per line)">
                <textarea
                  className={textareaClass}
                  value={option.values.join("\n")}
                  disabled={readOnly}
                  placeholder={"S\nM\nL"}
                  onChange={(e) =>
                    updateOption(index, {
                      values: e.target.value
                        .split("\n")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </AdminField>
            </li>
          ))}
        </ul>
      )}

      {!readOnly && (
        <button
          type="button"
          className="border border-dashed border-charcoal/25 px-4 py-2 text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:border-charcoal/40"
          onClick={addOption}
        >
          + Add option
        </button>
      )}
    </div>
  );
}
