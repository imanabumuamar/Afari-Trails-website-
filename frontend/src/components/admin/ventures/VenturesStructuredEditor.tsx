"use client";

import { useCallback, useEffect, useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import {
  VENTURE_SLUGS,
  VENTURE_SLUG_LABELS,
  type VentureSlug,
} from "@/lib/data/venture-defaults";
import { VENTURE_PAGE_SECTIONS } from "@/types/venture-admin";
import { VentureSectionEditor } from "@/components/admin/ventures/VentureSectionEditor";

type VenturesStructuredEditorProps = {
  readOnly?: boolean;
};

export function VenturesStructuredEditor({
  readOnly = false,
}: VenturesStructuredEditorProps) {
  const [slug, setSlug] = useState<VentureSlug>("main");
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = useCallback(async (pageSlug: VentureSlug) => {
    setLoading(true);
    setStatus("");

    const res = await fetch(`/api/admin/content/ventures/${pageSlug}`);
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load venture content."));
      return;
    }

    const doc = await res.json();
    setData((doc.data ?? doc) as Record<string, unknown>);
    setUpdatedAt(doc.updatedAt ?? null);
  }, []);

  useEffect(() => {
    void load(slug);
  }, [slug, load]);

  async function saveSection(key: string, value: unknown) {
    const merged = { ...data, [key]: value };
    setStatus("Saving…");

    const res = await fetch(`/api/admin/content/ventures/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: merged }),
    });

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Save failed."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as Record<string, unknown>);
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Section saved.");
  }

  const previewPath =
    slug === "main"
      ? "/ventures"
      : slug === "connect"
        ? "/ventures/connect"
        : `/ventures/${slug}`;

  const sections = VENTURE_PAGE_SECTIONS[slug];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label
            htmlFor="venture-slug"
            className="block text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
          >
            Venture page
          </label>
          <select
            id="venture-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value as VentureSlug)}
            className="mt-2 w-full max-w-md border border-charcoal/20 bg-ivory px-3 py-2.5 text-sm text-charcoal sm:w-auto"
          >
            {VENTURE_SLUGS.map((s) => (
              <option key={s} value={s}>
                {VENTURE_SLUG_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <a
          href={previewPath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-gold hover:underline"
        >
          Preview page →
        </a>
      </div>

      <p className="max-w-2xl text-sm text-charcoal/65">
        Edit each section like the homepage — text fields, image uploads, and + / −
        to add or remove items in lists and stats.
      </p>

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading…</p>
      ) : (
        <div className="grid gap-8">
          {sections.map((section) => (
            <VentureSectionEditor
              key={section.key}
              slug={slug}
              section={section}
              data={data[section.key]}
              onSave={(value) => saveSection(section.key, value)}
              onStatus={setStatus}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      {updatedAt && (
        <p className="text-xs text-charcoal/50">
          Last updated: {new Date(updatedAt).toLocaleString()}
        </p>
      )}

      {status && (
        <p className="text-sm text-charcoal/70" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
