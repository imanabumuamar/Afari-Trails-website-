#!/bin/bash
# Stop stale dev servers, ensure Mongo, then start API + frontend (webpack dev — lighter on Mac).
set -e
cd "$(dirname "$0")/.."

bash scripts/stop-dev.sh

echo "[dev] Checking MongoDB…"
npm run db:up

echo ""
echo "[dev] Starting API :4000 + site :3000 (webpack, not turbopack)…"
echo "[dev] When you see Ready:"
echo "      Site  → http://localhost:3000"
echo "      Admin → http://localhost:3000/admin/login"
echo "[dev] Keep this terminal open while you work."
echo ""

exec npm run dev:run
