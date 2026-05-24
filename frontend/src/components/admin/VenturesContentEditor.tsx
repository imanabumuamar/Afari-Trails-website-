"use client";

import { useCallback, useEffect, useState } from "react";
import {
  VENTURE_SLUGS,
  VENTURE_SLUG_LABELS,
  type VentureSlug,
} from "@/lib/data/venture-defaults";

type VenturesContentEditorProps = {
  readOnly?: boolean;
};

export function VenturesContentEditor({
  readOnly = false,
}: VenturesContentEditorProps) {
  const [slug, setSlug] = useState<VentureSlug>("main");
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const load = useCallback(async (pageSlug: VentureSlug) => {
    setLoading(true);
    setStatus(null);
    setParseError(null);

    const res = await fetch(`/api/admin/content/ventures/${pageSlug}`);
    setLoading(false);

    if (res.status === 401) {
      setStatus("Session expired. Sign in again.");
      return;
    }
    if (!res.ok) {
      setStatus("Could not load venture content.");
      return;
    }

    const doc = await res.json();
    setJsonText(JSON.stringify(doc.data ?? doc, null, 2));
  }, []);

  useEffect(() => {
    load(slug);
  }, [slug, load]);

  function validateJson(): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(jsonText) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setParseError("Content must be a JSON object.");
        return null;
      }
      setParseError(null);
      return parsed as Record<string, unknown>;
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
      return null;
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const data = validateJson();
    if (!data) return;

    setSaving(true);
    setStatus("Saving…");

    const res = await fetch(`/api/admin/content/ventures/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    setSaving(false);

    if (res.status === 401) {
      setStatus("Session expired. Sign in again.");
      return;
    }
    if (!res.ok) {
      setStatus("Save failed. Check JSON and try again.");
      return;
    }

    const doc = await res.json();
    setJsonText(JSON.stringify(doc.data ?? doc, null, 2));
    setStatus(`Saved ${VENTURE_SLUG_LABELS[slug]}.`);
  }

  function handleFormat() {
    const data = validateJson();
    if (data) setJsonText(JSON.stringify(data, null, 2));
  }

  const previewPath =
    slug === "main"
      ? "/ventures"
      : slug === "connect"
        ? "/ventures/connect"
        : `/ventures/${slug}`;

  return (
    <div className="space-y-6">
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
        Edit the full content object for this venture page as JSON. Keys match
        section data (e.g. <code className="text-charcoal">ecoLodgeHero</code>
        , <code className="text-charcoal">venturesHero</code>). Image fields
        use URL strings.
      </p>

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setParseError(null);
            }}
            readOnly={readOnly}
            rows={28}
            spellCheck={false}
            className="w-full border border-charcoal/15 bg-ivory p-4 font-mono text-xs leading-relaxed text-charcoal disabled:opacity-60"
            aria-label="Venture content JSON"
          />

          {parseError && (
            <p className="text-sm text-red-800/80" role="alert">
              {parseError}
            </p>
          )}

          {!readOnly && (
            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-charcoal px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleFormat}
                className="border border-charcoal/25 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-charcoal"
              >
                Format JSON
              </button>
            </div>
          )}
        </form>
      )}

      {status && (
        <p className="text-sm text-charcoal/70" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
