"use client";

import { useCallback, useEffect, useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
} from "@/types/expeditions-content";
import { ExpeditionsPageEditor } from "@/components/admin/expeditions/ExpeditionsPageEditor";
import { FeaturedExpeditionsPicker } from "@/components/admin/expeditions/FeaturedExpeditionsPicker";
import { ExpeditionsListManager } from "@/components/admin/expeditions/ExpeditionsListManager";
import { ExpeditionDetailEditor } from "@/components/admin/expeditions/ExpeditionDetailEditor";

type ExpeditionsContentEditorProps = {
  readOnly?: boolean;
};

type Tab = "main-page" | "expeditions";

export function ExpeditionsContentEditor({
  readOnly = false,
}: ExpeditionsContentEditorProps) {
  const [tab, setTab] = useState<Tab>("main-page");
  const [data, setData] = useState<ExpeditionsContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/admin/content/expeditions");
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load expedition content."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as ExpeditionsContentData);
    setUpdatedAt(doc.updatedAt ?? null);
    setSelectedId((prev) => {
      if (prev) return prev;
      return doc.data?.expeditions?.[0]?.id ?? null;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(next: ExpeditionsContentData) {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content/expeditions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Save failed."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as ExpeditionsContentData);
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2500);
  }

  function patch(partial: Partial<ExpeditionsContentData>) {
    if (!data) return;
    const next = { ...data, ...partial };
    setData(next);
    void save(next);
  }

  function patchExpedition(id: string, expedition: ExpeditionDetailRecord) {
    if (!data) return;
    const expeditions = data.expeditions.map((e) =>
      e.id === id ? expedition : e,
    );
    patch({ expeditions });
  }

  function addExpedition(expedition: ExpeditionDetailRecord) {
    if (!data) return;
    if (data.expeditions.some((e) => e.id === expedition.id)) {
      setStatus("An expedition with this ID already exists.");
      return;
    }
    const expeditions = [...data.expeditions, expedition];
    patch({ expeditions });
    setSelectedId(expedition.id);
    setTab("expeditions");
  }

  function removeExpedition(id: string) {
    if (!data) return;
    const expeditions = data.expeditions.filter((e) => e.id !== id);
    const featuredIds = data.featuredIds.filter((fid) => fid !== id);
    patch({ expeditions, featuredIds });
    if (selectedId === id) {
      setSelectedId(expeditions[0]?.id ?? null);
    }
  }

  const selected = data?.expeditions.find((e) => e.id === selectedId);

  if (loading) {
    return <p className="text-sm text-charcoal/60">Loading expeditions…</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "No data."}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 border-b border-charcoal/10 pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("main-page")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              tab === "main-page"
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/70"
            }`}
          >
            Main page
          </button>
          <button
            type="button"
            onClick={() => setTab("expeditions")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              tab === "expeditions"
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/70"
            }`}
          >
            All expeditions
          </button>
        </div>
        {updatedAt && (
          <span className="text-xs text-charcoal/45">
            Last saved {new Date(updatedAt).toLocaleString()}
          </span>
        )}
        {status && (
          <span className="text-xs text-charcoal/60">{status}</span>
        )}
      </div>

      {tab === "main-page" && (
        <div className="space-y-12">
          <ExpeditionsPageEditor
            page={data.page}
            readOnly={readOnly}
            onSave={(page) => patch({ page })}
            onDocumentSynced={(next) => setData(next)}
            onStatus={setStatus}
          />
          <FeaturedExpeditionsPicker
            expeditions={data.expeditions}
            featuredIds={data.featuredIds}
            readOnly={readOnly}
            onSave={(featuredIds) => patch({ featuredIds })}
          />
        </div>
      )}

      {tab === "expeditions" && (
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <ExpeditionsListManager
            expeditions={data.expeditions}
            selectedId={selectedId}
            readOnly={readOnly}
            onSelect={setSelectedId}
            onAdd={addExpedition}
            onRemove={removeExpedition}
          />
          {selected ? (
            <ExpeditionDetailEditor
              key={selected.id}
              expedition={selected}
              readOnly={readOnly}
              allIds={data.expeditions.map((e) => e.id)}
              onSave={(exp) => patchExpedition(selected.id, exp)}
              onDocumentSynced={(next) => setData(next)}
              onStatus={setStatus}
            />
          ) : (
            <p className="text-sm text-charcoal/60">
              Select an expedition or add a new one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
