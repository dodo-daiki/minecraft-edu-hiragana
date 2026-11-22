#!/bin/sh
# Downloads the official Japanese translations of the bundled MakeCode for Minecraft packages.
set -e
cd "$(dirname "$0")"
mkdir -p source
for p in core builder shapes events nether; do
  curl -sfL -o "source/$p-strings.json" \
    "https://makecode.com/api/translations?lang=ja&filename=minecraft%2F$p-strings.json&approved=true"
  echo "source/$p-strings.json"
done
