#!/bin/sh
set -e

DATA_DIR="${DATA_DIR:-/data/content}"

# On first run (empty data volume) optionally seed the initial content.
if [ "${SEED_ON_EMPTY:-true}" = "true" ]; then
  if [ -z "$(ls -A "$DATA_DIR"/*.json 2>/dev/null)" ]; then
    echo "[entrypoint] No content found in $DATA_DIR — seeding initial content."
    npm run seed
  fi
fi

exec npm run start
