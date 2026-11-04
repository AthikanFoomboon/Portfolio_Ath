#!/bin/zsh
cd "$(dirname "$0")"
PORT=4173
URL="http://127.0.0.1:$PORT"
if curl -fsS --max-time 1 "$URL" >/dev/null 2>&1; then
  open -a "Google Chrome" "$URL"
  exit 0
fi
open -a "Google Chrome" "$URL"
echo "ATHIKAN Portfolio is running at $URL"
echo "Press Control+C to stop the server."
python3 -m http.server "$PORT" --bind 127.0.0.1
