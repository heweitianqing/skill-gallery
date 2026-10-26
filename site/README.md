# site/

The static gallery site. `scripts/build-site.mjs` builds it from `runs/`, `prompts/` and `skills/*/meta.yaml`. It needs Node 20+ and no packages.

```bash
node scripts/build-site.mjs                 # writes site/dist/
python3 -m http.server 8000 --directory site/dist
# open http://localhost:8000/
```

Use a local server rather than opening the files directly: links point at directories (`skills/<name>/`), which only resolve to `index.html` over HTTP. Options: `--out <dir>` writes elsewhere, `--runs <dir>` reads cells from another `runs/` tree (for testing). The build refuses to delete an output directory that is not empty and was not made by an earlier build.

`.github/workflows/pages.yml` runs the same build on every push to `main` that touches the inputs, every 6 hours (to refresh vote counts) and on demand, and publishes it with GitHub Pages (Settings → Pages → Source: GitHub Actions).

## Files

| Path | What it is |
| --- | --- |
| `config.json` | Site title, `site_url` (used for `hreflang` and canonical links), `repo_url`, `votes` (see [Votes](#votes)), `languages` (the first one is served at the root), prompt and skill order, agent labels with the configured model and effort |
| `i18n/<lang>.json` | Every interface string, plus skill summaries, notes, translated strengths and out-of-scope reasons (`skills.<name>`, see below), and prompt titles and summaries (`prompts.<id>`). The READMEs have their own strings in `scripts/build-readme.strings.json`. Strings are trusted HTML; `{placeholders}` are filled and escaped by the build; `_one`/`_other` keys are plural forms. A missing string falls back to English and the build lists it |
| `assets/site.css`, `assets/site.js` | Gallery styles and the small script for the theme toggle, desktop/mobile switch, lightbox and preview sizing. Pages work without the script |
| `dist/` | Build output, git-ignored |

## Pages

Each language gets its own page tree: English at the root, the others under `/zh-CN/`, `/zh-TW/`, `/ja/`, `/ko/`, `/es/`. Every page has `<html lang>`, `hreflang` alternates (plus `x-default`), a canonical link and a language menu that keeps you on the same page. Assets, run files and thumbnails are shared at the root. The prompt texts are shown in English in every language, because they are the exact input the agents received.

| Output (per language) | Content |
| --- | --- |
| `index.html` | Overview grid (prompt × skill, Codex and Claude Code thumbnails per square), skills, prompts, method |
| `skills/<name>/` | Claimed strengths and test scope (when `meta.yaml` has them), one 2×2 per prompt (Codex native, Codex + skill, Claude Code native, Claude Code + skill), then install and use for both agents |
| `prompts/<id>/` | Every skill side by side for one prompt, plus the prompt text |
| `cells/<prompt>/<agent>__<variant>/` | The original `index.html` in `<iframe sandbox="allow-scripts">` (no same-origin access) at fit, 1440 or 390 px, the vote (when enabled) and the full run details |
| `runs/…` | `index.html`, `desktop.png`, `mobile.png`, `run.json` copied byte for byte |
| `thumbs/…` | First-screen crops of the screenshots (720 and 360 px wide for desktop, 390 for mobile), made by a small PNG codec inside the build script |

A cell with no files shows **Pending** (待运行), unless the skill's `applies_to` leaves that prompt out: then it shows **Out of scope** (不适用) with the reason, and it does not count as missing. A run that exists outside the stated scope is still shown, with a note. An empty cell directory counts as still running. Failed runs are shown with their `failure_reasons`; a missing screenshot, page, `run.json` or field shows a placeholder or `—`. The build prints which fields the inputs do not provide yet.

## Fields the pages read

`run.json` (see `docs/run-schema.md`): `success`, `failure_reasons`, `model`, `effort`, `cli.version`, `started_at`, `duration_ms`, `usage.*_tokens`, `usage.num_turns`, `usage.total_cost_usd`, `skill_triggered`, `skill_evidence`, `skill.*` (including `fetch`), `prompt.skill_line`, `prompt.file_sha256` (compared with the current prompt file), `external_refs.refs`, `rule_violations`, `runtime_remote_images`, `attempt`, `previous_attempts`, `isolation.ok` and `isolation.checks`, `output`, `activity`, `screenshots.<desktop|mobile>` (viewport size is used for the thumbnail crop), `host`. If `external_refs` is absent, the build scans `index.html` itself.

`skills/<name>/meta.yaml`: `summary`, `research_id`, `upstream.repo|path|commit|skill_md`, `license.spdx|file|copyright`, `fetch.method|package|version|output_path`, `install.claude|codex` (a command is shown as is; a sentence is shown above generated `git clone` + `cp` commands), `invoke.claude|codex`, `notes`. Without `meta.yaml` the build falls back to `skills/<name>/source.json`, then to `research/candidates.json` (also the source of the Chinese summary).

Optional fields for strengths and test scope, read by the gallery (written by whoever maintains `meta.yaml`):

```yaml
# What the skill's own docs claim it is good at. Each item needs a pinned link to where it says so.
strengths:
  - text: Commits to a bold design direction instead of generic defaults
    source: https://github.com/<owner>/<repo>/blob/<commit>/<path>/SKILL.md#L12
  - text: Strong typography and layout for marketing pages
    source: https://github.com/<owner>/<repo>/blob/<commit>/README.md#features

# Prompt ids (file names in prompts/ without .md) the skill claims to cover.
# Leave it out to mean every prompt. Other prompts show "Out of scope" for this skill.
applies_to: [landing-saas, blog-portfolio]

# Optional: why the other prompts are out of scope (English). Without it a generic sentence is shown.
out_of_scope_reason: Its SKILL.md covers marketing pages and slides, not data dashboards.
```

Translations go in `site/i18n/<lang>.json`, under the skill, in the same order as `meta.yaml`. English falls back to `meta.yaml`; the build lists languages that miss some items.

```json
"skills": {
  "frontend-design": {
    "strengths": ["敢于选定鲜明的设计方向，而不是用通用默认样式", "落地页的字体和版式更讲究"],
    "out_of_scope_reason": "它的 SKILL.md 讲的是营销页和幻灯片，不是数据看板。"
  }
}
```

A prompt whose frontmatter has `showcase: true` (or `kind: showcase`) is labelled as a showcase prompt: one added to show a particular skill's claimed strength. Only the skills whose `applies_to` lists it are expected to run it, next to the two native cells.

## Votes

Each cell page can carry a 👍 vote through [giscus](https://giscus.app), backed by this repository's GitHub Discussions. It is off until every field of `votes` in `config.json` is set:

| Field | Value |
| --- | --- |
| `repo` | `heweitianqing/skill-gallery` |
| `repo_id` | `R_kgDOVXc5mA` |
| `category` | `Votes` (an Announcement-format category, so only giscus can open threads) |
| `category_id` | The category's id, shown by giscus.app after you pick the repository and category (starts with `DIC_`) |

- Each cell has one discussion, mapped with `data-mapping="specific"` and the term `cell:<prompt>/<agent>__<variant>`, so all six languages share the same thread and count. `data-strict="1"` makes giscus match the term exactly.
- giscus loads only on cell pages. site.js adds its script when the vote section comes within 300 px of the screen (at once on most desktop screens, after some scrolling on phones), with the page's language and theme.
- The skill and prompt pages show "👍 N · Vote" on each card. The counts are read at build time through the GraphQL API (THUMBS_UP reactions on discussions in the category) when `GITHUB_TOKEN` is set. The Pages workflow passes its token with `discussions: read`, and nothing is written back. Without a token the cards show only the link.

Environment variables for the build:

| Variable | Effect |
| --- | --- |
| `GITHUB_TOKEN` | Read 👍 counts from GitHub (set by the Pages workflow) |
| `SG_VOTES_CATEGORY_ID` | Overrides `votes.category_id`, to try the vote UI locally |
| `SG_VOTES_FILE` | A JSON file `{"cell:landing-saas/codex__native": 3, …}` used instead of GitHub, to check how counts look |
| `SG_PROMPTS_DIR`, `SG_SKILLS_DIR` | Read prompts or skill metadata from other folders (testing) |

Local check without a token:

```bash
echo '{"cell:landing-saas/codex__native": 4, "cell:landing-saas/claude__native": 7}' > /tmp/votes.json
SG_VOTES_CATEGORY_ID=DIC_example SG_VOTES_FILE=/tmp/votes.json node scripts/build-site.mjs --out /tmp/sg-votes
python3 -m http.server 8000 --directory /tmp/sg-votes
```

The giscus widget itself only works with the real category id and the giscus app installed on the repository.
