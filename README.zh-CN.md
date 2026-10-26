[English](README.md) · **简体中文** · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md)

# skill-gallery

看看网页设计类 agent skill 实际做了什么：同样的题目，由 Claude Code 和 Codex 分别在用与不用每个 skill 的情况下完成，并排对比。

[![许可证：MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![画廊](https://img.shields.io/badge/gallery-online-555.svg)](https://heweitianqing.github.io/skill-gallery/zh-CN/)

[![结果表格总览](docs/launch/overview.png)](https://heweitianqing.github.io/skill-gallery/zh-CN/)

<!-- status:start -->
> **状态：v0。** 全部 24 格均已运行完毕（2026-10-25 – 2026-10-26，UTC）。
<!-- status:end -->

## 为什么做这个

有很多 agent skill（`SKILL.md` 格式）声称能让前端做得更好看，但很难判断它们到底改变了什么。它们的 README 展示的是精心挑选的示例，而且同一个 skill 在 Claude Code 和 Codex 中分别怎么安装、怎么调用，往往也说不清楚。本仓库在同样的题目、同样的条件下运行每个 skill，公开每一个结果，并写明两种 agent 的具体安装和调用步骤。

## 对比方法

每道题目在四个格子中运行：

|  | 原生（不额外加 skill） | + skill |
| --- | --- | --- |
| **Codex** | `codex__native` | `codex__<skill>` |
| **Claude Code** | `claude__native` | `claude__<skill>` |

两个原生格子只取决于题目，所以每个 skill 都和同样的两个基线比较。

| Agent | 模型 | Effort |
| --- | --- | --- |
| Codex CLI | `gpt-6.1-sol` | `model_reasoning_effort=high` |
| Claude Code | `claude-opus-5-5` | `--effort high` |

共三道题目，只做网页。题目措辞中性，不含风格形容词，四个格子拿到的文本完全相同；skill 格子只是在末尾多加一句点名 skill 的话。

| 题目 | 要求 |
| --- | --- |
| [`landing-saas`](prompts/landing-saas.md) | 一个虚构值班排班工具的营销页面，带价格切换和 FAQ |
| [`dashboard`](prompts/dashboard.md) | 一家虚构咖啡烘焙商的销售与运营看板，使用固定数据 |
| [`blog-portfolio`](prompts/blog-portfolio.md) | 一位虚构产品设计师的单页作品集和博客 |

## 结果

<!-- results:start -->
每个方块显示桌面宽度下的页面顶部：上面是 Codex，下面是 Claude Code。点击缩略图可在画廊中打开对应结果。

<table>
<thead><tr><th>题目</th><th>原生（不额外加 skill）</th><th><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/skills/frontend-design/">frontend-design</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/skills/ui-ux-pro-max/">ui-ux-pro-max</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/skills/web-design-engineer/">web-design-engineer</a></th></tr></thead>
<tbody>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/prompts/landing-saas/">SaaS 落地页</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/codex__native/"><img src="docs/launch/assets/thumbs/landing-saas/codex__native.png" width="160" alt="Codex · 原生，SaaS 落地页"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/claude__native/"><img src="docs/launch/assets/thumbs/landing-saas/claude__native.png" width="160" alt="Claude Code · 原生，SaaS 落地页"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/codex__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/codex__frontend-design.png" width="160" alt="Codex · + frontend-design，SaaS 落地页"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/claude__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design，SaaS 落地页"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max，SaaS 落地页"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max，SaaS 落地页"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer，SaaS 落地页"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/landing-saas/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer，SaaS 落地页"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/prompts/dashboard/">数据看板</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/codex__native/"><img src="docs/launch/assets/thumbs/dashboard/codex__native.png" width="160" alt="Codex · 原生，数据看板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/claude__native/"><img src="docs/launch/assets/thumbs/dashboard/claude__native.png" width="160" alt="Claude Code · 原生，数据看板"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/codex__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/codex__frontend-design.png" width="160" alt="Codex · + frontend-design，数据看板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/claude__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design，数据看板"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max，数据看板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max，数据看板"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer，数据看板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/dashboard/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer，数据看板"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/prompts/blog-portfolio/">个人博客与作品集</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/codex__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__native.png" width="160" alt="Codex · 原生，个人博客与作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/claude__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__native.png" width="160" alt="Claude Code · 原生，个人博客与作品集"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/codex__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__frontend-design.png" width="160" alt="Codex · + frontend-design，个人博客与作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/claude__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design，个人博客与作品集"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max，个人博客与作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max，个人博客与作品集"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer，个人博客与作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/zh-CN/cells/blog-portfolio/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer，个人博客与作品集"></a><br><sub>Claude Code</sub></td></tr>
</tbody>
</table>
<!-- results:end -->

## Skill：安装与使用

下面是每个 agent 的简要步骤。画廊里每个 skill 的页面都有完整的命令和说明。

<!-- skills:start -->
| Skill | Claude Code | Codex |
| --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/zh-CN/skills/frontend-design/#install) | 把文件夹复制到 `.claude/skills/frontend-design/`，然后在提示词末尾加上 `Use the frontend-design skill.`（或输入 `/frontend-design …`） | 把文件夹复制到 `.agents/skills/frontend-design/`，然后在提示词中提到 `$frontend-design` |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/zh-CN/skills/ui-ux-pro-max/#install) | 运行 `npx ui-ux-pro-max-cli@2.15.0 init --ai claude`，然后在提示词末尾加上 `Use the ui-ux-pro-max skill.`（或输入 `/ui-ux-pro-max …`） | 运行 `npx ui-ux-pro-max-cli@2.15.0 init --ai codex`，然后在提示词中提到 `$ui-ux-pro-max` |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/zh-CN/skills/web-design-engineer/#install) | 把文件夹复制到 `.claude/skills/web-design-engineer/`，然后在提示词末尾加上 `Use the web-design-engineer skill.`（或输入 `/web-design-engineer …`） | 把文件夹复制到 `.agents/skills/web-design-engineer/`，然后在提示词中提到 `$web-design-engineer` |
<!-- skills:end -->

## 方法与局限

- **隔离。** 每次运行都从仓库之外一个全新的临时目录开始：`HOME` 为空，配置目录独立（`CLAUDE_CONFIG_DIR` 或 `CODEX_HOME`），环境变量从零构建。不加载运行者的任何设置、插件、用户级 skill、MCP 服务器或记忆。skill 只复制到这个项目的 skill 文件夹中。各 agent 自己的日志作为证据保存在每个 `run.json` 里。
- **Skill 必须真正触发。** 只有日志显示 skill 已被加载（`skill_triggered`），skill 格子才算数，否则标为失败。这项检查背后的金丝雀测试见 [docs/canary.md](docs/canary.md)。
- **每格只采样一次，不挑图。** 每个格子只生成一次，不追加对话轮次。所有结果都会公开，失败的也包括在内；重新运行时会保留之前的尝试。
- **“原生”指开箱即用的状态，不是零 skill。** 每一格（包括原生格）都能用 agent 自带的 skill：Claude Code 内置的 19 个 skill，以及 Codex 的系统 skill（`imagegen`、`openai-docs`、`skill-creator`、`skill-installer`）。在 `dashboard` 这道题里，Claude Code 内置的 `dataviz` skill 自己触发了两次，`claude__native` 一次，`claude__frontend-design` 一次，记录在 `run.json` 的 `builtin_skills_used` 里。这是有意保留的：比较的是读者装好 agent 之后实际得到的效果。
- **局限：磁盘上的其他内容仍然可读。** 隔离的意思是什么都不*加载*，而不是什么都*读不到*。Codex 默认的 `workspace-write` 沙箱可以读取 `/`，而使用 `bypassPermissions` 的 Claude Code 根本没有沙箱。在 v0 的运行中，agent 曾到上级目录查找 `AGENTS.md`，还有一个用运行者 npm 缓存里的 Playwright 测试了自己的页面。改用单独的用户账号或容器可以堵上这个缺口。
- **局限：截图中的固定侧边栏。** 整页截图对尺寸为 `100vh` 的 `position: fixed` 或 `sticky` 元素，只按首屏高度绘制，所以看板的侧边栏可能看起来在 900 px 处就断了。页面本身没有问题，可以在画廊中打开确认。
- **局限：一次采样不等于基准测试。** 请把画廊当作 skill 大致效果的示例，而不是评分。

详情见 [docs/running.md](docs/running.md) 和 [docs/run-schema.md](docs/run-schema.md)。

## 复现

环境要求：macOS 或 Linux、Node 20+、git、Codex CLI 和 Claude Code CLI，两个 CLI 都需要登录。

```bash
git clone https://github.com/heweitianqing/skill-gallery.git
cd skill-gallery
npm install
npx playwright install --no-shell chromium
codex login
bash scripts/setup-claude-auth.sh        # 为隔离的 Claude 运行创建长期 token

node scripts/fetch-skill.mjs --all       # 按固定版本获取 skill，存到 .cache/skills/
node scripts/run-codex.mjs landing-saas native
node scripts/run-codex.mjs landing-saas frontend-design
node scripts/run-claude.mjs landing-saas frontend-design
node scripts/screenshot.mjs              # 为新格子生成 desktop.png 和 mobile.png

node scripts/build-site.mjs              # 生成画廊，输出到 site/dist/
node scripts/build-readme.mjs            # 刷新所有 README 中的表格
```

预览画廊：运行 `python3 -m http.server 8000 --directory site/dist`，然后打开 <http://localhost:8000/>。

## 添加 skill

可以通过 [skill 推荐表单](https://github.com/heweitianqing/skill-gallery/issues/new?template=skill-suggestion.yml)推荐，也可以自己添加：

1. 创建 `skills/<name>/meta.yaml`，写明固定来源（仓库、commit、路径）、许可证，以及在每个 agent 中如何安装和调用。可以复制一个现有的文件作为模板。
2. 运行 `node scripts/fetch-skill.mjs <name>`，然后运行六个 skill 格子（三道题目 × 两个 agent），再运行 `node scripts/screenshot.mjs`。
3. 把 skill 的名称加到 `site/config.json`，然后运行 `node scripts/build-readme.mjs`。
4. 提交一个包含新 `runs/` 格子的 pull request。不要为了得到更好看的结果而重新运行格子。

详情见 [CONTRIBUTING.zh-CN.md](CONTRIBUTING.zh-CN.md)。

## 致谢

这些 skill 归各自的作者所有，沿用各自的许可证。本仓库不包含它们的文件；这些文件会按固定的 commit 或版本获取。

<!-- credits:start -->
| Skill | 来源 | 许可证 | 固定 commit |
| --- | --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/zh-CN/skills/frontend-design/) | [anthropics/skills](https://github.com/anthropics/skills) `skills/frontend-design` | [Apache-2.0](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt) | [`dbd4588f9e`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design) |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/zh-CN/skills/ui-ux-pro-max/) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) `.claude/skills/ui-ux-pro-max`<br><sub>Copyright (c) 2024 Next Level Builder</sub> | [MIT](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/LICENSE) | `ui-ux-pro-max-cli@2.15.0`（由 CLI 生成）<br><sub>[`d14efff8ed`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d14efff8ed1faa4187f004f79926f428c8074ec7/.claude/skills/ui-ux-pro-max)</sub> |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/zh-CN/skills/web-design-engineer/) | [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) `skills/web-design-engineer`<br><sub>Copyright (c) 2026 (no name given; attribute to ConardLi/garden-skills)</sub> | [MIT](https://github.com/ConardLi/garden-skills/blob/2b9a89340b70f632d31c0f1c69fce94a7912423e/LICENSE) | [`2b9a89340b`](https://github.com/ConardLi/garden-skills/tree/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer) |
<!-- credits:end -->

## 免责声明

本项目与 Anthropic 或 OpenAI 没有任何关联，也未获得其认可或赞助。Claude、Claude Code、Codex 及其他名称是其各自所有者的商标。`runs/` 中的页面是未经编辑的模型输出，其中的公司和人物均为虚构。

本 README 和画廊的翻译由 AI 完成。欢迎通过 pull request 提交更正。

本仓库的代码和文档以 [MIT 许可证](LICENSE)发布。
