"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ConnectPageEditor } from "@/components/admin/connect/ConnectPageEditor";
import { SaveButton } from "@/components/admin/ventures/AdminField";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import { mergeConnectData } from "@/lib/connect/merge-connect-data";
import {
  CONNECT_PAGE_SECTION_LABELS,
  visibleConnectSections,
} from "@/lib/connect/connect-page-sections";
import type { ConnectContentData } from "@/types/connect-content";
import type { ConnectPageConfig } from "@/types/connect-page";

type Tab = keyof ConnectContentData;

const TABS: { id: Tab; label: string; preview: string }[] = [
  { id: "contact", label: "Partner & Get in Touch", preview: "/contact" },
  { id: "expeditions", label: "Plan Your Journey", preview: "/expeditions/connect" },
];

type ConnectContentEditorProps = {
  readOnly?: boolean;
};

export function ConnectContentEditor({ readOnly = false }: ConnectContentEditorProps) {
  const [tab, setTab] = useState<Tab>("contact");
  const [data, setData] = useState<ConnectContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/admin/content/connect");
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load connect content."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as ConnectContentData);
    setUpdatedAt(doc.updatedAt ?? null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updatePage(key: Tab, config: ConnectPageConfig) {
    setData((prev) => (prev ? { ...prev, [key]: config } : prev));
  }

  async function handleSave() {
    if (!data || readOnly) return;

    setSaving(true);
    setStatus("Saving…");

    const res = await fetch("/api/admin/content/connect", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    setSaving(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Save failed."));
      return;
    }

    const doc = (await res.json()) as {
      data?: ConnectContentData;
      updatedAt?: string;
      warning?: string;
      error?: string;
    };

    if (!doc.data) {
      setStatus(doc.error ?? "Save failed.");
      return;
    }

    setData(mergeConnectData(doc.data));
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus(doc.warning ?? "Saved.");
    setTimeout(() => setStatus(""), doc.warning ? 5000 : 2500);
  }

  if (loading) {
    return <p className="text-sm text-charcoal/60">Loading connect pages…</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "No data."}</p>;
  }

  const activePreview = TABS.find((t) => t.id === tab)?.preview ?? "/contact";
  const pageConfig = data[tab];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 border-b border-charcoal/10 pb-4">
        <Link
          href={activePreview}
          target="_blank"
          className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-gold"
        >
          View live page →
        </Link>
        {updatedAt && (
          <span className="text-xs text-charcoal/45">
            Last saved {new Date(updatedAt).toLocaleString()}
          </span>
        )}
        {status && <span className="text-xs text-charcoal/60">{status}</span>}
      </div>

      <p className="text-sm text-charcoal/60">
        Ventures connect is edited under{" "}
        <Link href="/admin/ventures" className="underline hover:text-gold">
          Ventures → Connect
        </Link>
        . Each tab below matches the live page — only sections that appear on
        the site are shown.{" "}
        <strong className="font-normal">
          Form submissions (Begin the Conversation) do not appear here
        </strong>
        — read them in{" "}
        <Link href="/admin/messages?source=contact" className="underline hover:text-gold">
          Admin → Messages → Contact
        </Link>
        .
      </p>

      <div className="flex flex-wrap gap-2 border-b border-charcoal/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === t.id
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/60 hover:border-charcoal/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-charcoal/50">
        <span className="uppercase tracking-[0.16em]">On this page: </span>
        {visibleConnectSections(tab)
          .map((key) => CONNECT_PAGE_SECTION_LABELS[key])
          .join(" · ")}
      </p>

      <div className="space-y-8">
        <ConnectPageEditor
          pageKey={tab}
          config={pageConfig}
          readOnly={readOnly}
          onChange={(config) => updatePage(tab, config)}
          onDocumentSynced={(synced) => setData(mergeConnectData(synced))}
          onStatus={setStatus}
        />
        {!readOnly && (
          <div className="border-t border-charcoal/10 pt-6">
            <SaveButton
              saving={saving}
              label="Save connect pages"
              onClick={() => void handleSave()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
