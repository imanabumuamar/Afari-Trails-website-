"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  isAdminTabAuthenticated,
  markAdminTabAuthenticated,
} from "@/lib/auth/admin-tab-session";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const { status } = useSession();
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && isAdminTabAuthenticated()) {
      window.location.href = callbackUrl;
    }
  }, [status, callbackUrl]);

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

    markAdminTabAuthenticated();
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
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-charcoal/20 bg-ivory py-3 pl-4 pr-20 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.15em] text-charcoal/55 transition-colors hover:text-charcoal"
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
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
          <code className="text-[10px]">backend/.env</code> (must be 10+ characters
          for admin panel resets).
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
