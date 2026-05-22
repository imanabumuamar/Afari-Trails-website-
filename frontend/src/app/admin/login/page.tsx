"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/homepage";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <h2 className="font-serif text-3xl font-light">Admin sign in</h2>
      <p className="mt-3 text-sm text-charcoal/65">
        Sign in with your admin account. Visitors do not need an account.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-2 w-full border border-charcoal/20 bg-ivory px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-2 w-full border border-charcoal/20 bg-ivory px-4 py-3 text-sm"
          />
        </div>
        {error && (
          <p className="text-sm text-red-800/80" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-charcoal px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-charcoal/60">Loading…</p>}>
      <AdminLoginForm />
    </Suspense>
  );
}
