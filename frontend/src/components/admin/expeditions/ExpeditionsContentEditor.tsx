"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
} from "@/types/expeditions-content";
import { ExpeditionsAllPageEditor } from "@/components/admin/expeditions/ExpeditionsAllPageEditor";
import { ExpeditionsPageEditor } from "@/components/admin/expeditions/ExpeditionsPageEditor";
import { ExpeditionRegionsEditor } from "@/components/admin/expeditions/ExpeditionRegionsEditor";
import { FeaturedExpeditionsPicker } from "@/components/admin/expeditions/FeaturedExpeditionsPicker";
import { ExpeditionsListManager } from "@/components/admin/expeditions/ExpeditionsListManager";
import { ExpeditionDetailEditor } from "@/components/admin/expeditions/ExpeditionDetailEditor";
import {
  saveExpeditionInContent,
  slugifyExpeditionId,
} from "@/lib/expeditions/expedition-slug";
import { mergeExpeditionsData } from "@/lib/expeditions/merge-expeditions-data";

type ExpeditionsContentEditorProps = {
  readOnly?: boolean;
};

type Tab = "main-page" | "all-journeys" | "expeditions";

function parseTab(value: string | null): Tab {
  if (value === "all-journeys" || value === "expeditions") return value;
  return "main-page";
}

