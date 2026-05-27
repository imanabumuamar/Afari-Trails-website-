#!/usr/bin/env bash
# Forward Stripe webhooks to the local API (run while npm run dev is up).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v stripe >/dev/null 2>&1; then
  echo "[stripe] Stripe CLI not found."
  echo "  Install: https://stripe.com/docs/stripe-cli#install"
  echo "  macOS:   brew install stripe/stripe-cli/stripe"
  echo "  Then:    stripe login"
  exit 1
fi

echo "[stripe] Forwarding events → http://localhost:4000/api/checkout/webhook"
echo "[stripe] Copy the whsec_... signing secret into backend/.env as STRIPE_WEBHOOK_SECRET"
echo "[stripe] Restart npm run dev after updating .env"
echo ""

exec stripe listen --forward-to localhost:4000/api/checkout/webhook
