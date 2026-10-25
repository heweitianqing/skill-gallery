# Shell helpers for scripts/setup-claude-auth.sh. The runners themselves are
# Node scripts (scripts/run-*.mjs); keep this file in sync with
# scripts/lib/common.mjs (CONFIG_DIR) and run-claude.mjs (findClaude).
# shellcheck shell=bash

# Credentials and other per-operator state live here, outside the repo.
SG_CONFIG_DIR="${SKILL_GALLERY_CONFIG_DIR:-$HOME/.config/skill-gallery}"

die() { echo "error: $*" >&2; exit 1; }

# Locate the Claude Code CLI: $CLAUDE_BIN, then `claude` on PATH, then the
# newest copy bundled inside the Claude desktop app (macOS).
find_claude_bin() {
  if [[ -n "${CLAUDE_BIN:-}" ]]; then
    [[ -x "$CLAUDE_BIN" ]] || die "CLAUDE_BIN is not executable: $CLAUDE_BIN"
    echo "$CLAUDE_BIN"; return
  fi
  if command -v claude >/dev/null 2>&1; then
    command -v claude; return
  fi
  local base="$HOME/Library/Application Support/Claude/claude-code"
  local best=""
  if [[ -d "$base" ]]; then
    best="$(find "$base" -path '*/claude.app/Contents/MacOS/claude' -type f -perm -u+x 2>/dev/null \
      | awk -F/ '{ for (i = 1; i <= NF; i++) if ($i == "claude-code") { print $(i+1) "\t" $0; break } }' \
      | sort -t $'\t' -k1,1V | tail -n 1 | cut -f2-)"
  fi
  [[ -n "$best" ]] || die "Claude Code CLI not found. Install it or set CLAUDE_BIN."
  echo "$best"
}
