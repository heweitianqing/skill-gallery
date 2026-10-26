<!-- Release body for tag v0.1.0. Counts checked against runs/ on 2026-10-26: 24 of 24 cells,
     all with success: true. If cells are added, recheck with `node scripts/build-site.mjs`. -->

**English** · [简体中文](#简体中文)

# skill-gallery v0.1.0

The first public version: three web-design agent skills, each run on the same three prompts in Claude Code and in Codex, next to the same prompts without any skill.

**Gallery:** https://heweitianqing.github.io/skill-gallery/

## What is in it

- **3 skills:** `frontend-design` (Anthropic), `ui-ux-pro-max` (nextlevelbuilder), `web-design-engineer` (ConardLi), each pinned to a commit or an exact CLI version.
- **3 prompts:** a SaaS landing page, a data dashboard, and a personal blog and portfolio. Neutral wording, no style adjectives; the prompt files are the exact text the agents received.
- **2 agents:** Codex CLI with `gpt-6.1-sol` and Claude Code with `claude-opus-5-5`, both at high effort.
- **24 cells:** every prompt × (native + 3 skills) × 2 agents, each generated once and published as it came out. All 24 passed their checks (a failed run would have been published too).
- **A gallery** (English, with key notes in Chinese): an overview grid, a 2×2 page per skill, a side-by-side page per prompt, a sandboxed preview of every original page, and the full run record behind each cell.
- **The README in six languages:** English, 简体中文, 繁體中文, 日本語, 한국어 and Español.
- **Install and usage notes** for every skill in both agents.
- **Reproducible runs:** `scripts/run-claude.mjs` and `scripts/run-codex.mjs` run each cell in a throwaway environment and record the CLI version, model, effort, prompt hash, skill source, timing, token usage and isolation evidence in `run.json`.

## Known limitations

- Isolation means nothing from the operator's setup is *loaded*; the agents can still *read* the rest of the disk. Codex's `workspace-write` sandbox can read `/`, and Claude Code with `bypassPermissions` has no sandbox.
- Full-page screenshots draw fixed or sticky elements sized `100vh` (such as dashboard sidebars) at the first screen's height only.
- Native cells are the agents out of the box, not agents with zero skills: Claude Code's 19 bundled skills and Codex's system skills stay available. In the dashboard prompt, Claude Code's bundled `dataviz` skill fired on its own in `claude__native` and `claude__frontend-design` (recorded in `run.json` under `builtin_skills_used`).
- One sample per cell is an example, not a benchmark.
- The translated READMEs were made with AI. Corrections are welcome.

## Thanks

To the authors of the skills: Anthropic (`anthropics/skills`), Next Level Builder (`nextlevelbuilder/ui-ux-pro-max-skill`) and ConardLi (`ConardLi/garden-skills`). Each skill keeps its own license; this repository does not redistribute their files.

Not affiliated with Anthropic or OpenAI.

---

## 简体中文

# skill-gallery v0.1.0

第一个公开版本：三个网页设计类 agent skill，分别在 Claude Code 和 Codex 里用同样的三道题来跑，并和不用 skill 的结果放在一起对比。

**画廊：** https://heweitianqing.github.io/skill-gallery/

## 包含什么

- **3 个 skill：** `frontend-design`（Anthropic）、`ui-ux-pro-max`（nextlevelbuilder）、`web-design-engineer`（ConardLi），都固定到具体 commit 或 CLI 版本。
- **3 道题：** SaaS 落地页、数据看板、个人博客和作品集。措辞中立，不带风格形容词；题目文件就是 agent 实际收到的原文。
- **2 个 agent：** Codex CLI 用 `gpt-6.1-sol`，Claude Code 用 `claude-opus-5-5`，effort 都是 high。
- **24 个格子：** 每道题 ×（原生 + 3 个 skill）× 2 个 agent。每格只生成一次，结果原样公开。24 格全部通过检查（如果有失败的，也会照样公开）。
- **画廊**（以英文为主，关键说明附中文）：总览网格、每个 skill 一页 2×2、每道题一页横向对比、每个原始页面的沙箱预览，以及每格背后完整的运行记录。
- **六种语言的 README：** English、简体中文、繁體中文、日本語、한국어、Español。
- **每个 skill 在两个 agent 里的安装和调用说明。**
- **可复现：** `scripts/run-claude.mjs` 和 `scripts/run-codex.mjs` 在一次性的隔离环境里运行每一格，并把 CLI 版本、模型、effort、题目哈希、skill 来源、耗时、token 用量和隔离证据写进 `run.json`。

## 已知局限

- 隔离只保证不*加载*操作者的任何配置，agent 仍然能*读到*磁盘上的其他内容：Codex 的 `workspace-write` 沙箱可以读 `/`，Claude Code 在 `bypassPermissions` 下没有沙箱。
- 整页截图里，高度为 `100vh` 的固定或吸顶元素（比如看板侧栏）只画到第一屏的高度。
- 原生格是 agent 开箱即用的状态，不是零 skill：Claude Code 内置的 19 个 skill 和 Codex 的系统 skill 都可以用。在看板这道题里，Claude Code 内置的 `dataviz` skill 在 `claude__native` 和 `claude__frontend-design` 里各自触发了一次（记录在 `run.json` 的 `builtin_skills_used` 里）。
- 每格只采样一次，只能当作示例，不是评测分数。
- 各语言 README 由 AI 翻译，欢迎指正。

## 致谢

感谢各个 skill 的作者：Anthropic（`anthropics/skills`）、Next Level Builder（`nextlevelbuilder/ui-ux-pro-max-skill`）和 ConardLi（`ConardLi/garden-skills`）。各 skill 保留自己的许可证，本仓库不再分发它们的文件。

本项目与 Anthropic、OpenAI 无关联。
