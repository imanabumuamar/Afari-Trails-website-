import Stripe from "stripe";
import { Order } from "../models/Order.model.js";
import { getStoreContent } from "./content.service.js";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || key.includes("...")) return null;
  return new Stripe(key);
}

function checkoutMode() {
  const mode = (process.env.CHECKOUT_MODE ?? "auto").trim().toLowerCase();
  if (mode === "manual") return "manual";
  if (mode === "stripe") return "stripe";
  return getStripe() ? "stripe" : "manual";
}

function storefrontUrl() {
  return (
    process.env.STOREFRONT_URL ??
    process.env.CORS_ORIGIN ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
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

    const priceUsd = Number(product.price);
    if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
      const err = new Error(`Invalid price for ${slug}`);
      err.status = 400;
      throw err;
    }

    const unitAmountCents = Math.round(priceUsd * 100);

    lineItems.push({
      slug,
      name: product.name,
      quantity,
      unitAmount: unitAmountCents,
      stripeLine: {
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: unitAmountCents,
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

function orderTotalCents(lineItems) {
  return lineItems.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0);
}

function manualReference() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AFARI-${t}-${r}`;
}

export function getCheckoutProvider() {
  return checkoutMode();
}

export function isCheckoutConfigured() {
  return true;
}

export async function getCheckoutStatusPayload() {
  const provider = checkoutMode();
  return {
    enabled: true,
    provider,
    stripeAvailable: Boolean(getStripe()),
  };
}

export async function createOrderRequest(body) {
  if (body?.website) {
    const err = new Error("Invalid submission");
    err.status = 400;
    throw err;
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const phone = String(body?.phone ?? "").trim();
  const shippingAddress = String(body?.shippingAddress ?? "").trim();
  const city = String(body?.city ?? "").trim();
  const country = String(body?.country ?? "Zambia").trim();
  const notes = String(body?.notes ?? "").trim();

  if (!name) {
    const err = new Error("Name is required");
    err.status = 400;
    throw err;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const err = new Error("Valid email is required");
    err.status = 400;
    throw err;
  }
  if (!shippingAddress) {
    const err = new Error("Shipping address is required");
    err.status = 400;
    throw err;
  }

  const storeDoc = await getStoreContent();
  const products = storeDoc?.data?.products ?? [];
  const resolved = resolveLineItems(body?.items ?? body, products);
  const reference = manualReference();
  const amountTotal = orderTotalCents(resolved);

  const doc = await Order.create({
    reference,
    paymentMethod: "manual",
    status: "awaiting_payment",
    email,
    name,
    phone: phone || undefined,
    shippingAddress,
    city: city || undefined,
    country,
    notes: notes || undefined,
    amountTotal,
    currency: "usd",
    items: resolved.map((r) => ({
      slug: r.slug,
      name: r.name,
      quantity: r.quantity,
      unitAmount: r.unitAmount,
    })),
  });

  console.log(`[order] request ${reference} from ${email}`);

  return {
    provider: "manual",
    orderId: String(doc._id),
    reference,
    redirectUrl: `${storefrontUrl()}/store/checkout/success?order=${reference}`,
  };
}

export async function createCheckoutSession(requestItems) {
  if (checkoutMode() === "manual") {
    const err = new Error(
      "Card checkout is not enabled. Submit your order request on the cart page.",
    );
    err.status = 400;
    throw err;
  }

  const stripe = getStripe();
  if (!stripe) {
    const err = new Error("Stripe is not configured");
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
      allowed_countries: ["US", "CA", "GB", "ZA", "KE", "TZ", "ZM", "AU", "DE", "FR"],
    },
    billing_address_collection: "required",
    metadata: {
      source: "afari-store",
      itemCount: String(resolved.length),
    },
  });

  await Order.create({
    reference: session.id,
    paymentMethod: "stripe",
    stripeSessionId: session.id,
    status: "pending",
    amountTotal: session.amount_total ?? orderTotalCents(resolved),
    currency: session.currency ?? "usd",
    items: resolved.map((r) => ({
      slug: r.slug,
      name: r.name,
      quantity: r.quantity,
      unitAmount: r.unitAmount,
    })),
  });

  return { provider: "stripe", url: session.url, sessionId: session.id };
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
      { reference: session.id },
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
      { reference: session.id },
      { status: "expired" },
    );
  }

  return { received: true };
}
