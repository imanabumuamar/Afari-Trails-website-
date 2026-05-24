"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    authError === "CredentialsSignin"
      ? "Invalid email or password."
      : authError
        ? "Sign-in failed. Try again."
        : "",
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    const result = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      setLoading(false);
      setError(
        result?.error === "CredentialsSignin" || result?.status === 401
          ? "Invalid email or password."
          : "Could not sign in. Start MongoDB and the API (npm run dev from the project root), then use http://localhost:3000.",
      );
      return;
    }

    // Full navigation so middleware picks up the new session cookie
    window.location.href = callbackUrl;
  }

  return (
    <div className="mx-auto max-w-md">
      <h2 className="font-serif text-3xl font-light">Admin sign in</h2>
      <p className="mt-3 text-sm text-charcoal/65">
        Staff only. Use the same URL as this page (prefer{" "}
        <strong className="font-normal">localhost:3000</strong>, not 127.0.0.1).
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

      {process.env.NODE_ENV === "development" && (
        <p className="mt-8 border-t border-charcoal/10 pt-6 text-xs text-charcoal/45">
          Dev default (if you ran <code className="text-[10px]">npm run db:seed</code>
          ): <span className="text-charcoal/60">admin@afaritrails.com</span> — password
          from <code className="text-[10px]">ADMIN_PASSWORD</code> in{" "}
          <code className="text-[10px]">.env.local</code> (often changeme123).
        </p>
      )}
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
