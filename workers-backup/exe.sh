#!/bin/bash

ACCOUNT_ID="e608c2806ee26a6d79157a5fcfe16427"
API_TOKEN="cfut_5FFyOo4luXIa9P6UwNQxvVAFt0pfchPqvJvMkBwG7d43ff3f"

mkdir -p workers-backup
cd workers-backup || exit

echo "Recupero lista workers..."

curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  | jq -r '.result[].id' > workers.txt

echo "Download workers..."

while read -r worker; do
  echo "Scarico $worker"
  mkdir -p "$worker"

  curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$worker" \
    -H "Authorization: Bearer $API_TOKEN" \
    -o "$worker/worker.js"

done < workers.txt

echo "Fatto."
