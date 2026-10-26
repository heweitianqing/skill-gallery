**English** · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md)

# skill-gallery

See what web-design agent skills actually do: the same prompts, built by Claude Code and Codex, with and without each skill, side by side.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Gallery](https://img.shields.io/badge/gallery-online-555.svg)](https://heweitianqing.github.io/skill-gallery/)

[![Overview of the results grid](docs/launch/overview.png)](https://heweitianqing.github.io/skill-gallery/)

<!-- status:start -->
> **Status: v0.** All 24 cells have run (2026-10-25 – 2026-10-26, UTC).
<!-- status:end -->

## Why

There are many agent skills (the `SKILL.md` format) that promise better-looking front-end work. It is hard to tell what they actually change. Their READMEs show hand-picked examples, and it is often unclear how to install and call the same skill in Claude Code and in Codex. This repository runs every skill on the same prompts, under the same conditions, shows every result, and writes down the exact install and invocation steps for both agents.

## How the comparison works

Every prompt runs in four cells:

|  | Native (no added skill) | + skill |
| --- | --- | --- |
| **Codex** | `codex__native` | `codex__<skill>` |
| **Claude Code** | `claude__native` | `claude__<skill>` |

The two native cells depend only on the prompt, so every skill is compared against the same two baselines.

| Agent | Model | Effort |
| --- | --- | --- |
| Codex CLI | `gpt-6.1-sol` | `model_reasoning_effort=high` |
| Claude Code | `claude-opus-5-5` | `--effort high` |

Three prompts, web pages only. They use neutral wording with no style adjectives, and all four cells get identical text; skill cells only add one closing sentence that names the skill.

| Prompt | What it asks for |
| --- | --- |
| [`landing-saas`](prompts/landing-saas.md) | A marketing page for a fictional on-call scheduling tool, with pricing toggle and FAQ |
| [`dashboard`](prompts/dashboard.md) | A sales and operations dashboard for a fictional coffee roaster, from fixed data |
| [`blog-portfolio`](prompts/blog-portfolio.md) | A one-page portfolio and blog for a fictional product designer |

## Results

<!-- results:start -->
Each square shows the top of the page at desktop width: Codex on top, Claude Code below. Click a thumbnail to open that result in the gallery.

<table>
<thead><tr><th>Prompt</th><th>Native (no added skill)</th><th><a href="https://heweitianqing.github.io/skill-gallery/skills/frontend-design/">frontend-design</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/skills/ui-ux-pro-max/">ui-ux-pro-max</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/skills/web-design-engineer/">web-design-engineer</a></th></tr></thead>
<tbody>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/prompts/landing-saas/">SaaS landing page</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__native/"><img src="docs/launch/assets/thumbs/landing-saas/codex__native.png" width="160" alt="Codex · native, SaaS landing page"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__native/"><img src="docs/launch/assets/thumbs/landing-saas/claude__native.png" width="160" alt="Claude Code · native, SaaS landing page"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/codex__frontend-design.png" width="160" alt="Codex · + frontend-design, SaaS landing page"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design, SaaS landing page"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max, SaaS landing page"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max, SaaS landing page"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer, SaaS landing page"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer, SaaS landing page"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/prompts/dashboard/">Data dashboard</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__native/"><img src="docs/launch/assets/thumbs/dashboard/codex__native.png" width="160" alt="Codex · native, Data dashboard"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__native/"><img src="docs/launch/assets/thumbs/dashboard/claude__native.png" width="160" alt="Claude Code · native, Data dashboard"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/codex__frontend-design.png" width="160" alt="Codex · + frontend-design, Data dashboard"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design, Data dashboard"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max, Data dashboard"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max, Data dashboard"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer, Data dashboard"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer, Data dashboard"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/prompts/blog-portfolio/">Personal blog and portfolio</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__native.png" width="160" alt="Codex · native, Personal blog and portfolio"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__native.png" width="160" alt="Claude Code · native, Personal blog and portfolio"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__frontend-design.png" width="160" alt="Codex · + frontend-design, Personal blog and portfolio"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design, Personal blog and portfolio"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max, Personal blog and portfolio"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max, Personal blog and portfolio"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer, Personal blog and portfolio"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer, Personal blog and portfolio"></a><br><sub>Claude Code</sub></td></tr>
</tbody>
</table>
<!-- results:end -->

## Skills: install and use

The short version for each agent. Every skill page in the gallery has the full commands and notes.

<!-- skills:start -->
| Skill | Claude Code | Codex |
| --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/skills/frontend-design/#install) | Copy the folder to `.claude/skills/frontend-design/`, then end the prompt with `Use the frontend-design skill.` (or type `/frontend-design …`) | Copy the folder to `.agents/skills/frontend-design/`, then mention `$frontend-design` in the prompt |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/skills/ui-ux-pro-max/#install) | Run `npx ui-ux-pro-max-cli@2.15.0 init --ai claude`, then end the prompt with `Use the ui-ux-pro-max skill.` (or type `/ui-ux-pro-max …`) | Run `npx ui-ux-pro-max-cli@2.15.0 init --ai codex`, then mention `$ui-ux-pro-max` in the prompt |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/skills/web-design-engineer/#install) | Copy the folder to `.claude/skills/web-design-engineer/`, then end the prompt with `Use the web-design-engineer skill.` (or type `/web-design-engineer …`) | Copy the folder to `.agents/skills/web-design-engineer/`, then mention `$web-design-engineer` in the prompt |
<!-- skills:end -->

## Method and limitations

- **Isolation.** Every run starts in a fresh throwaway directory outside the repository, with an empty `HOME`, its own config home (`CLAUDE_CONFIG_DIR` or `CODEX_HOME`) and an environment built from scratch. None of the operator's settings, plugins, user-level skills, MCP servers or memories are loaded. The skill is copied only into that project's skill folder. The agents' own logs are kept as evidence in each `run.json`.
- **The skill has to fire.** A skill cell counts only if its logs show the skill being loaded (`skill_triggered`). Otherwise it is marked failed. See [docs/canary.md](docs/canary.md) for the canary test behind this check.
- **One sample per cell, no picking.** Each cell is generated once, with no follow-up turns. Every result is published, failures included; reruns keep the earlier attempt.
- **Native means out of the box, not zero skills.** Every cell, native ones included, can use the skills that ship with its agent: the 19 skills bundled with Claude Code, and Codex's system skills (`imagegen`, `openai-docs`, `skill-creator`, `skill-installer`). In the `dashboard` prompt, Claude Code's bundled `dataviz` skill fired on its own twice, once in `claude__native` and once in `claude__frontend-design`; `run.json` records this under `builtin_skills_used`. This is on purpose: the comparison is about what a reader actually gets after installing the agent.
- **Limitation: the rest of the disk is still readable.** Isolation means nothing is *loaded*, not that nothing is *readable*. Codex's stock `workspace-write` sandbox can read `/`, and Claude Code with `bypassPermissions` has no sandbox. In the v0 runs, agents looked for `AGENTS.md` in parent directories, and one used Playwright from the operator's npm cache to test its page. A separate user account or a container would close this gap.
- **Limitation: fixed sidebars in screenshots.** Full-page captures draw `position: fixed` or `sticky` elements sized `100vh` at the first screen's height only, so a dashboard sidebar can appear to stop at 900 px. The page itself is fine; open it in the gallery to check.
- **Limitation: one sample is not a benchmark.** Read the gallery as examples of what a skill tends to do, not as a score.

Details: [docs/running.md](docs/running.md) and [docs/run-schema.md](docs/run-schema.md).

## Reproduce

Requirements: macOS or Linux, Node 20+, git, the Codex CLI and the Claude Code CLI, and a login for each.

```bash
git clone https://github.com/heweitianqing/skill-gallery.git
cd skill-gallery
npm install
npx playwright install --no-shell chromium
codex login
bash scripts/setup-claude-auth.sh        # long-lived token for the isolated Claude runs

node scripts/fetch-skill.mjs --all       # skills at their pinned versions, into .cache/skills/
node scripts/run-codex.mjs landing-saas native
node scripts/run-codex.mjs landing-saas frontend-design
node scripts/run-claude.mjs landing-saas frontend-design
node scripts/screenshot.mjs              # desktop.png and mobile.png for new cells

node scripts/build-site.mjs              # gallery in site/dist/
node scripts/build-readme.mjs            # refresh the tables in every README
```

To preview the gallery: `python3 -m http.server 8000 --directory site/dist`, then open <http://localhost:8000/>.

## Add a skill

Suggest one with the [skill suggestion form](https://github.com/heweitianqing/skill-gallery/issues/new?template=skill-suggestion.yml), or add it yourself:

1. Create `skills/<name>/meta.yaml` with the pinned source (repository, commit, path), license, and how to install and invoke it in each agent. Copy an existing one as a template.
2. Run `node scripts/fetch-skill.mjs <name>`, then the six skill cells (three prompts × two agents) and `node scripts/screenshot.mjs`.
3. Add the skill's name to `site/config.json` and run `node scripts/build-readme.mjs`.
4. Open a pull request with the new `runs/` cells. Do not rerun cells to get a nicer result.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the details.

## Credits

The skills belong to their authors and keep their own licenses. This repository does not include their files; they are fetched at the pinned commit or version.

<!-- credits:start -->
| Skill | Source | License | Pinned commit |
| --- | --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/skills/frontend-design/) | [anthropics/skills](https://github.com/anthropics/skills) `skills/frontend-design` | [Apache-2.0](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt) | [`dbd4588f9e`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design) |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/skills/ui-ux-pro-max/) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) `.claude/skills/ui-ux-pro-max`<br><sub>Copyright (c) 2024 Next Level Builder</sub> | [MIT](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/LICENSE) | `ui-ux-pro-max-cli@2.15.0` (CLI-generated)<br><sub>[`d14efff8ed`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d14efff8ed1faa4187f004f79926f428c8074ec7/.claude/skills/ui-ux-pro-max)</sub> |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/skills/web-design-engineer/) | [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) `skills/web-design-engineer`<br><sub>Copyright (c) 2026 (no name given; attribute to ConardLi/garden-skills)</sub> | [MIT](https://github.com/ConardLi/garden-skills/blob/2b9a89340b70f632d31c0f1c69fce94a7912423e/LICENSE) | [`2b9a89340b`](https://github.com/ConardLi/garden-skills/tree/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer) |
<!-- credits:end -->

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Anthropic or OpenAI. Claude, Claude Code, Codex and other names are trademarks of their respective owners. The pages in `runs/` are unedited model outputs, and the fictional companies and people in them are made up.

The translations of this README were made with AI. Corrections are welcome as pull requests.

The code and documentation in this repository are released under the [MIT License](LICENSE).
