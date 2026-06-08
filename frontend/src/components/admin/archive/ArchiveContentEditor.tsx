"use client";

import { useCallback, useEffect, useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type {
  ArchiveContentData,
  ArchiveImageRecord,
} from "@/types/archive-content";
import { ArchivePageEditor } from "@/components/admin/archive/ArchivePageEditor";
import { ArchiveCollectionsEditor } from "@/components/admin/archive/ArchiveCollectionsEditor";
import { ArchiveLatestMomentsEditor } from "@/components/admin/archive/ArchiveLatestMomentsEditor";
import { ArchiveGalleryListManager } from "@/components/admin/archive/ArchiveGalleryListManager";
import { ArchiveGalleryImageEditor } from "@/components/admin/archive/ArchiveGalleryImageEditor";

type ArchiveContentEditorProps = {
  readOnly?: boolean;
};

type Tab = "page" | "collections" | "moments" | "gallery";

export function ArchiveContentEditor({ readOnly = false }: ArchiveContentEditorProps) {
  const [tab, setTab] = useState<Tab>("page");
  const [data, setData] = useState<ArchiveContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/admin/content/archive");
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load archive content."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as ArchiveContentData);
    setUpdatedAt(doc.updatedAt ?? null);
    setSelectedImageId((prev) => {
      if (prev && doc.data?.images?.some((i: ArchiveImageRecord) => i.id === prev)) {
        return prev;
      }
      return doc.data?.images?.[0]?.id ?? null;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(next: ArchiveContentData) {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content/archive", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Save failed."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as ArchiveContentData);
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2500);
  }

  function patch(partial: Partial<ArchiveContentData>) {
    if (!data) return;
    const next = { ...data, ...partial };
    setData(next);
    void save(next);
  }

  function patchImage(image: ArchiveImageRecord) {
    if (!data) return;
    const normalized = { ...image, published: image.published !== false };
    const images = data.images.map((i) =>
      i.id === normalized.id ? normalized : i,
    );
    if (!images.some((i) => i.id === normalized.id)) {
      images.push(normalized);
    }
    patch({ images });
  }

  function addImage(image: ArchiveImageRecord) {
    if (!data) return;
    if (data.images.some((i) => i.id === image.id)) {
      setStatus("An image with this id already exists.");
      return;
    }
    patch({ images: [...data.images, image] });
    setSelectedImageId(image.id);
    setTab("gallery");
  }

  function removeImage(id: string) {
    if (!data) return;
    patch({ images: data.images.filter((i) => i.id !== id) });
    if (selectedImageId === id) {
      setSelectedImageId(
        data.images.find((i) => i.id !== id)?.id ?? null,
      );
    }
  }

  const selectedImage = data?.images.find((i) => i.id === selectedImageId);

  if (loading) {
    return <p className="text-sm text-charcoal/60">Loading archive…</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "No data."}</p>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "page", label: "Page copy" },
    { id: "collections", label: "Collections" },
    { id: "moments", label: "Latest moments" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 border-b border-charcoal/10 pb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                tab === t.id
                  ? "bg-charcoal text-ivory"
                  : "border border-charcoal/20 text-charcoal/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {updatedAt && (
          <span className="text-xs text-charcoal/45">
            Last saved {new Date(updatedAt).toLocaleString()}
          </span>
        )}
        {status && <span className="text-xs text-charcoal/60">{status}</span>}
      </div>

      {tab === "page" && (
        <ArchivePageEditor
          page={data.page}
          readOnly={readOnly}
          onSave={(page) => patch({ page })}
          onDocumentSynced={(next) => setData(next)}
          onStatus={setStatus}
        />
      )}

      {tab === "collections" && (
        <ArchiveCollectionsEditor
          collections={data.collections}
          readOnly={readOnly}
          onSave={(collections) => patch({ collections })}
          onDocumentSynced={(next) => setData(next)}
          onStatus={setStatus}
        />
      )}

      {tab === "moments" && (
        <ArchiveLatestMomentsEditor
          moments={data.latestMoments}
          readOnly={readOnly}
          onSave={(latestMoments) => patch({ latestMoments })}
          onDocumentSynced={(next) => setData(next)}
          onStatus={setStatus}
        />
      )}

      {tab === "gallery" && (
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <ArchiveGalleryListManager
            images={data.images}
            defaultCategory={data.collections[0]?.id ?? "wildlife"}
            selectedId={selectedImageId}
            readOnly={readOnly}
            onSelect={setSelectedImageId}
            onAdd={addImage}
            onRemove={removeImage}
          />
          {selectedImage ? (
            <ArchiveGalleryImageEditor
              key={selectedImage.id}
              image={selectedImage}
              collections={data.collections}
              readOnly={readOnly}
              onSave={patchImage}
              onDocumentSynced={(next) => setData(next)}
              onStatus={setStatus}
            />
          ) : (
            <p className="text-sm text-charcoal/60">
              Select a gallery image or add a new one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
