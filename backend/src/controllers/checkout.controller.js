import * as checkoutService from "../services/checkout.service.js";

export async function getCheckoutStatus(_req, res, next) {
  try {
    const payload = await checkoutService.getCheckoutStatusPayload();
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function createSession(req, res, next) {
  try {
    const items = req.body?.items ?? req.body;
    const result = await checkoutService.createCheckoutSession(items);
    res.json(result);
  } catch (err) {
    if (err.status === 400 || err.status === 503) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

export async function createOrderRequest(req, res, next) {
  try {
    const result = await checkoutService.createOrderRequest(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

export async function stripeWebhook(req, res, next) {
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature" });
    }
    await checkoutService.handleStripeWebhook(req.body, signature);
    res.json({ received: true });
  } catch (err) {
    if (err.status === 400 || err.status === 503) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}
