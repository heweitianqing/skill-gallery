#!/usr/bin/env bash
# Sets the repository description, homepage and topics on GitHub, using the values in
# docs/launch/github-meta.md (keep both in sync). Needs `gh` signed in with admin rights.
#
#   bash scripts/apply-github-meta.sh                      # heweitianqing/skill-gallery
#   bash scripts/apply-github-meta.sh owner/repo
#   bash scripts/apply-github-meta.sh --with-pages         # also set Pages to build from GitHub Actions
#
# The social preview image cannot be set through the API; upload
# docs/launch/social-preview.png in Settings → General → Social preview.
set -euo pipefail

REPO="heweitianqing/skill-gallery"
WITH_PAGES=0
for arg in "$@"; do
  case "$arg" in
    --with-pages) WITH_PAGES=1 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    -*) echo "unknown option: $arg" >&2; exit 2 ;;
    *) REPO="$arg" ;;
  esac
done

DESCRIPTION='See what web-design agent skills actually do: the same prompts built by Claude Code and Codex, with and without each skill, side by side. 同一道题，用和不用 skill 的网页并排对比。'
HOMEPAGE='https://heweitianqing.github.io/skill-gallery/'
TOPICS=(
  agent-skills skill-md claude-code codex openai-codex coding-agents ai-agents llm
  frontend web-design ui-design design-systems comparison gallery
)

command -v gh >/dev/null || { echo "gh (GitHub CLI) is not installed" >&2; exit 1; }
gh repo view "$REPO" --json name >/dev/null

topic_args=()
for t in "${TOPICS[@]}"; do topic_args+=(--add-topic "$t"); done

gh repo edit "$REPO" --description "$DESCRIPTION" --homepage "$HOMEPAGE" "${topic_args[@]}"
echo "set description, homepage and ${#TOPICS[@]} topics on $REPO"

if [ "$WITH_PAGES" = 1 ]; then
  # Create the Pages site with GitHub Actions as the source, or switch an existing one.
  if gh api "repos/$REPO/pages" >/dev/null 2>&1; then
    gh api -X PUT "repos/$REPO/pages" -f build_type=workflow >/dev/null
  else
    gh api -X POST "repos/$REPO/pages" -f build_type=workflow >/dev/null
  fi
  echo "Pages source set to GitHub Actions"
fi

echo "Still by hand: upload docs/launch/social-preview.png (Settings → General → Social preview)."
