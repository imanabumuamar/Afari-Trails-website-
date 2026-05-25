"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { StoreImageField } from "@/components/admin/store/StoreImageField";
import { StoreProductsEditor } from "@/components/admin/store/StoreProductsEditor";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type {
  CollectionIconType,
  EditorialCollection,
  StoreContentData,
} from "@/types/store-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;

const COLLECTION_ICONS: CollectionIconType[] = [
  "giraffe",
  "vehicle",
  "campfire",
  "mountains",
  "trail",
  "book",
];

type StoreContentEditorProps = {
  readOnly?: boolean;
};

export function StoreContentEditor({ readOnly = false }: StoreContentEditorProps) {
  const [data, setData] = useState<StoreContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/admin/content/store");
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load store content."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as StoreContentData);
    setUpdatedAt(doc.updatedAt ?? null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(next: StoreContentData) {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Save failed."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as StoreContentData);
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2500);
  }

  if (loading) {
    return <p className="text-sm text-charcoal/60">Loading store…</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "No data."}</p>;
  }

  function syncFromUpload(next: StoreContentData) {
    setData(next);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 border-b border-charcoal/10 pb-4">
        <Link
          href="/store"
          target="_blank"
          className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-gold"
        >
          View live store →
        </Link>
        {updatedAt && (
          <span className="text-xs text-charcoal/45">
            Last saved {new Date(updatedAt).toLocaleString()}
          </span>
        )}
        {status && <span className="text-xs text-charcoal/60">{status}</span>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save(data);
        }}
        className="space-y-14"
      >
        <section>
          <h3 className="font-serif text-2xl font-light">Hero</h3>
          <div className="mt-6 space-y-4">
            {(["label", "heading", "subtext"] as const).map((key) => (
              <AdminField key={key} label={key}>
                <input
                  className={inputClass}
                  value={data.hero[key]}
                  disabled={readOnly}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, [key]: e.target.value } })
                  }
                />
              </AdminField>
            ))}
            <StoreImageField
              fieldPath="hero.image"
              label="Hero image"
              src={data.hero.image}
              readOnly={readOnly}
              onStatus={setStatus}
              onDocumentSynced={syncFromUpload}
              onUploaded={(src) =>
                setData({ ...data, hero: { ...data.hero, image: src } })
              }
            />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-serif text-2xl font-light">Featured collections</h3>
            {!readOnly && (
              <button
                type="button"
                className="border border-charcoal/25 px-4 py-2 text-xs uppercase tracking-[0.2em]"
                onClick={() =>
                  setData({
                    ...data,
                    collections: [
                      ...data.collections,
                      {
                        slug: `collection-${Date.now()}`,
                        title: "New Collection",
                        description: "",
                        image: "",
                        icon: "giraffe",
                      },
                    ],
                  })
                }
              >
                + Add collection
              </button>
            )}
          </div>
          <div className="mt-6 space-y-8">
            {data.collections.map((col, index) => (
              <CollectionEditor
                key={`${col.slug}-${index}`}
                col={col}
                index={index}
                readOnly={readOnly}
                data={data}
                setData={setData}
                setStatus={setStatus}
                onDocumentSynced={syncFromUpload}
                onRemove={() =>
                  setData({
                    ...data,
                    collections: data.collections.filter((_, i) => i !== index),
                  })
                }
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-serif text-2xl font-light">Curated essentials</h3>
            {!readOnly && (
              <button
                type="button"
                className="border border-charcoal/25 px-4 py-2 text-xs uppercase tracking-[0.2em]"
                onClick={() =>
                  setData({
                    ...data,
                    curatedEssentials: [
                      ...data.curatedEssentials,
                      {
                        slug: "",
                        name: "",
                        color: "",
                        priceDisplay: "",
                      },
                    ],
                  })
                }
              >
                + Add item
              </button>
            )}
          </div>
          <div className="mt-6 space-y-6">
            {data.curatedEssentials.map((item, index) => (
              <div key={index} className="grid gap-4 border border-charcoal/10 p-4 sm:grid-cols-2">
                {(["slug", "name", "color", "priceDisplay"] as const).map((key) => (
                  <AdminField key={key} label={key}>
                    <input
                      className={inputClass}
                      value={item[key]}
                      disabled={readOnly}
                      onChange={(e) => {
                        const curatedEssentials = [...data.curatedEssentials];
                        curatedEssentials[index] = {
                          ...curatedEssentials[index],
                          [key]: e.target.value,
                        };
                        setData({ ...data, curatedEssentials });
                      }}
                    />
                  </AdminField>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-light">The World of Afari</h3>
          <div className="mt-6 space-y-4">
            {(
              [
                ["bandLabel", "Band label"],
                ["quote", "Quote"],
                ["attribution", "Attribution"],
                ["body", "Body"],
                ["cta", "CTA label"],
                ["ctaHref", "CTA link"],
              ] as const
            ).map(([key, label]) => (
              <AdminField key={key} label={label}>
                {key === "body" ? (
                  <textarea
                    className={textareaClass}
                    value={data.worldOfAfari[key]}
                    disabled={readOnly}
                    onChange={(e) =>
                      setData({
                        ...data,
                        worldOfAfari: { ...data.worldOfAfari, [key]: e.target.value },
                      })
                    }
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={data.worldOfAfari[key]}
                    disabled={readOnly}
                    onChange={(e) =>
                      setData({
                        ...data,
                        worldOfAfari: { ...data.worldOfAfari, [key]: e.target.value },
                      })
                    }
                  />
                )}
              </AdminField>
            ))}
            <StoreImageField
              fieldPath="worldOfAfari.image"
              label="Banner image"
              src={data.worldOfAfari.image}
              readOnly={readOnly}
              onStatus={setStatus}
              onDocumentSynced={syncFromUpload}
              onUploaded={(src) =>
                setData({
                  ...data,
                  worldOfAfari: { ...data.worldOfAfari, image: src },
                })
              }
            />
          </div>
        </section>

        <StoreProductsEditor
          data={data}
          readOnly={readOnly}
          setData={setData}
          setStatus={setStatus}
          onDocumentSynced={syncFromUpload}
        />

        {!readOnly && (
          <button
            type="submit"
            className="bg-charcoal px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
          >
            Save store
          </button>
        )}
      </form>
    </div>
  );
}

function CollectionEditor({
  col,
  index,
  readOnly,
  data,
  setData,
  setStatus,
  onDocumentSynced,
  onRemove,
}: {
  col: EditorialCollection;
  index: number;
  readOnly: boolean;
  data: StoreContentData;
  setData: React.Dispatch<React.SetStateAction<StoreContentData | null>>;
  setStatus: (message: string) => void;
  onDocumentSynced: (data: StoreContentData) => void;
  onRemove: () => void;
}) {
  function patch(patch: Partial<EditorialCollection>) {
    setData((prev) => {
      if (!prev) return prev;
      const collections = [...prev.collections];
      collections[index] = { ...collections[index], ...patch };
      return { ...prev, collections };
    });
  }

  return (
    <div className="space-y-4 border border-charcoal/15 p-6">
      <div className="flex justify-between gap-3">
        <p className="font-serif text-lg font-light">{col.title}</p>
        {!readOnly && (
          <button
            type="button"
            className="text-xs uppercase tracking-[0.2em] text-red-900/70"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Slug">
          <input
            className={inputClass}
            value={col.slug}
            disabled={readOnly}
            onChange={(e) => patch({ slug: e.target.value })}
          />
        </AdminField>
        <AdminField label="Title">
          <input
            className={inputClass}
            value={col.title}
            disabled={readOnly}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </AdminField>
        <AdminField label="Icon">
          <select
            className={inputClass}
            value={col.icon}
            disabled={readOnly}
            onChange={(e) =>
              patch({ icon: e.target.value as CollectionIconType })
            }
          >
            {COLLECTION_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </AdminField>
      </div>
      <AdminField label="Description">
        <textarea
          className={textareaClass}
          value={col.description}
          disabled={readOnly}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </AdminField>
      <StoreImageField
        fieldPath={`collections.${index}.image`}
        label="Collection image"
        src={col.image}
        readOnly={readOnly}
        onStatus={setStatus}
        onDocumentSynced={onDocumentSynced}
        onUploaded={(src) => patch({ image: src })}
      />
    </div>
  );
}
