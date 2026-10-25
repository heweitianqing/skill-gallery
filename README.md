# skill-gallery

> Status: v0, work in progress. Nothing here is a final result yet.

**skill-gallery** shows what web pages built with different agent skills (the `SKILL.md` format) actually look like, how to install and use each skill in **Claude Code** and **OpenAI Codex**, and how the results compare with and without the skill.

[中文说明](#中文说明)

## The 2×2 matrix

Every prompt is run in four cells:

|                | native (no skill)   | + skill                  |
| -------------- | ------------------- | ------------------------ |
| **Codex CLI**  | `codex__native`     | `codex__<skill-name>`    |
| **Claude Code**| `claude__native`    | `claude__<skill-name>`   |

The two native cells depend only on the prompt, so every skill is compared against the same baselines.

Models under test (fixed in the run scripts):

| Agent       | Model             | Effort                     |
| ----------- | ----------------- | -------------------------- |
| Claude Code | `claude-opus-5-5` | `--effort high`            |
| Codex CLI   | `gpt-6.1-sol`     | `model_reasoning_effort=high` |

## Prompts (v0: web pages only)

| id               | file                                                     |
| ---------------- | -------------------------------------------------------- |
| `landing-saas`   | [prompts/landing-saas.md](prompts/landing-saas.md)       |
| `dashboard`      | [prompts/dashboard.md](prompts/dashboard.md)             |
| `blog-portfolio` | [prompts/blog-portfolio.md](prompts/blog-portfolio.md)   |

The prompts are written in neutral language with no style adjectives. All four cells get identical text; the skill cells only add one closing sentence that names the skill explicitly.

## Skills (v0)

| Skill | Source (pinned) | License |
| ----- | --------------- | ------- |
| [`frontend-design`](skills/frontend-design/meta.yaml) | `anthropics/skills@dbd4588` `skills/frontend-design` | Apache-2.0 |
| [`ui-ux-pro-max`](skills/ui-ux-pro-max/meta.yaml) | `ui-ux-pro-max-cli@2.15.0` (official installer; repo `nextlevelbuilder/ui-ux-pro-max-skill`) | MIT |
| [`web-design-engineer`](skills/web-design-engineer/meta.yaml) | `ConardLi/garden-skills@2b9a893` `skills/web-design-engineer` | MIT |

Skill files are not stored here; `scripts/fetch-skill.mjs` downloads them at the pinned version. Candidate research lives in [research/](research/).

## Fairness rules

A comparison is only useful if it is fair and reproducible:

1. **Isolated environments.** Every run gets a fresh temporary working directory outside this repo, a throwaway config home (`CLAUDE_CONFIG_DIR` / `CODEX_HOME`) and a throwaway `HOME`. None of the operator's plugins, user-level skills, settings, MCP servers or memories are visible. The init event of each run is saved as evidence.
2. **The skill must actually fire.** For skill cells, the transcript is checked for the skill being invoked and its `SKILL.md` being read. A run where the skill did not trigger is marked failed, not published as a skill result.
3. **No cherry-picking.** One generation per cell, no follow-up turns. Every attempt is kept in `runs/`, including failures.
4. **Full metadata.** Each run writes a `run.json` (CLI version, model, effort, prompt hash, skill source and commit, timing, token usage, isolation evidence). See [docs/run-schema.md](docs/run-schema.md).

## Repository layout

```
prompts/    the fixed prompts (one Markdown file per prompt)
skills/     vendored or referenced skills under test (each keeps its own license)
runs/       results: runs/<prompt>/<agent>__<native|skill>/{index.html,desktop.png,mobile.png,run.json,transcript.jsonl}
scripts/    run-claude.mjs, run-codex.mjs, screenshot.mjs, setup-claude-auth.sh
site/       the static gallery site (placeholder for now)
docs/       run.json schema and how to run things
```

## Running

See [docs/running.md](docs/running.md).

## License

The code and documentation written for this repository are released under the [MIT License](LICENSE). Third-party skills placed in or referenced from `skills/` keep their own licenses; check each skill's source. Pages in `runs/` are model outputs kept for comparison.

---

## 中文说明

**skill-gallery** 用来展示：不同的 agent skill（`SKILL.md` 格式）做出来的网页长什么样，在 Claude Code 和 Codex 里怎么安装、怎么使用，以及用和不用 skill 的效果对比。

- **2×2 矩阵**：每道题跑四格，Codex 原生、Codex + skill、Claude 原生、Claude + skill。两个原生格只跟题目有关，所有 skill 共用同一组基线。
- **被测模型**：Claude Code 用 `claude-opus-5-5`（effort high），Codex 用 `gpt-6.1-sol`（reasoning effort high），写死在运行脚本里。
- **v0 题目**：SaaS 落地页、数据看板、个人博客/作品集，都只做网页。题目措辞中立，四格完全相同；带 skill 的格子只在末尾多一句显式点名。
- **公平性**：每次运行用仓库外的全新临时目录和独立配置目录，看不到操作者的插件、用户级 skill、设置和记忆；带 skill 的运行必须从日志里证明 skill 真的被调用了，否则判失败；每格只生成一次、不追问、不挑图；每次运行都写 `run.json` 元数据。
- **怎么跑**：见 [docs/running.md](docs/running.md)。
- **许可**：本仓库自己的代码和文档用 MIT 许可；`skills/` 里的第三方 skill 保留各自的许可。
