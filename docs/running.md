# Running the matrix

Everything runs from the repo root on macOS (the scripts also work on Linux, apart from finding the Claude desktop app's bundled CLI). Requirements: Node 20+, git, the two CLIs, and a login for each.

## One-time setup

```bash
npm install                          # installs Playwright (dev dependency)
npx playwright install --no-shell chromium   # browser used for screenshots
npm install -g @openai/codex         # Codex CLI (or: brew install --cask codex)
```

**Claude Code CLI.** The runner uses `$CLAUDE_BIN` if set, then `claude` on `PATH`, then the newest copy bundled with the Claude desktop app (`~/Library/Application Support/Claude/claude-code/<version>/…/claude`).

**Claude credentials.** Every Claude run uses a brand-new, empty `CLAUDE_CONFIG_DIR`, so it cannot reuse the login of your normal Claude Code setup. Create a long-lived token once:

```bash
bash scripts/setup-claude-auth.sh
```

This runs `claude setup-token` (browser sign-in) and stores the token in `~/.config/skill-gallery/claude-oauth-token` (mode 600, outside the repo). Instead of the file you can export `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY`.

**Codex credentials.** Log in once with `codex login` (your normal `~/.codex/auth.json`). Each run gets a throwaway `CODEX_HOME` that contains only a symlink to that `auth.json` plus a minimal `config.toml`, so token refreshes still land in your real file. Set `SG_CODEX_AUTH_HOME` to read `auth.json` from somewhere else.

## Skills

Skill files are not stored in the repo. Each skill has `skills/<name>/meta.yaml` with its pinned source, license and how to install and invoke it in both CLIs. Fetch them into the git-ignored cache `.cache/skills/`:

```bash
node scripts/fetch-skill.mjs --all                      # all skills (per-agent variants too)
node scripts/fetch-skill.mjs frontend-design            # prints the cached skill folder
node scripts/fetch-skill.mjs ui-ux-pro-max --agent codex
```

- `fetch.method: git` does a shallow, sparse fetch of the pinned commit and copies the skill folder.
- `fetch.method: npm-cli` runs the skill's own installer with an exact version through `npx` in an empty temp directory (nothing is installed globally) and keeps only the generated skill folder. It is generated per agent (`--agent claude|codex`).
- Each cached folder has a `source.json` (source, commit or CLI version, tree hash). The runners copy it into `run.json` and refuse to run if the cached files were changed after fetching.

## Running one cell

```bash
node scripts/run-claude.mjs <prompt-id> native
node scripts/run-claude.mjs <prompt-id> <skill-name> [<path/to/skill-folder>]
node scripts/run-codex.mjs  <prompt-id> native
node scripts/run-codex.mjs  <prompt-id> <skill-name> [<path/to/skill-folder>]
```

- `<prompt-id>` is a file name in `prompts/` without `.md`: `landing-saas`, `dashboard`, `blog-portfolio`.
- Without a folder, the skill comes from `skills/<skill-name>/meta.yaml` through the fetch cache (fetched on first use).
- With a folder (the one that contains `SKILL.md`), that folder is used as is. If it is inside a git checkout, the remote URL, commit and sub-path are recorded automatically; otherwise set `SKILL_SOURCE_URL` and `SKILL_SOURCE_COMMIT`.
- Results go to `runs/<prompt-id>/<agent>__<native|skill-name>/` (`index.html`, `transcript.jsonl`, `run.json`). If that folder already exists, it is moved to `runs/<prompt-id>/_attempts/` first, so earlier attempts stay on record.
- Exit code: 0 if the run succeeded (see `success` in [run-schema.md](run-schema.md)), 1 if it ran but failed a check, 2 for usage errors.

Options (environment variables):

| Variable | Default | Effect |
| --- | --- | --- |
| `SG_TIMEOUT_MIN` | `60` | Kill the CLI after this many minutes |
| `SG_KEEP_TMP` | unset | `1` keeps the throwaway run directory (raw event stream, Codex rollout) for debugging |
| `SKILL_GALLERY_TMP` | `$TMPDIR` | Parent of the throwaway run directories (`<it>/skill-gallery/…`) |
| `SKILL_GALLERY_CONFIG_DIR` | `~/.config/skill-gallery` | Where the Claude token file lives |
| `CLAUDE_BIN`, `CODEX_BIN` | auto | Override the CLI binaries |

Then take the screenshots:

```bash
node scripts/screenshot.mjs                    # every cell that is missing desktop.png / mobile.png
node scripts/screenshot.mjs --force            # redo all
node scripts/screenshot.mjs runs/landing-saas/codex__native
```

Screenshots are full-page PNGs at 1440×900 (desktop) and 390×844 (mobile, touch) CSS px, device scale factor 1, taken with Playwright's full Chromium build in new headless mode. Before capturing, the script waits for network idle and `document.fonts.ready`, scrolls through the page once so scroll-triggered content renders, waits again, and captures with CSS animations disabled (finite animations jump to their end state). Console errors, page errors, failed requests, loaded fonts and horizontal overflow are written into `run.json`.

## What the runners do

Both runners:

1. Build the prompt text: the prompt file without its frontmatter, plus, for skill cells only, one closing sentence (`Use the <name> skill.` for Claude, `Use the $<name> skill.` for Codex, which is Codex's explicit skill mention syntax).
2. Create a throwaway directory `$TMPDIR/skill-gallery/<agent>__<variant>__<prompt>__XXXXXX/` with `work/` (the agent's cwd), `home/` (an empty `HOME`) and `tmp/`.
3. Copy the skill, if any, into the work dir's project-level skill folder only (`work/.claude/skills/<name>/` or `work/.agents/skills/<name>/`).
4. Start the CLI with an environment built from scratch (`HOME`, `USER`, `LOGNAME`, `PATH`, `LANG`, `TERM`, `TMPDIR`, plus the variables below). Nothing else from your shell is passed on.
5. Save the JSON event stream, check isolation and skill use from the agent's own logs, copy `index.html`, write `run.json`, and delete the throwaway directory.

### Claude command

```bash
claude -p "$(cat prompt.txt)" \
  --model claude-opus-5-5 --effort high \
  --output-format stream-json --verbose \
  --setting-sources project \
  --strict-mcp-config --mcp-config '{"mcpServers":{}}' \
  --permission-mode bypassPermissions \
  --no-session-persistence
```

with `CLAUDE_CONFIG_DIR=$RUN/claude-config` (empty), `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`, `DISABLE_AUTOUPDATER=1` and `CLAUDE_CODE_OAUTH_TOKEN` (or `ANTHROPIC_API_KEY`).

- The empty config dir and empty `HOME` mean no user settings, installed plugins, user skills, user `CLAUDE.md`, or memories exist for the CLI to find. `--setting-sources project` additionally limits settings to the work dir (needed so the project-level skill folder is read). `--strict-mcp-config` with an empty list rules out MCP servers.
- The `system/init` event lists the tools, skills, plugins and MCP servers the session actually had; it is stored in `run.json` as evidence. The CLI's own bundled skills and `@builtin` plugins still show up there. They are part of the stock CLI, so they count as "native". If the model calls one of them, it is listed in `builtin_skills_used`.

### Codex command

```bash
codex exec --json --skip-git-repo-check --strict-config \
  -m gpt-6.1-sol -c 'model_reasoning_effort="high"' \
  -s workspace-write -C "$RUN/work" -o "$RUN/last-message.txt" \
  "$(cat prompt.txt)"
```

with `CODEX_HOME=$RUN/codex-home`, which holds only `auth.json` (symlink) and this `config.toml`:

```toml
model = "gpt-6.1-sol"
model_reasoning_effort = "high"
cli_auth_credentials_store = "file"
approval_policy = "never"
sandbox_mode = "workspace-write"
check_for_update_on_startup = false

[features]
apps = false
remote_plugin = false
plugins = false
memories = false
tool_suggest = false
```

- The model is passed explicitly with `-m` because your own default model may be different.
- `apps`, `remote_plugin` and `tool_suggest` would pull in ChatGPT-account connectors and plugins; `plugins` and `memories` are off so nothing from a plugin cache or memory store can appear. Codex still installs its bundled system skills (`imagegen`, `openai-docs`, `skill-creator`, `skill-installer`) into the throwaway `CODEX_HOME/skills/.system`. Like Claude's bundled skills, they count as "native".
- Evidence comes from the session rollout Codex writes to `$RUN/codex-home/sessions/`: its `world_state` and `additional_tools` entries show the AGENTS.md state, plugin/app instructions, the skills list and the tool list the model was given.

## Known differences between the two agents

These are properties of the stock CLIs, kept as they are:

- Codex runs shell commands in its `workspace-write` sandbox (writes only in the work dir, no network). Claude runs with `bypassPermissions` and no sandbox: it can use the network, and it has `WebSearch`/`WebFetch` tools that this Codex configuration does not have. Both run in a throwaway directory with an empty `HOME`.
- Codex ships no cost figure in its event stream, so `usage.total_cost_usd` is `null` for Codex.

## Running the whole Codex matrix

Cells are independent, so two or three can run at once (drop to one at a time if the API starts rate-limiting):

```bash
for p in landing-saas dashboard blog-portfolio; do
  for v in native frontend-design ui-ux-pro-max web-design-engineer; do
    echo "$p $v"
  done
done | xargs -P 3 -n 2 node scripts/run-codex.mjs
node scripts/screenshot.mjs
```

Run each cell once. Re-run a cell only if it produced no `index.html` or the skill did not trigger; the re-run keeps the earlier attempt under `_attempts/` and lists it in `previous_attempts`.

## Skill trigger canary

See [canary.md](canary.md) for the test that showed `$name` triggers skills under `codex exec`, and for how `skill_triggered` is decided.

## Checking a result

```bash
jq '{success, failure_reasons, skill_triggered, isolation: .isolation.checks}' runs/landing-saas/claude__native/run.json
```