function ExpeditionsContentEditorInner({
  readOnly = false,
}: ExpeditionsContentEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expFromUrl = searchParams.get("exp");
  const tabFromUrl = parseTab(searchParams.get("tab"));

  const [tab, setTab] = useState<Tab>(() =>
    expFromUrl ? "expeditions" : tabFromUrl,
  );
  const [data, setData] = useState<ExpeditionsContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(expFromUrl);

  function syncUrl(nextTab: Tab, nextExp: string | null) {
    const params = new URLSearchParams();
    if (nextTab !== "main-page") params.set("tab", nextTab);
    if (nextTab === "expeditions" && nextExp) params.set("exp", nextExp);
    const qs = params.toString();
    router.replace(qs ? `/admin/expeditions?${qs}` : "/admin/expeditions", {
      scroll: false,
    });
  }

  function changeTab(nextTab: Tab) {
    setTab(nextTab);
    syncUrl(nextTab, nextTab === "expeditions" ? selectedId : null);
  }

  function selectExpedition(id: string) {
    setSelectedId(id);
    setTab("expeditions");
    syncUrl("expeditions", id);
  }

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
    setData(mergeExpeditionsData(doc.data as Partial<ExpeditionsContentData>));
    setUpdatedAt(doc.updatedAt ?? null);
    setSelectedId((prev) => {
      const expeditions = doc.data?.expeditions ?? [];
      const candidate = prev ?? expFromUrl;
      if (
        candidate &&
        expeditions.some((e: ExpeditionDetailRecord) => e.id === candidate)
      ) {
        return candidate;
      }
      return expeditions[0]?.id ?? null;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const urlExp = searchParams.get("exp");
    const urlTab = parseTab(searchParams.get("tab"));
    if (urlExp) {
      setTab("expeditions");
      setSelectedId(urlExp);
      return;
    }
    setTab(urlTab);
  }, [searchParams]);

  async function save(next: ExpeditionsContentData) {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content/expeditions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    const doc = (await res.json()) as {
      data?: Partial<ExpeditionsContentData>;
      updatedAt?: string;
      warning?: string;
      error?: string;
    };

    if (!res.ok || !doc.data) {
      setStatus(doc.error ?? "Save failed.");
      return;
    }

    setData(mergeExpeditionsData(doc.data));
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus(doc.warning ?? "Saved.");
    setTimeout(() => setStatus(""), doc.warning ? 5000 : 2500);
  }

  function patch(partial: Partial<ExpeditionsContentData>) {
    if (!data) return;
    const next = { ...data, ...partial };
    setData(next);
    void save(next);
  }

  async function patchExpedition(
    previousId: string,
    expedition: ExpeditionDetailRecord,
  ) {
    if (!data) return;

    const result = saveExpeditionInContent(data, previousId, expedition);
    if ("error" in result) {
      setStatus(result.error);
      return;
    }

    const newId = slugifyExpeditionId(expedition.id);

    patch(result);

    if (previousId !== newId) {
      setSelectedId(newId);
      syncUrl("expeditions", newId);
      const res = await fetch("/api/admin/content/expeditions/rename-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldId: previousId, newId }),
      });
      if (!res.ok) {
        setStatus(
          "Slug saved, but the image folder could not be renamed on disk. Re-upload images if previews break.",
        );
      }
    }
  }

  function addExpedition(expedition: ExpeditionDetailRecord) {
    if (!data) return;
    if (data.expeditions.some((e) => e.id === expedition.id)) {
      setStatus("An expedition with this ID already exists.");
      return;
    }
    const expeditions = [...data.expeditions, expedition];
    patch({ expeditions });
    selectExpedition(expedition.id);
  }

  function removeExpedition(id: string) {
    if (!data) return;
    const expeditions = data.expeditions.filter((e) => e.id !== id);
    const featuredIds = data.featuredIds.filter((fid) => fid !== id);
    patch({ expeditions, featuredIds });
    if (selectedId === id) {
      const nextId = expeditions[0]?.id ?? null;
      setSelectedId(nextId);
      if (tab === "expeditions") syncUrl("expeditions", nextId);
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
            onClick={() => changeTab("main-page")}
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
            onClick={() => changeTab("all-journeys")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              tab === "all-journeys"
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/70"
            }`}
          >
            All journeys page
          </button>
          <button
            type="button"
            onClick={() => changeTab("expeditions")}
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
            onDocumentSynced={(next) => setData(mergeExpeditionsData(next))}
            onStatus={setStatus}
          />
          <FeaturedExpeditionsPicker
            expeditions={data.expeditions}
            featuredIds={data.featuredIds}
            readOnly={readOnly}
            onSave={(featuredIds) => patch({ featuredIds })}
            onEditExpedition={selectExpedition}
          />
        </div>
      )}

      {tab === "all-journeys" && (
        <div className="space-y-10">
          <ExpeditionRegionsEditor
            regions={data.allPage.regions}
            readOnly={readOnly}
            onSave={(regions) =>
              patch({ allPage: { ...data.allPage, regions } })
            }
            onStatus={setStatus}
          />
          <ExpeditionsAllPageEditor
            allPage={data.allPage}
            readOnly={readOnly}
            onSave={(allPage) => patch({ allPage })}
            onDocumentSynced={(next) => setData(mergeExpeditionsData(next))}
            onStatus={setStatus}
          />
        </div>
      )}

      {tab === "expeditions" && (
        <div className="space-y-10">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <ExpeditionsListManager
            expeditions={data.expeditions}
            selectedId={selectedId}
            readOnly={readOnly}
            onSelect={selectExpedition}
            onAdd={addExpedition}
            onRemove={removeExpedition}
          />
          {selected ? (
            <ExpeditionDetailEditor
              key={selected.id}
              expedition={selected}
              originalId={selected.id}
              readOnly={readOnly}
              allIds={data.expeditions.map((e) => e.id)}
              regions={data.allPage.regions}
              onSave={(exp) => patchExpedition(selected.id, exp)}
              onDocumentSynced={(next) => setData(mergeExpeditionsData(next))}
              onStatus={setStatus}
            />
          ) : (
            <p className="text-sm text-charcoal/60">
              Select an expedition or add a new one.
            </p>
          )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ExpeditionsContentEditor(props: ExpeditionsContentEditorProps) {
  return (
    <Suspense fallback={<p className="text-sm text-charcoal/60">Loading expeditions…</p>}>
      <ExpeditionsContentEditorInner {...props} />
    </Suspense>
  );
}
