#!/bin/bash
# Stop stale dev servers, then start API + frontend together.
set -e
cd "$(dirname "$0")/.."

for port in 3000 4000; do
  pid=$(lsof -ti :"$port" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo "[dev] Stopping process on port $port (PID $pid)"
    kill -9 $pid 2>/dev/null || true
  fi
done

exec npm run dev:run
