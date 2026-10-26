[English](CONTRIBUTING.md) · **简体中文**

# 参与贡献 skill-gallery

感谢帮忙。只有每个结果都用同一套方式产出，这个画廊才有参考价值，所以本页大部分内容是在讲怎么保证运行公平。

## 可以怎么帮忙

- **推荐 skill**：填写 [skill 推荐表单](https://github.com/heweitianqing/skill-gallery/issues/new?template=skill-suggestion.yml)，写明仓库、`SKILL.md` 所在目录和 License。
- **报告结果问题**：截图坏了、`run.json` 数据不对、安装步骤有误，或者对公平性有疑问，请填写 [结果问题表单](https://github.com/heweitianqing/skill-gallery/issues/new?template=result-problem.yml)。
- **修正翻译**：各语言 README 都由 AI 翻译，非常欢迎母语使用者提 PR（见[翻译](#翻译)）。
- **自己添加 skill**：见下文。

## 关于结果的基本规则

1. **每格只生成一次，不挑图。** 不要因为想要更好的结果而重跑。只有这几种情况可以重跑：没有生成 `index.html`；skill 没有被调用（`skill_triggered: false`）；运行因为 agent 以外的原因中断（断网、登录过期）。运行脚本会把旧结果移到 `runs/<prompt>/_attempts/`，并记在 `previous_attempts` 里，PR 里两者都要保留。
2. **不要修改生成的文件。** `runs/` 里的 `index.html`、`run.json`、`transcript.jsonl` 和截图，必须保持脚本写出时的样子。
3. **用仓库里的脚本运行。** `scripts/run-claude.mjs` 和 `scripts/run-codex.mjs` 负责搭建隔离环境、记录证据。用其他方式得到的结果不能收录。
4. **不要提交任何凭据。** 运行脚本把 token 放在仓库外面；提交前请看一眼 `git status`。
5. **仓库不存放 skill 文件。** `scripts/fetch-skill.mjs` 会按固定 commit 或固定 CLI 版本，把 skill 下载到不进 git 的 `.cache/skills/`。

## 添加 skill

1. **写元数据。** 参照已有的文件，新建 `skills/<name>/meta.yaml`，其中记录：
   - `upstream`：仓库地址、完整的 commit SHA、skill 目录路径，以及固定到该 commit 的 `SKILL.md` 链接；
   - `license`：SPDX 标识和固定版本的许可证文件链接；
   - `fetch`：`method: git`（稀疏检出固定 commit）或 `method: npm-cli`（用 skill 自带的安装器，版本写死）；
   - `install` 和 `invoke`：读者在 Claude Code 和 Codex 里怎么安装、怎么调用；
   - `notes`：读者需要知道的其他事项（运行依赖、已知的坑）。
2. **获取 skill。** 运行 `node scripts/fetch-skill.mjs <name>`，确认缓存目录里有 `SKILL.md`。
3. **跑六个带 skill 的格子**，每格一次：

   ```bash
   for p in landing-saas dashboard blog-portfolio; do
     node scripts/run-codex.mjs "$p" <name>
     node scripts/run-claude.mjs "$p" <name>
   done
   node scripts/screenshot.mjs
   ```

   原生格所有 skill 共用，不要重跑。
4. **加到站点里。** 把名字加进 `site/config.json` 的 `skills`。画廊会从 `meta.yaml` 读取 skill 的简介、来源、许可证和安装说明。
5. **重新构建。** `node scripts/build-site.mjs`（画廊输出到 `site/dist/`）和 `node scripts/build-readme.mjs`（更新所有 README 里的表格）。本地预览：`python3 -m http.server 8000 --directory site/dist`。
6. **提交 PR**，包括 `skills/<name>/meta.yaml`、新的 `runs/` 格子、站点和 README 的改动，以及重新生成的 `docs/launch/` 图片。

skill 必须是公开的，许可证要允许获取和运行。需要付费服务、账号或运行时联网的 skill 很难公平比较，推荐时请注明。

## 翻译

README 和画廊都有六种语言：English、简体中文、繁體中文、日本語、한국어、Español。

| 内容 | 文件 |
| --- | --- |
| README | `README.<lang>.md` |
| 画廊页面 | `site/i18n/<lang>.json` |
| README 里自动生成的表格文字 | `scripts/build-readme.strings.json` |
| 本指南 | `CONTRIBUTING.zh-CN.md`（欢迎补充其他语言） |

- `{占位符}` 和反引号里的内容保持不变。
- skill、Codex、Claude Code 这些名字，以及文件名和字段名，都不翻译。
- `prompts/` 里的题目文件永远不翻译，那是 agent 实际收到的输入。
- README 里的 `<!-- results:start -->`、`<!-- skills:start -->`、`<!-- credits:start -->` 区块不要手改，`scripts/build-readme.mjs` 会重写它们。

要给 README 新增一种语言：在 `scripts/build-readme.strings.json` 里加上这种语言的条目，照着 `README.md` 新建 `README.<code>.md`，在每份 README 顶部的语言链接里加上它，然后运行 `node scripts/build-readme.mjs`。

## 代码

构建脚本（`scripts/build-site.mjs`、`scripts/build-readme.mjs`）只用 Node 内置模块，请保持这一点。`build-readme.mjs` 只在渲染 `docs/launch/` 里的两张图时用到 Playwright（已经是开发依赖）。

提交贡献即表示你同意按本仓库的 [MIT 许可证](LICENSE) 发布这些内容。第三方 skill 保留各自的许可证。
