"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type HealthState =
  | { kind: "checking" }
  | { kind: "ok"; database: string }
  | { kind: "down"; message: string };

export function AdminStackStatus() {
  const [health, setHealth] = useState<HealthState>({ kind: "checking" });

  const check = useCallback(async () => {
    setHealth({ kind: "checking" });
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const body = (await res.json()) as {
        ok?: boolean;
        message?: string;
        database?: string;
      };

      if (res.ok && body.ok) {
        setHealth({
          kind: "ok",
          database: body.database ?? "unknown",
        });
        return;
      }

      setHealth({
        kind: "down",
        message:
          body.message ??
          "API is not running. From the project root run: npm run dev",
      });
    } catch {
      setHealth({
        kind: "down",
        message:
          "Cannot reach the API. From the project root run: npm run dev",
      });
    }
  }, []);

  useEffect(() => {
    void check();
    const id = window.setInterval(() => void check(), 30_000);
    return () => window.clearInterval(id);
  }, [check]);

  if (health.kind === "checking" || health.kind === "ok") {
    return null;
  }

  return (
    <div
      className="mb-8 rounded border border-red-900/25 bg-red-50 px-5 py-4 text-sm text-red-950/90"
      role="alert"
    >
      <p className="font-medium">Editing will not work until the API is running</p>
      <p className="mt-2 leading-relaxed">{health.message}</p>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-charcoal/80">
        <li>
          In Terminal, go to your project folder:{" "}
          <code className="text-xs">cd …/website</code>
        </li>
        <li>
          Run <code className="text-xs">npm run dev</code> and wait for{" "}
          <strong className="font-normal">Ready</strong> on port 3000
        </li>
        <li>
          Keep that terminal open, then{" "}
          <button
            type="button"
            onClick={() => void check()}
            className="text-gold underline hover:no-underline"
          >
            check again
          </button>{" "}
          or{" "}
          <Link href="/admin/login" className="text-gold underline hover:no-underline">
            sign in again
          </Link>
        </li>
      </ol>
    </div>
  );
}
