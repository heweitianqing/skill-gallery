#!/usr/bin/env bash
# One-time setup: create a long-lived Claude Code OAuth token for the isolated
# runs and store it outside the repo (default ~/.config/skill-gallery/).
#
# The isolated runs use a fresh, empty CLAUDE_CONFIG_DIR each time, so they
# cannot reuse the login of your normal Claude Code / Claude desktop setup.
# Instead they read CLAUDE_CODE_OAUTH_TOKEN from the file this script writes.
# Alternatively, export ANTHROPIC_API_KEY before calling run-claude.sh.
set -euo pipefail
. "$(dirname "$0")/lib.sh"

CLAUDE="$(find_claude_bin)"
TOKEN_FILE="$SG_CONFIG_DIR/claude-oauth-token"

mkdir -p "$SG_CONFIG_DIR"
chmod 700 "$SG_CONFIG_DIR"

echo "Running: \"$CLAUDE\" setup-token"
echo "Follow the browser sign-in, then copy the token it prints."
"$CLAUDE" setup-token

printf 'Paste the token here (input is hidden), then press Enter: '
IFS= read -rs TOKEN
echo
TOKEN="$(printf '%s' "$TOKEN" | tr -d '[:space:]')"
[[ -n "$TOKEN" ]] || die "no token entered"

( umask 077; printf '%s' "$TOKEN" > "$TOKEN_FILE" )
echo "Saved to $TOKEN_FILE (mode 600). Do not copy it into the repo."
