"use client";

import { useCallback, useEffect, useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import { mergeStoreContentData } from "@/lib/store/merge-store-content";
import type { StoreContentData } from "@/types/store-content";

export function useStoreAdmin(readOnly = false) {
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
    setData(mergeStoreContentData(doc.data));
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
      return false;
    }

    const doc = await res.json();
    setData(mergeStoreContentData(doc.data));
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2500);
    return true;
  }

  function syncFromUpload(next: StoreContentData) {
    setData(mergeStoreContentData(next));
  }

  function patch(partial: Partial<StoreContentData>) {
    if (!data) return;
    const next = { ...data, ...partial };
    setData(next);
    void save(next);
  }

  return {
    data,
    setData,
    loading,
    status,
    setStatus,
    updatedAt,
    readOnly,
    load,
    save,
    patch,
    syncFromUpload,
  };
}
