#!/bin/bash
# Free ports used by local dev (Next.js + API).
set -e
cd "$(dirname "$0")/.."

for port in 3000 4000; do
  pid=$(lsof -ti :"$port" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo "[stop] Port $port → stopping PID $pid"
    kill -9 $pid 2>/dev/null || true
  fi
done

echo "[stop] Ports 3000 and 4000 are free."
