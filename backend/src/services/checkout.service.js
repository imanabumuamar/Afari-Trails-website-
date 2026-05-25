import Stripe from "stripe";
import { Order } from "../models/Order.model.js";
import { getStoreContent } from "./content.service.js";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

function storefrontUrl() {
  return (process.env.STOREFRONT_URL ?? process.env.CORS_ORIGIN ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

function resolveLineItems(requestItems, products) {
  if (!Array.isArray(requestItems) || requestItems.length === 0) {
    const err = new Error("Cart is empty");
    err.status = 400;
    throw err;
  }

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lineItems = [];

  for (const row of requestItems) {
    const slug = String(row?.slug ?? "").trim();
    const quantity = Math.floor(Number(row?.quantity));
    if (!slug || quantity < 1 || quantity > 99) {
      const err = new Error("Invalid cart item");
      err.status = 400;
      throw err;
    }

    const product = bySlug.get(slug);
    if (!product) {
      const err = new Error(`Product not found: ${slug}`);
      err.status = 400;
      throw err;
    }

    const unitAmount = Math.round(Number(product.price) * 100);
    if (!Number.isFinite(unitAmount) || unitAmount < 50) {
      const err = new Error(`Invalid price for ${slug}`);
      err.status = 400;
      throw err;
    }

    lineItems.push({
      slug,
      name: product.name,
      quantity,
      unitAmount,
      stripeLine: {
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: product.name,
            description: product.shortDescription?.slice(0, 200) || undefined,
            images: product.image ? [product.image] : undefined,
          },
        },
      },
    });
  }

  return lineItems;
}

export function isCheckoutConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export async function createCheckoutSession(requestItems) {
  const stripe = getStripe();
  if (!stripe) {
    const err = new Error(
      "Checkout is not configured. Add STRIPE_SECRET_KEY to backend/.env",
    );
    err.status = 503;
    throw err;
  }

  const storeDoc = await getStoreContent();
  const products = storeDoc?.data?.products ?? [];
  const resolved = resolveLineItems(requestItems, products);
  const base = storefrontUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: resolved.map((r) => r.stripeLine),
    success_url: `${base}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/store/checkout/cancel`,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "ZA", "KE", "TZ", "AU", "DE", "FR"],
    },
    billing_address_collection: "required",
    metadata: {
      source: "afari-store",
      itemCount: String(resolved.length),
    },
  });

  await Order.create({
    stripeSessionId: session.id,
    status: "pending",
    amountTotal: session.amount_total ?? undefined,
    currency: session.currency ?? "usd",
    items: resolved.map((r) => ({
      slug: r.slug,
      name: r.name,
      quantity: r.quantity,
      unitAmount: r.unitAmount,
    })),
  });

  return { url: session.url, sessionId: session.id };
}

export async function handleStripeWebhook(rawBody, signature) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !secret) {
    const err = new Error("Webhook not configured");
    err.status = 503;
    throw err;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    const err = new Error("Invalid webhook signature");
    err.status = 400;
    throw err;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        status: "paid",
        email: session.customer_details?.email ?? session.customer_email,
        amountTotal: session.amount_total,
        currency: session.currency,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
      },
    );
    console.log(`[order] paid ${session.id}`);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: "expired" },
    );
  }

  return { received: true };
}
