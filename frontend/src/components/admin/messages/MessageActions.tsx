"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MessageActionsProps = {
  id: string;
  archived: boolean;
  canWrite?: boolean;
};

export function MessageActions({
  id,
  archived,
  canWrite = true,
}: MessageActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<"archive" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patchArchived(nextArchived: boolean) {
    setError(null);
    setBusy("archive");
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: nextArchived }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          typeof body.error === "string" ? body.error : "Could not update message",
        );
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    const label = archived ? "permanently delete" : "delete";
    if (!window.confirm(`Are you sure you want to ${label} this message?`)) {
      return;
    }

    setError(null);
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          typeof body.error === "string" ? body.error : "Could not delete message",
        );
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {canWrite ? (
        <div className="flex flex-wrap justify-end gap-2">
        {archived ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => patchArchived(false)}
            className="border border-charcoal/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-charcoal/70 transition-colors hover:border-charcoal/50 disabled:opacity-50"
          >
            {busy === "archive" ? "Restoring…" : "Restore"}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => patchArchived(true)}
            className="border border-charcoal/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-charcoal/70 transition-colors hover:border-charcoal/50 disabled:opacity-50"
          >
            {busy === "archive" ? "Archiving…" : "Archive"}
          </button>
        )}
        <button
          type="button"
          disabled={busy !== null}
          onClick={handleDelete}
          className="border border-red-900/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-red-900/70 transition-colors hover:border-red-900/50 disabled:opacity-50"
        >
          {busy === "delete" ? "Deleting…" : "Delete"}
        </button>
      </div>
      ) : (
        <p className="text-[10px] uppercase tracking-[0.12em] text-charcoal/45">
          View only
        </p>
      )}
      {error && (
        <p className="text-xs text-red-800/80" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
