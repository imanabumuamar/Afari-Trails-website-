"use client";

import { AdminField } from "@/components/admin/ventures/AdminField";
import { ProductOptionsEditor } from "@/components/admin/store/ProductOptionsEditor";
import { StoreImageField } from "@/components/admin/store/StoreImageField";
import { normalizeProductOptions } from "@/lib/store/product-options";
import type {
  GearType,
  Product,
  StoreCategory,
  StoreContentData,
} from "@/types/store-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;

const CATEGORIES: StoreCategory[] = [
  "apparel",
  "accessories",
  "field-essentials",
  "new-arrivals",
  "all",
];

const GEAR_TYPES: GearType[] = [
  "field-essentials",
  "expedition-wear",
  "camp-objects",
  "travel-accessories",
];

function emptyProduct(): Product {
  return {
    slug: `product-${Date.now()}`,
    name: "New Product",
    price: 0,
    priceDisplay: "$0",
    shortDescription: "",
    story: "",
    fabric: "",
    fit: "",
    functionality: "",
    weather: "",
    image: "",
    gallery: [],
    collection: "safari-collection",
    category: "apparel",
    gearType: "expedition-wear",
    related: [],
    options: [],
  };
}

type Props = {
  data: StoreContentData;
  readOnly: boolean;
  setData: React.Dispatch<React.SetStateAction<StoreContentData | null>>;
  setStatus: (message: string) => void;
  onDocumentSynced: (data: StoreContentData) => void;
  onSave: (products: StoreContentData["products"]) => void;
};

export function StoreProductsEditor({
  data,
  readOnly,
  setData,
  setStatus,
  onDocumentSynced,
  onSave,
}: Props) {
  function updateProduct(index: number, patch: Partial<Product>) {
    setData((prev) => {
      if (!prev) return prev;
      const products = [...prev.products];
      products[index] = { ...products[index], ...patch };
      return { ...prev, products };
    });
  }

  function removeProduct(index: number) {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      };
    });
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-serif text-2xl font-light">Products</h3>
        {!readOnly && (
          <button
            type="button"
            className="border border-charcoal/25 px-4 py-2 text-xs uppercase tracking-[0.2em] hover:border-gold"
            onClick={() =>
              setData((prev) =>
                prev
                  ? { ...prev, products: [...prev.products, emptyProduct()] }
                  : prev,
              )
            }
          >
            + Add product
          </button>
        )}
      </div>

      <div className="mt-8 space-y-10">
        {data.products.map((product, index) => (
          <div
            key={`${product.slug}-${index}`}
            className="space-y-4 border border-charcoal/15 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-serif text-lg font-light">{product.name}</p>
              {!readOnly && (
                <button
                  type="button"
                  className="text-xs uppercase tracking-[0.2em] text-red-900/70 hover:text-red-900"
                  onClick={() => removeProduct(index)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Slug">
                <input
                  className={inputClass}
                  value={product.slug}
                  disabled={readOnly}
                  onChange={(e) => updateProduct(index, { slug: e.target.value })}
                />
              </AdminField>
              <AdminField label="Name">
                <input
                  className={inputClass}
                  value={product.name}
                  disabled={readOnly}
                  onChange={(e) => updateProduct(index, { name: e.target.value })}
                />
              </AdminField>
              <AdminField label="Price (number)">
                <input
                  type="number"
                  className={inputClass}
                  value={product.price}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateProduct(index, { price: Number(e.target.value) || 0 })
                  }
                />
              </AdminField>
              <AdminField label="Price display">
                <input
                  className={inputClass}
                  value={product.priceDisplay}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateProduct(index, { priceDisplay: e.target.value })
                  }
                />
              </AdminField>
              <AdminField label="Collection slug">
                <input
                  className={inputClass}
                  value={product.collection}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateProduct(index, { collection: e.target.value })
                  }
                />
              </AdminField>
              <AdminField label="Category">
                <select
                  className={inputClass}
                  value={product.category}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateProduct(index, {
                      category: e.target.value as StoreCategory,
                    })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Gear type">
                <select
                  className={inputClass}
                  value={product.gearType}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateProduct(index, { gearType: e.target.value as GearType })
                  }
                >
                  {GEAR_TYPES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Related slugs (comma-separated)">
                <input
                  className={inputClass}
                  value={product.related.join(", ")}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateProduct(index, {
                      related: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </AdminField>
            </div>

            <AdminField label="Short description">
              <input
                className={inputClass}
                value={product.shortDescription}
                disabled={readOnly}
                onChange={(e) =>
                  updateProduct(index, { shortDescription: e.target.value })
                }
              />
            </AdminField>
            <AdminField label="Story">
              <textarea
                className={textareaClass}
                value={product.story}
                disabled={readOnly}
                onChange={(e) => updateProduct(index, { story: e.target.value })}
              />
            </AdminField>

            {(
              [
                ["Fabric", "fabric"],
                ["Fit", "fit"],
                ["Functionality", "functionality"],
                ["Weather", "weather"],
              ] as const
            ).map(([label, key]) => (
              <AdminField key={key} label={label}>
                <input
                  className={inputClass}
                  value={product[key]}
                  disabled={readOnly}
                  onChange={(e) => updateProduct(index, { [key]: e.target.value })}
                />
              </AdminField>
            ))}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!product.isNew}
                disabled={readOnly}
                onChange={(e) => updateProduct(index, { isNew: e.target.checked })}
              />
              Mark as new
            </label>

            <ProductOptionsEditor
              options={product.options ?? []}
              readOnly={readOnly}
              onChange={(options) =>
                updateProduct(index, { options: normalizeProductOptions(options) })
              }
            />

            <StoreImageField
              fieldPath={`products.${index}.image`}
              label="Main image"
              src={product.image}
              readOnly={readOnly}
              onStatus={setStatus}
              onDocumentSynced={onDocumentSynced}
              onUploaded={(src) => updateProduct(index, { image: src })}
            />

            <AdminField label="Gallery URLs (one per line)">
              <textarea
                className={textareaClass}
                value={product.gallery.join("\n")}
                disabled={readOnly}
                onChange={(e) =>
                  updateProduct(index, {
                    gallery: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </AdminField>
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          type="button"
          onClick={() => onSave(data.products)}
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save items
        </button>
      )}
    </section>
  );
}
