"use client";

import {
  applyExpeditionContentItemStatus,
  EXPEDITION_CONTENT_ITEM_STATUS_OPTIONS,
  getExpeditionContentItemStatus,
  type ExpeditionContentItemStatus,
} from "@/lib/expeditions/expedition-content-item-status";

type ExpeditionItemStatusPickerProps<T extends { published?: boolean }> = {
  item: T;
  name: string;
  readOnly?: boolean;
  onChange: (item: T) => void;
};

export function ExpeditionItemStatusPicker<T extends { published?: boolean }>({
  item,
  name,
  readOnly = false,
  onChange,
}: ExpeditionItemStatusPickerProps<T>) {
  const status = getExpeditionContentItemStatus(item);

  function setStatus(next: ExpeditionContentItemStatus) {
    onChange(applyExpeditionContentItemStatus(item, next));
  }

  return (
    <div className="space-y-2">
      {EXPEDITION_CONTENT_ITEM_STATUS_OPTIONS.map((option) => (
        <label
          key={option.value}
          className={`flex cursor-pointer gap-3 rounded border px-3 py-2 transition-colors ${
            status === option.value
              ? "border-safari-green/35 bg-ivory"
              : "border-charcoal/10 bg-ivory/60"
          } ${readOnly ? "cursor-default" : "hover:border-charcoal/25"}`}
        >
          <input
            type="radio"
            name={name}
            className="mt-0.5 shrink-0"
            checked={status === option.value}
            disabled={readOnly}
            onChange={() => setStatus(option.value)}
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-charcoal">
              {option.label}
            </span>
            <span className="mt-0.5 block text-xs leading-relaxed text-charcoal/50">
              {option.description}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
