# `run.json` schema (version 1)

Every cell directory `runs/<prompt>/<agent>__<variant>/` has a `run.json` written by `scripts/run-claude.mjs` or `scripts/run-codex.mjs`. `scripts/screenshot.mjs` later fills in `screenshots`.

Paths are sanitized before they are written: the throwaway run directory becomes `$RUN`, the operator's home directory becomes `~`, and the user name becomes `$USER`. Credentials are never recorded; auth variables appear as `<redacted>`.

## Fields

| Field | Type | Meaning |
| --- | --- | --- |
| `schema_version` | int | `1` |
| `agent` | `"claude"` \| `"codex"` | Which CLI ran |
| `cli.name` | string | `claude-code` or `codex-cli` |
| `cli.version` | string | CLI version reported by the binary (Claude: from the init event) |
| `cli.path` | string | Binary that was run |
| `model` | string | `claude-opus-5-5` or `gpt-6.1-sol`, fixed in the scripts |
| `effort` | string | `high` (Claude `--effort`, Codex `model_reasoning_effort`) |
| `prompt.id` | string | Prompt id, e.g. `landing-saas` |
| `prompt.file` | string | Prompt file, relative to the repo |
| `prompt.version` | string \| null | `version` from the prompt's frontmatter |
| `prompt.file_sha256` | string | SHA-256 of the prompt file bytes |
| `prompt.text_sha256` | string | SHA-256 of the exact text sent to the agent (frontmatter stripped, skill line appended) |
| `prompt.skill_line` | string \| null | The one sentence appended for skill cells, e.g. `Use the foo skill.` (Claude) or `Use the $foo skill.` (Codex) |
| `variant` | string | `native` or the skill name |
| `skill` | object \| null | `null` for native cells, otherwise see below |
| `skill.name` | string | Skill name (folder name under the project skill directory) |
| `skill.source_url` | string \| null | Where the skill came from: the upstream git repo, `npm:<package>@<version>` for CLI-generated skills, a git remote of a local checkout, or `SKILL_SOURCE_URL` |
| `skill.source_commit` | string \| null | Pinned upstream commit (`null` for CLI-generated skills; see `skill.fetch`) |
| `skill.source_path` | string \| null | Path of the skill folder inside its source (repo path, or the folder the CLI generated) |
| `skill.source_dirty` | bool \| null | Whether the skill folder had uncommitted changes (`false` for cached fetches, which are hash-checked) |
| `skill.fetch` | object \| absent | Present when the skill came from `scripts/fetch-skill.mjs`: `method` (`git` or `npm-cli`), `cli` (`package`, `version`, `command`) for CLI-generated skills, `upstream_repo` and `upstream_commit_reference`, `fetched_at` |
| `skill.license_spdx` | string \| absent | License of the skill, from `skills/<name>/meta.yaml` |
| `skill.tree_sha256` | string | Hash of the skill folder contents as installed (sorted paths + file hashes) |
| `skill.installed_to` | string | Project-level location inside the throwaway work dir (`.claude/skills/<name>` or `.agents/skills/<name>`) |
| `attempt` | int | 1 for the first attempt of this cell; earlier attempts live in `runs/<prompt>/_attempts/` |
| `previous_attempts` | array | One entry per earlier attempt of this cell: `attempt`, `started_at`, `success`, `failure_reasons`, `skill_triggered`, `archived_to` (relative to `runs/<prompt>/`). Empty for a first attempt |
| `started_at`, `finished_at` | ISO 8601 | Wall-clock start and end (UTC) |
| `duration_ms` | int | Wall-clock duration of the CLI process |
| `exit_code` | int \| null | CLI exit code |
| `timed_out` | bool | Killed by the runner's timeout (`SG_TIMEOUT_MIN`, default 60) |
| `usage` | object \| null | Token usage as reported by the CLI. Claude: `input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`, `total_cost_usd`, `num_turns`, `model_usage`. Codex: `input_tokens`, `cached_input_tokens`, `output_tokens`, `reasoning_output_tokens` (summed over turns), `total_cost_usd` is always `null` |
| `activity` | object | Counts of tool calls (Claude, by tool name) or completed items (Codex, by item type) |
| `success` | bool | `true` only if every check passed (see below) |
| `failure_reasons` | string[] | Why `success` is false |
| `skill_triggered` | bool \| null | `null` for native cells. For skill cells: whether the log proves the skill was used |
| `skill_evidence` | object \| null | The log entries behind `skill_triggered` (see below) |
| `builtin_skills_used` | array \| null | Claude only: `Skill` tool calls for skills other than the one under test (for example skills bundled with the CLI). Codex: `null` |
| `isolation` | object | Isolation method and evidence (see below) |
| `output.index_html` | bool | Whether `index.html` was produced |
| `output.index_html_bytes`, `output.index_html_sha256` | int, string | Size and hash of `index.html` |
| `output.other_files` | array | Any other files the agent left in the work dir (not copied) |
| `external_refs` | object \| null | Static scan of `index.html` for references to other origins (see below). `null` if there is no `index.html` |
| `rule_violations` | string[] | Prompt rules the page breaks. Currently only `remote_image` (from the static scan, or from images requested at runtime during screenshots). A violation does not make the run fail; the result is kept and flagged |
| `runtime_remote_images` | string[] \| absent | Added by `scripts/screenshot.mjs`: image URLs the page requested over http(s) while being captured |
| `host` | object | `os`, `arch`, `node` of the machine that ran the cell |
| `stderr_tail` | string | Last lines of the CLI's stderr |
| `screenshots` | object \| null | Filled by `scripts/screenshot.mjs` (see below) |

