"use client";

import { useEffect, useState } from "react";
import { StoreProductPicker } from "@/components/admin/store/StoreProductPicker";
import type { StoreContentData } from "@/types/store-content";

type StoreNewArrivalsEditorProps = {
  data: StoreContentData;
  readOnly?: boolean;
  onSave: (newArrivals: string[]) => void;
  onStatus: (message: string) => void;
};

export function StoreNewArrivalsEditor({
  data,
  readOnly = false,
  onSave,
  onStatus,
}: StoreNewArrivalsEditorProps) {
  const [draft, setDraft] = useState(data.newArrivals ?? []);

  useEffect(() => {
    setDraft(data.newArrivals ?? []);
  }, [data.newArrivals]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
        onStatus("New arrivals saved.");
        setTimeout(() => onStatus(""), 2500);
      }}
      className="space-y-8"
    >
      <div>
        <h3 className="font-serif text-2xl font-light">New arrivals</h3>
        <p className="mt-2 text-sm text-charcoal/55">
          Choose items from your catalog for the New Arrivals grid on the store
          page. Tick products to include them, then reorder the selected list.
        </p>
      </div>

      <StoreProductPicker
        products={data.products}
        value={draft}
        readOnly={readOnly}
        onChange={setDraft}
      />

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save new arrivals
        </button>
      )}
    </form>
  );
}
