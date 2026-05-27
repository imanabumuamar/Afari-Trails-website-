"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { ROUTES } from "@/config/routes";

const inputClass =
  "mt-2 w-full border border-charcoal/20 bg-ivory px-3 py-2.5 text-sm text-charcoal focus:border-gold/50 focus:outline-none";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

type CheckoutProvider = "manual" | "stripe";

export function CartPageClient() {
  const router = useRouter();
  const { lines, subtotal, itemCount, setQuantity, removeItem, clearCart } =
    useCart();
  const [provider, setProvider] = useState<CheckoutProvider>("manual");
  const [checkingOut, setCheckingOut] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Zambia");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/checkout")
      .then((r) => r.json())
      .then((d: { provider?: CheckoutProvider }) => {
        if (d.provider === "stripe" || d.provider === "manual") {
          setProvider(d.provider);
        }
      })
      .catch(() => setProvider("manual"));
  }, []);

  async function handleStripeCheckout() {
    if (lines.length === 0) return;
    setError(null);
    setCheckingOut(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof body.error === "string"
            ? body.error
            : "Checkout is unavailable. Please try again later.",
        );
        setCheckingOut(false);
        return;
      }

      if (typeof body.url === "string") {
        window.location.href = body.url;
        return;
      }

      setError("Checkout could not be started.");
      setCheckingOut(false);
    } catch {
      setError("Could not reach the server. Is the API running?");
      setCheckingOut(false);
    }
  }

  async function handleOrderRequest(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setError(null);
    setSubmittingOrder(true);

    try {
      const res = await fetch("/api/checkout/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
          name,
          email,
          phone,
          shippingAddress,
          city,
          country,
          notes,
          website: "",
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof body.error === "string"
            ? body.error
            : "Could not submit your order. Please try again.",
        );
        setSubmittingOrder(false);
        return;
      }

      clearCart();
      if (typeof body.redirectUrl === "string") {
        router.push(body.redirectUrl.replace(/^https?:\/\/[^/]+/, "") || ROUTES.storeCheckoutSuccess);
      } else if (body.reference) {
        router.push(`${ROUTES.storeCheckoutSuccess}?order=${body.reference}`);
      }
    } catch {
      setError("Could not reach the server. Is the API running?");
      setSubmittingOrder(false);
    }
  }

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center lg:px-10">
        <h1 className="font-serif text-4xl font-light text-charcoal">Your cart</h1>
        <p className="mt-6 text-sm text-charcoal/60">Your cart is empty.</p>
        <Link
          href={ROUTES.store}
          className="mt-10 inline-block border border-charcoal/25 px-8 py-3 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-charcoal"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 py-24 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/10 pb-8">
        <h1 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
          Your cart
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs uppercase tracking-[0.2em] text-charcoal/45 hover:text-charcoal"
        >
          Clear cart
        </button>
      </div>

      <ul className="divide-y divide-charcoal/10">
        {lines.map((line) => (
          <li key={line.slug} className="flex gap-6 py-8">
            <Link
              href={ROUTES.storeProduct(line.slug)}
              className="relative h-28 w-24 shrink-0 overflow-hidden bg-sand-light/40"
            >
              <Image
                src={line.image}
                alt={line.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={ROUTES.storeProduct(line.slug)}
                className="font-serif text-xl font-light text-charcoal hover:text-gold-muted"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-charcoal/55">{line.priceDisplay}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal/50">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) =>
                      setQuantity(line.slug, Number(e.target.value))
                    }
                    className="w-14 border border-charcoal/20 bg-ivory px-2 py-1 text-sm text-charcoal"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(line.slug)}
                  className="text-xs uppercase tracking-[0.2em] text-charcoal/45 hover:text-charcoal"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-sm font-medium text-charcoal">
              {formatMoney(line.price * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-charcoal/10 pt-10">
        <div className="flex justify-between text-sm">
          <span className="uppercase tracking-[0.2em] text-charcoal/50">
            Subtotal
          </span>
          <span className="text-lg text-charcoal">{formatMoney(subtotal)}</span>
        </div>

        {provider === "manual" ? (
          <div className="mt-12 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-light text-charcoal">
                Request your order
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal/60">
                We&apos;ll confirm availability, shipping to your location, and
                payment options (bank transfer, mobile money, or international
                transfer). No card payment required at checkout.
              </p>
            </div>

            <form onSubmit={handleOrderRequest} className="max-w-lg space-y-6">
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
                  Full name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
                  Shipping address
                </label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
                    Country
                  </label>
                  <input
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55">
                  Notes{" "}
                  <span className="normal-case tracking-normal text-charcoal/40">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sizing, delivery timing, etc."
                  className={`${inputClass} resize-y`}
                />
              </div>

              {error && (
                <p className="text-sm text-red-800/80" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submittingOrder}
                className="w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black disabled:opacity-50 sm:w-auto"
              >
                {submittingOrder ? "Submitting…" : "Submit order request"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <p className="mt-3 text-xs text-charcoal/45">
              Shipping and tax calculated at checkout.
            </p>
            {error && (
              <p className="mt-6 text-sm text-red-800/80" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleStripeCheckout}
              disabled={checkingOut}
              className="mt-8 w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black disabled:opacity-50 sm:w-auto"
            >
              {checkingOut ? "Redirecting…" : "Pay with card"}
            </button>
          </>
        )}

        <Link
          href={ROUTES.store}
          className="mt-8 inline-block text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-charcoal"
        >
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
