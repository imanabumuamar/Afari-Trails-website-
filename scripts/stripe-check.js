#!/usr/bin/env node
/**
 * Verifies Stripe keys in backend/.env (optional — not available in Zambia).
 * Default checkout is manual order requests (CHECKOUT_MODE=manual).
 * Usage: npm run stripe:check
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, "backend/.env") });

const secret = process.env.STRIPE_SECRET_KEY?.trim();
const webhook = process.env.STRIPE_WEBHOOK_SECRET?.trim();

const mode = (process.env.CHECKOUT_MODE ?? "auto").trim().toLowerCase();

if (mode === "manual") {
  console.log("[stripe] CHECKOUT_MODE=manual — store uses order requests (no Stripe needed).");
  console.log("[stripe] Skip this script unless you enable card checkout later.");
  process.exit(0);
}

if (!secret || secret.includes("...") || !secret.startsWith("sk_")) {
  console.log(`
[stripe] No Stripe key — store checkout uses manual order requests (works in Zambia).

Optional card checkout (requires a Stripe account in a supported country):
  1. https://dashboard.stripe.com/test/apikeys → sk_test_...
  2. backend/.env: STRIPE_SECRET_KEY=... and CHECKOUT_MODE=stripe
`);
  process.exit(0);
}

let Stripe;
try {
  Stripe = (await import(path.join(root, "backend/node_modules/stripe/index.js")))
    .default;
} catch {
  console.error("[stripe] Run: npm install --prefix backend");
  process.exit(1);
}

const stripe = new Stripe(secret);

try {
  const balance = await stripe.balance.retrieve();
  console.log("[stripe] Secret key is valid (test mode).");
  console.log(
    `[stripe] Available balance: ${balance.available.map((b) => `${b.amount / 100} ${b.currency.toUpperCase()}`).join(", ") || "0"}`,
  );
} catch (err) {
  console.error("[stripe] Key rejected:", err.message);
  process.exit(1);
}

if (!webhook || webhook.includes("...") || !webhook.startsWith("whsec_")) {
  console.warn(`
[stripe] STRIPE_WEBHOOK_SECRET not set yet — checkout works, but orders stay "pending" until webhooks run.

Run in a second terminal (install CLI first: https://stripe.com/docs/stripe-cli):

  npm run stripe:listen

Then copy whsec_... into backend/.env and restart npm run dev.
`);
} else {
  console.log("[stripe] Webhook secret is set.");
}

console.log("\n[stripe] Next: npm run dev → add to cart → checkout with 4242 4242 4242 4242");
