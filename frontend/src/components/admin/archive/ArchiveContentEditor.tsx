"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import { normalizeArchiveImage } from "@/lib/archive/image-categories";
import { upsertSpotlightGalleryImage } from "@/lib/archive/spotlight-gallery";
import type {
  ArchiveContentData,
  ArchiveImageRecord,
} from "@/types/archive-content";
import { ArchiveAfariLensEditor } from "@/components/admin/archive/ArchiveAfariLensEditor";
import { ArchivePageEditor } from "@/components/admin/archive/ArchivePageEditor";
import { ArchiveCollectionsEditor } from "@/components/admin/archive/ArchiveCollectionsEditor";
import { ArchiveLatestMomentsEditor } from "@/components/admin/archive/ArchiveLatestMomentsEditor";
import { ArchiveGalleryListManager } from "@/components/admin/archive/ArchiveGalleryListManager";
import { ArchiveGalleryImageEditor } from "@/components/admin/archive/ArchiveGalleryImageEditor";

type ArchiveContentEditorProps = {
  readOnly?: boolean;
};

type Tab = "page" | "potm" | "collections" | "moments" | "gallery";

export function ArchiveContentEditor({ readOnly = false }: ArchiveContentEditorProps) {
  const [tab, setTab] = useState<Tab>("page");
  const [data, setData] = useState<ArchiveContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const dataRef = useRef<ArchiveContentData | null>(null);
  const saveGenerationRef = useRef(0);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

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
    const loaded = doc.data as ArchiveContentData;
    dataRef.current = loaded;
    setData(loaded);
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
    const generation = ++saveGenerationRef.current;
    setStatus("Saving…");

    const res = await fetch("/api/admin/content/archive", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    if (!res.ok) {
      if (generation === saveGenerationRef.current) {
        setStatus(await readAdminApiError(res, "Save failed."));
      }
      return;
    }

    const doc = await res.json();

    if (generation !== saveGenerationRef.current) {
      const latest = dataRef.current;
      if (latest) void save(latest);
      return;
    }

    const saved = doc.data as ArchiveContentData;
    dataRef.current = saved;
    setData(saved);
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2500);
  }

  function syncFromUpload(
    next: ArchiveContentData,
    updatedAt?: string | null,
  ) {
    saveGenerationRef.current += 1;
    dataRef.current = next;
    setData(next);
    if (updatedAt) setUpdatedAt(updatedAt);
  }

  function patch(next: ArchiveContentData) {
    dataRef.current = next;
    setData(next);
    void save(next);
  }

  function patchPartial(partial: Partial<ArchiveContentData>) {
    if (!data) return;
    patch({ ...data, ...partial });
  }

  function patchAfariLens(afariLens: ArchiveContentData["page"]["afariLens"]) {
    if (!data) return;
    let next: ArchiveContentData = {
      ...data,
      page: { ...data.page, afariLens },
    };
    if (afariLens.image.trim()) {
      next = upsertSpotlightGalleryImage(next, afariLens.image);
    }
    patch(next);
  }

  function patchImage(image: ArchiveImageRecord) {
    if (!data) return;
    const normalized = normalizeArchiveImage(image);
    const images = data.images.map((i) =>
      i.id === normalized.id ? normalized : i,
    );
    if (!images.some((i) => i.id === normalized.id)) {
      images.push(normalized);
    }
    patchPartial({ images });
  }

  function addImage(image: ArchiveImageRecord) {
    if (!data) return;
    const normalized = normalizeArchiveImage(image);
    if (data.images.some((i) => i.id === normalized.id)) {
      setStatus("An image with this id already exists.");
      return;
    }
    patchPartial({ images: [...data.images, normalized] });
    setSelectedImageId(image.id);
    setTab("gallery");
  }

  function removeImage(id: string) {
    if (!data) return;
    patchPartial({
      images: data.images.filter((i) => i.id !== id),
      latestMoments: data.latestMoments.filter((momentId) => momentId !== id),
    });
    if (selectedImageId === id) {
      setSelectedImageId(
        data.images.find((i) => i.id !== id)?.id ?? null,
      );
    }
  }

  function reorderImage(id: string, direction: -1 | 1) {
    if (!data) return;
    const index = data.images.findIndex((i) => i.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= data.images.length) return;
    const images = [...data.images];
    [images[index], images[target]] = [images[target], images[index]];
    patchPartial({ images });
  }

  function toggleImagePublished(id: string) {
    if (!data) return;
    const images = data.images.map((img) =>
      img.id === id ? { ...img, published: img.published === false } : img,
    );
    patchPartial({ images });
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
    { id: "potm", label: "Photo of the month" },
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
          onSave={(page) => patchPartial({ page })}
          onDocumentSynced={syncFromUpload}
          onStatus={setStatus}
        />
      )}

      {tab === "potm" && (
        <ArchiveAfariLensEditor
          afariLens={data.page.afariLens}
          readOnly={readOnly}
          onSave={patchAfariLens}
          onDocumentSynced={syncFromUpload}
          onStatus={setStatus}
        />
      )}

      {tab === "collections" && (
        <ArchiveCollectionsEditor
          collections={data.collections}
          readOnly={readOnly}
          onSave={(collections) => patchPartial({ collections })}
          onDocumentSynced={syncFromUpload}
          onStatus={setStatus}
        />
      )}

      {tab === "moments" && (
        <ArchiveLatestMomentsEditor
          momentIds={data.latestMoments}
          galleryImages={data.images}
          readOnly={readOnly}
          onSave={(latestMoments) => patchPartial({ latestMoments })}
          onStatus={setStatus}
        />
      )}

      {tab === "gallery" && (
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <ArchiveGalleryListManager
            images={data.images}
            defaultCategory={
              data.collections.find((c) => c.hidden !== true)?.id ??
              data.collections[0]?.id ??
              "wildlife"
            }
            selectedId={selectedImageId}
            readOnly={readOnly}
            onSelect={setSelectedImageId}
            onAdd={addImage}
            onRemove={removeImage}
            onReorder={reorderImage}
            onTogglePublished={toggleImagePublished}
          />
          {selectedImage ? (
            <ArchiveGalleryImageEditor
              key={selectedImage.id}
              image={selectedImage}
              collections={data.collections}
              readOnly={readOnly}
              onSave={patchImage}
              onDocumentSynced={syncFromUpload}
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
