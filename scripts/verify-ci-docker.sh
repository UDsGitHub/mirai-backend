#!/usr/bin/env bash
set -euo pipefail

BACKEND="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="node:24-bookworm"

echo "=== Simulating GitHub Actions (ubuntu + node 24) ==="
docker run --rm \
  -v "$BACKEND:/src:ro" \
  "$IMAGE" \
  bash -c '
    set -e
    mkdir -p /app
    cp -a /src/. /app/
    cd /app

    echo "--- npm ci ---"
    npm ci

    echo "--- @unrs bindings (linux) ---"
    ls -la node_modules/@unrs || true

    echo "--- npm run lint ---"
    npm run lint

    echo "--- npm run test ---"
    npm run test

    echo "--- npm run build ---"
    npm run build

    echo "=== CI simulation passed ==="
  '