### `success`

A run succeeds only if all of these hold:

- the CLI exited 0 without timing out, and its final result/turn event is not an error;
- `index.html` exists in the work dir;
- every `isolation.checks` entry is `true`;
- for skill cells, `skill_triggered` is `true` (and for Codex the skill also appears in the skills list the agent was given).

Failed runs are kept, not deleted.

### `skill_evidence`

Claude:

- `skill_tool_calls`: `Skill` tool calls whose `skill` input is the skill under test, with `ok` (the tool result was not an error) and the start of the result text.
- `skill_content_loaded`: user-side messages that carry the loaded skill (`Base directory for this skill: …/skills/<name>`), when the stream shows them.
- `skill_md_reads`: `Read`/`Bash` calls that touched `<name>/SKILL.md` directly.
- `skill_triggered` is `true` if a `Skill` call for this skill succeeded or the agent read its `SKILL.md`.

Codex:

- `injected`: `<skill>` blocks with `<name>` equal to the skill under test that Codex injected into the conversation after the explicit `$name` mention. They carry the contents of `SKILL.md`.
- `skill_md_reads`: tool calls or shell commands that read `<name>/SKILL.md`.
- `skill_triggered` is `true` if either list is non-empty.

### `isolation`

| Field | Meaning |
| --- | --- |
| `ok` | All `checks` passed |
| `checks` | Named boolean checks (below) |
| `method` | Plain-language list of what the runner did to isolate the run |
| `command` | Full command line (the prompt is shown as `"$(cat prompt.txt)"`) |
| `cwd` | Working directory (`$RUN/work`) |
| `env` | The complete environment passed to the CLI (secrets redacted) |
| `observed` | What the agent actually saw, taken from its own logs |

Claude `checks` (from the `system/init` event of `--output-format stream-json`): `init_event_present`, `only_builtin_plugins`, `no_mcp_servers`, `no_plugin_skills` (no `plugin:skill` names), `config_dir_was_empty`, `home_was_empty`, `auto_memory_disabled`, and for skill cells `skill_listed`. `observed` holds the init event's `tools`, `mcp_servers`, `skills`, `plugins`, `agents`, `slash_commands`, `model`, `permission_mode`, `api_key_source`, `output_style`, `cwd`.

Codex `checks` (from the session rollout Codex writes into the throwaway `CODEX_HOME`; the rollout itself is not committed because it carries account ids): `no_agents_md`, `no_plugins`, `no_apps`, `no_mcp_tools`, `no_managed_instructions`, `only_expected_skills` (only the bundled `.system` skills plus the skill under test), `no_memory_sections`, `codex_home_was_minimal` (only `auth.json` and `config.toml` before the run). `observed` holds the model-visible tool list, the skills list and skill roots, the AGENTS.md / plugins / apps instruction state, and the developer-message sections. Codex runs also record `config_toml`, `codex_home_before_run`, and `auth_link_after_run` (whether the `auth.json` symlink survived the run).

### `external_refs`

`count`, `counts` (by kind), `hosts`, `refs` (each `{url, context, kind}`), `remote_images`, `violations`.

- `context` says where the URL appeared: `link[rel=stylesheet]`, `link[rel=preconnect]`, `script[src]`, `img[src]`, `img[srcset]`, `css url()`, `css @import`, or `other` (a URL in script or style text, such as a dynamic import).
- `kind` is one of `font` (Google Fonts and other font hosts, font files), `stylesheet`, `script`, `image`, `preconnect`, `other`.
- `<a href>` links and XML namespace URIs (`www.w3.org`) are not counted.

### `screenshots`

`tool`, `browser` (name and version, e.g. `playwright-chromium 156.0.8078.4`), `browser_channel`, `taken_at`, and one object per viewport (`desktop`, `mobile`) with: `file`, `viewport`, `device_scale_factor`, `is_mobile`, `page_height`, `horizontal_overflow`, `scroll_width`, `network_idle`, `fonts_loaded`, `fonts_failed`, `console_errors`, `page_errors`, `failed_requests`, `remote_requests` (every http(s) request the page made, with Playwright's resource type).

## Other files in a cell directory

| File | Content |
| --- | --- |
| `index.html` | The page the agent wrote, unmodified |
| `transcript.jsonl` | The CLI's JSON event stream (Claude `stream-json`, Codex `exec --json`), sanitized, with strings longer than 4,000 characters cut |
| `desktop.png`, `mobile.png` | Full-page screenshots at 1440 and 390 CSS px wide |
| `run.json` | This record |
