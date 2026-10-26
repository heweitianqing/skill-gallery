# site/

The static gallery site. `scripts/build-site.mjs` builds it from `runs/`, `prompts/` and `skills/*/meta.yaml`. It needs Node 20+ and no packages.

```bash
node scripts/build-site.mjs                 # writes site/dist/
python3 -m http.server 8000 --directory site/dist
# open http://localhost:8000/
```

Use a local server rather than opening the files directly: links point at directories (`skills/<name>/`), which only resolve to `index.html` over HTTP. Options: `--out <dir>` writes elsewhere, `--runs <dir>` reads cells from another `runs/` tree (for testing). The build refuses to delete an output directory that is not empty and was not made by an earlier build.

`.github/workflows/pages.yml` runs the same build on every push to `main` that touches the inputs and publishes it with GitHub Pages (Settings → Pages → Source: GitHub Actions).

## Files

| Path | What it is |
| --- | --- |
| `config.json` | Site title, `site_url` (used for `hreflang` and canonical links), `repo_url`, `languages` (the first one is served at the root), prompt and skill order, agent labels with the configured model and effort |
| `i18n/<lang>.json` | Every interface string, plus skill summaries and notes (`skills.<name>`), and prompt titles and summaries (`prompts.<id>`). The READMEs have their own strings in `scripts/build-readme.strings.json`. Strings are trusted HTML; `{placeholders}` are filled and escaped by the build; `_one`/`_other` keys are plural forms. A missing string falls back to English and the build lists it |
| `assets/site.css`, `assets/site.js` | Gallery styles and the small script for the theme toggle, desktop/mobile switch, lightbox and preview sizing. Pages work without the script |
| `dist/` | Build output, git-ignored |

## Pages

Each language gets its own page tree: English at the root, the others under `/zh-CN/`, `/zh-TW/`, `/ja/`, `/ko/`, `/es/`. Every page has `<html lang>`, `hreflang` alternates (plus `x-default`), a canonical link and a language menu that keeps you on the same page. Assets, run files and thumbnails are shared at the root. The prompt texts are shown in English in every language, because they are the exact input the agents received.

| Output (per language) | Content |
| --- | --- |
| `index.html` | Overview grid (prompt × skill, Codex and Claude Code thumbnails per square), skills, prompts, method |
| `skills/<name>/` | One 2×2 per prompt (Codex native, Codex + skill, Claude Code native, Claude Code + skill), then install and use for both agents |
| `prompts/<id>/` | Every skill side by side for one prompt, plus the prompt text |
| `cells/<prompt>/<agent>__<variant>/` | The original `index.html` in `<iframe sandbox="allow-scripts">` (no same-origin access) at fit, 1440 or 390 px, and the full run details |
| `runs/…` | `index.html`, `desktop.png`, `mobile.png`, `run.json` copied byte for byte |
| `thumbs/…` | First-screen crops of the screenshots (720 and 360 px wide for desktop, 390 for mobile), made by a small PNG codec inside the build script |

A cell with no files shows **Pending · 待运行**. An empty cell directory counts as still running. Failed runs are shown with their `failure_reasons`; a missing screenshot, page, `run.json` or field shows a placeholder or `—`. The build prints which fields the inputs do not provide yet.

## Fields the pages read

`run.json` (see `docs/run-schema.md`): `success`, `failure_reasons`, `model`, `effort`, `cli.version`, `started_at`, `duration_ms`, `usage.*_tokens`, `usage.num_turns`, `usage.total_cost_usd`, `skill_triggered`, `skill_evidence`, `skill.*` (including `fetch`), `prompt.skill_line`, `prompt.file_sha256` (compared with the current prompt file), `external_refs.refs`, `rule_violations`, `runtime_remote_images`, `attempt`, `previous_attempts`, `isolation.ok` and `isolation.checks`, `output`, `activity`, `screenshots.<desktop|mobile>` (viewport size is used for the thumbnail crop), `host`. If `external_refs` is absent, the build scans `index.html` itself.

`skills/<name>/meta.yaml`: `summary`, `research_id`, `upstream.repo|path|commit|skill_md`, `license.spdx|file|copyright`, `fetch.method|package|version|output_path`, `install.claude|codex` (a command is shown as is; a sentence is shown above generated `git clone` + `cp` commands), `invoke.claude|codex`, `notes`. Without `meta.yaml` the build falls back to `skills/<name>/source.json`, then to `research/candidates.json` (also the source of the Chinese summary).
