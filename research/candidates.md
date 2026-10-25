# skill-gallery 候选 skill 调研（网页样式类，v0 第一批）

核实时间：2026-10-25 16:28 UTC（北京时间 2026-10-26 00:28）。机器可读版本见 [candidates.json](candidates.json)，字段更全，每个字段都带来源链接。

方法：stars、HEAD SHA、路径最后一次提交、文件树都用 `gh api` 的只读 GET 取；SKILL.md 与 LICENSE 在 scratchpad 下新建的空目录里浅克隆后只读，没有执行任何脚本；官方文档用 WebFetch 取。调研期间没有往 `~/.claude/skills`、`~/.codex/skills`、`~/.agents/skills` 写任何东西，没有 star、没有发帖。

---

## 1. 结论

**v0 先跑这三个：**

| # | skill | 为什么选 |
|---|---|---|
| 1 | [`anthropics/skills` → `frontend-design`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design) | 最知名（仓库 183,690★、官方、skills.sh 第 13 名约 1.0M 安装）；单个 SKILL.md、无脚本，装法最简单；风格主张是「反模板、先做设计计划再对照 brief 自查」。 |
| 2 | [`nextlevelbuilder/ui-ux-pro-max-skill` → `ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d14efff8ed1faa4187f004f79926f428c8074ec7/.claude/skills/ui-ux-pro-max) | 社区最高星之一（140,261★，skills.sh 约 414K 安装）；走另一条路线：本地数据库（79 种风格、192 个产品配色、74 组字体、25 种图表）+ Python 检索脚本先生成 design system，再落地。与第 1 个形成「靠审美判断」对「靠数据查表」的对比。 |
| 3 | [`openai/skills` → `frontend-skill`](https://github.com/openai/skills/tree/30444aed500c00c85294d12074f6e3ee794f808a/skills/.curated/frontend-skill)（钉在删除前的提交） | OpenAI 官方为 Codex 写的；风格主张与前两个差异最大：克制、默认无卡片、满幅海报式首屏、少量有意义的动效；明确区分落地页与看板（看板不做 hero）。单个 SKILL.md。 |

三个都满足：知名、风格路线不同、能在「单个自包含 `index.html`」约束下用（见第 4 节各自要补的约束）。

**要特别告诉你的两点：**

1. **第 3 个已经被 OpenAI 从官方目录删掉了**（2026-04-23，提交 [`11c643813b`](https://github.com/openai/skills/commit/11c643813b4645ca9f25d49ca180697732e0141a)，删除原因我没能核实）。当前 HEAD 没有这个目录，只能用删除前的父提交 `30444aed500c…` 里的文件。Composio 的榜单（2026-05-05）和 VoltAgent 的列表仍然把它写在 `skills/.curated/frontend-skill` 下，路径已经不存在。如果不想把一个被官方撤出的 skill 放进第一批，**换成 [`ConardLi/garden-skills` → `web-design-engineer`](https://github.com/ConardLi/garden-skills/tree/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer)**：MIT、13,268★、产出始终是 HTML、25 个按真实产品命名的风格配方（Linear、Aesop、Bloomberg Terminal、MUJI 等）、仍在活跃维护，代价是知名度低一档。
2. **taste-skill（102,337★，skills.sh 多个条目都在前 170 名内）我放在 backlog 第一位，没进 v0**：它的默认流程是「脚本抽方向 → 联网找图 → 写站 → 开 Chrome 检查 → 截图迭代」，要 Node 22+ 和 Chrome，会产出 `.taste-skill/`、`assets/` 等多个文件，和「单个 index.html」冲突，需要大幅改造题目才公平。第二批最该补上它。

---

## 2. 对比表

★ 为仓库级 stars（多 skill 仓库不能反映单个 skill 热度）。「再分发」指能否原样把 skill 文件收进我们的仓库（非法律意见）。

| 状态 | skill | 仓库@pinned SHA | 许可证（已打开 LICENSE 核对） | ★ / 官方 | 输出形态 | 单个自包含 HTML | 再分发 |
|---|---|---|---|---|---|---|---|
| **v0-1** | frontend-design | anthropics/skills@[`dbd4588f9e`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44)；skill 路径最后提交 [`41bbe19d1a`](https://github.com/anthropics/skills/commit/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f)（2026-09-03） | Apache-2.0（[LICENSE.txt](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt)，标准全文，无版权行） | 183,690 / 官方 Anthropic | 纯指引，2 个文件（SKILL.md + LICENSE.txt），无脚本 | 可直接用 | 是，带上 LICENSE.txt |
| **v0-2** | ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill@[`d14efff8ed`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d14efff8ed1faa4187f004f79926f428c8074ec7)；skill 路径最后提交 [`477bcb28c9`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/477bcb28c9812b385cb51a4605ddf30d7b2266e2)（2026-10-03） | MIT（[根 LICENSE](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/LICENSE)，Copyright (c) 2024 Next Level Builder；skill 目录内无 LICENSE） | 140,261 / 社区 | 指引 + 73 个文件 3.5MB 的 CSV/JSON 数据 + Python 脚本（需 python3，无网络） | 可用，需补约束 | 是，要带根 LICENSE |
| **v0-3** | frontend-skill | openai/skills@[`30444aed50`](https://github.com/openai/skills/tree/30444aed500c00c85294d12074f6e3ee794f808a/skills/.curated/frontend-skill)（删除提交 `11c643813b` 的父提交；当前 HEAD `49f948faa9`） | Apache-2.0（[LICENSE.txt](https://github.com/openai/skills/blob/30444aed500c00c85294d12074f6e3ee794f808a/skills/.curated/frontend-skill/LICENSE.txt)，附录版权行是 `[yyyy] [name of copyright owner]` 占位符） | 28,297 / 官方 OpenAI | 纯指引，3 个文件（SKILL.md、LICENSE.txt、agents/openai.yaml） | 可直接用，但它要求「真实图片」，与无外链冲突 | 是，带 LICENSE.txt |
| backlog-1 | taste-skill（frontmatter 名 `design-taste-frontend`） | Leonxlnx/taste-skill@[`12af471f62`](https://github.com/Leonxlnx/taste-skill/tree/12af471f627f866411b4bd785b19646d3672784c) | MIT（Copyright (c) 2026 Leonxlnx） | 102,337 / 个人 | 指引 + 39 个文件 2.4MB（Node 脚本、JSON 方向库） | 需改造：要 Node 22+、Chrome、联网找图，多文件产物 | 是 |
| backlog-2 | web-design-engineer | ConardLi/garden-skills@[`2b9a89340b`](https://github.com/ConardLi/garden-skills/tree/2b9a89340b70f632d31c0f1c69fce94a7912423e) | MIT（Copyright (c) 2026，未写姓名） | 13,268 / 个人 | 纯指引 + 39 个文件 230KB，产出始终是 HTML | 可直接用 | 是 |
| backlog-3 | impeccable | pbakaus/impeccable@[`658b4ce294`](https://github.com/pbakaus/impeccable/tree/658b4ce2942171ed5b3b3bec7e9d99456ba86e5e) | Apache-2.0 + NOTICE（部分参考文档由 MIT 作品改写） | 87,305 / 个人 | 指引 + 引擎二进制启动器 + hooks，首次运行下载二进制到 `~/.impeccable/bin/` | 不适合 v0：全局写入、遥测、重在审查/打磨已有界面 | 条件：skill 可，引擎二进制许可证未核实 |
| backlog-4 | landing-page-design | elayadesign/ai-design-skills@[`38bbe57656`](https://github.com/elayadesign/ai-design-skills/tree/38bbe5765600b9178b5395a823c9f6c8d2b8e730) | MIT（Copyright (c) 2026 Elaya） | 4,724 / 个人 | 单个 SKILL.md 16KB，规则按 Tailwind 刻度写 | 只覆盖落地页，Tailwind 与自包含冲突 | 是 |
| backlog-5 | theme-factory | anthropics/skills@`dbd4588f9e` | Apache-2.0（Copyright 2026 Anthropic, PBC.） | 183,690 / 官方 | 指引 + 10 个主题 md + 展示 PDF | 只能当修饰器，且流程要「让用户挑主题」 | 是 |
| backlog-6 | emil-design-eng | emilkowalski/skills@[`2d228630ba`](https://github.com/emilkowalski/skills/tree/2d228630ba1446365f614a108cb8252f1feda202) | MIT（Copyright (c) 2026 Emil Kowalski） | 49,558 / 个人 | 单个 SKILL.md 26KB | 只能当动效/手感修饰器 | 是 |
| backlog-7 | MengTo/Skills 合集 | MengTo/Skills@[`0831489c02`](https://github.com/MengTo/Skills/tree/0831489c02b212ea59da93d1767d2089f943c2e5) | MIT（Copyright (c) 2026 Meng To） | 7,011 / 个人 | 1360 个文件的合集，逐个 skill 未细读 | 未核实，需先挑具体 skill | 是（单 skill 内第三方素材未核实） |
| backlog-8 | web-artifacts-builder | anthropics/skills@`dbd4588f9e` | Apache-2.0 | 183,690 / 官方 | React+Vite+shadcn 工程，`bundle.html` 由脚本打包；脚本会 `npm install -g pnpm` 并联网装约 60 个包 | 不适合 v0：官方 description 自己写了「不适合简单单文件 HTML」 | 是（内含 shadcn 组件 tarball，其许可证未核实） |
| backlog-9 | web-design-guidelines | vercel-labs/agent-skills@[`063bee94c3`](https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278) | **无 LICENSE 文件**；仅 README 末尾写「MIT」；GitHub 未识别许可证 | 32,999 / 官方 Vercel | 审查型：运行时联网拉规则，输出 file:line 问题清单 | 不能生成页面 | 不确定，先别收文件，只放链接 |

---

## 3. 候选逐个说明

### 3.1 v0-1 `frontend-design`（Anthropic）

- 仓库 / 路径：`anthropics/skills` / `skills/frontend-design`，HEAD `dbd4588f9e1033efb41dad4bef2f7947c8993d44`（2026-10-09）。skill 目录最近一次提交 `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f`（2026-09-03，「Update frontend-design skill to avoid generic design defaults (#1713)」），更早是 2026-06-09，内容已大改，**必须钉 SHA**。
- 同内容副本：`anthropics/claude-plugins-official` 的 `plugins/frontend-design` 和 `anthropics/claude-code` 的 `plugins/frontend-design`，三处 SKILL.md 我用 `cmp` 比过，字节完全一致（9,390 字节）。文档里只引用 `anthropics/skills`。
- 许可证：skill 目录自带 LICENSE.txt，Apache 2.0 全文 177 行（同仓库其他 skill 是 201 行并带 `Copyright 2026 Anthropic, PBC.`）。仓库 README 第 20 行说「Many skills in this repo are open source (Apache 2.0)」，docx/pdf/pptx/xlsx 四个是 source-available，不在我们范围内。GitHub 仓库级 license 字段为空，因为许可证逐 skill 放。
- 知名度：183,690★；skills.sh 第 13 名约 1.0M 安装（[skills.sh](https://skills.sh)，页面无日期）；Bitdoze 2026-08-28 榜首；Composio 2026-05-05 第 1 条。
- 内容：只有 SKILL.md。要求先做设计计划（4–6 个具名色值、字体角色、布局 + ASCII 线框、原则），再对照 brief 检查是否落入 5 类 AI 默认外观，通过后才写代码；整页只允许一个「胆大」的地方；底线是响应式、焦点可见、尊重减少动效。
- 单个 HTML：能。不规定输出格式，题目里必须写死「单个自包含 index.html、不引用外部字体/脚本/图片」，否则它「选有性格字体」的倾向会引 Google Fonts。brief 没写清主题时它会「先与客户确认」，headless 没人回答，所以题目要把主题、受众写全。
- Claude Code：项目级复制 `skills/frontend-design/` → `.claude/skills/frontend-design/`；触发 `/frontend-design <题目>`；headless `claude -p "/frontend-design <题目>" --permission-mode acceptEdits`。插件形式 `/plugin install frontend-design@claude-plugins-official`（默认 user 作用域会写 `~/.claude`，实验里不要用）。
- Codex：复制到 `<项目>/.agents/skills/frontend-design/`；提示词里写 `$frontend-design`。
- 未实测：两个 CLI 里的实际触发表现。

### 3.2 v0-2 `ui-ux-pro-max`（nextlevelbuilder）

- 仓库 / 路径：`nextlevelbuilder/ui-ux-pro-max-skill` / `.claude/skills/ui-ux-pro-max`（仓库里还有作者维护源 `src/ui-ux-pro-max/` 和 npm CLI 打包物 `cli/assets/`），HEAD `d14efff8ed1faa4187f004f79926f428c8074ec7`（2026-10-23），skill 路径最后提交 `477bcb28c9812b385cb51a4605ddf30d7b2266e2`（2026-10-03）。插件版本 2.15.0，CLI（`ui-ux-pro-max-cli`）2.5.0，更新很频繁。
- 许可证：MIT，只在仓库根 `LICENSE`，**skill 目录里没有 LICENSE**，收录时要带根 LICENSE。
- 知名度：140,261★；skills.sh 第 181 名约 414.3K 安装；Bitdoze 第 6 条。
- 输出形态：73 个文件、3.5MB（`google-fonts.csv` 约 730KB、`phosphor-icons-upstream.json` 约 800KB），`scripts/search.py` 等只用标准库、无网络。脚本给出 design system（ASCII / markdown / `--json`），HTML 仍由 agent 写，没有 HTML 模板。`--persist` 会往项目里写 `design-system/`，会多出文件。
- **一个会坑人的地方**：仓库里 `.claude/skills/ui-ux-pro-max/SKILL.md` 里的命令全是 `python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py"`，这个变量只有当它被当作插件加载时才有值；直接复制成项目级 skill，路径会失效。官方推荐的 `uipro init --ai claude`（`npm install -g ui-ux-pro-max-cli`，全局 npm）会用模板把路径换成项目相对路径（`cli/src/utils/template.ts` 的 `rootedScriptPath`）。我们只能二选一：用 CLI 生成物并记录 CLI 版本，或手动替换路径并在 NOTICE 里写明已修改（MIT 允许）。
- 插件安装（`/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`）不推荐：`plugin.json` 的 `skills` 指向整个 `./.claude/skills/`，该目录下有 7 个 skill 目录，我推断会全部注册（未实测）。
- 单个 HTML：能，但 SKILL.md 要求「Never assume a stack ... ask the user」，题目要写明「纯 HTML/CSS/原生 JS」；它的 `html-tailwind` 栈会引导 Tailwind CDN，与自包含冲突。需要 agent 能跑 python3（本机有 3.12）。
- 对三道题的数据支持：`products.csv` 有「Landing Page Pattern」「Dashboard Style」列，含 SaaS、Dashboard 类行；Portfolio / Personal / Blog 只有各 1~2 行，博客/作品集一题数据偏少。
- Codex：`uipro init --ai codex` 写 `<项目>/.agents/skills/ui-ux-pro-max/`；触发 `$ui-ux-pro-max`。
- 未实测：CLI 生成物的实际内容（没有运行 CLI）、两个 CLI 里的实际表现。

### 3.3 v0-3 `frontend-skill`（OpenAI，已下架，钉提交）

- 仓库 / 路径：`openai/skills` / `skills/.curated/frontend-skill`。2026-03-20 由 `82d2c5b44ac2…` 加入（#284），2026-04-23 由 `11c643813b4645ca9f25d49ca180697732e0141a` 删除（#370，「Remove curated frontend and web game skills」，同一提交还删了 `develop-web-game`）。要用的内容取自父提交 `30444aed500c00c85294d12074f6e3ee794f808a`；仓库当前 HEAD 是 `49f948faa9258a0c61caceaf225e179651397431`（2026-06-24）。删除原因：未核实（对应 PR 页面取不到）。
- 许可证：Apache 2.0 全文，附录里版权行没填（仍是 `Copyright [yyyy] [name of copyright owner]`）。署名写「OpenAI (openai/skills)」加上来源 SHA。
- 知名度：`openai/skills` 28,297★、官方；Composio（2026-05-05）第 1 条、VoltAgent 列表仍列出，但这两处写的路径都已经不存在。
- 内容：先写 visual thesis / content plan / interaction thesis；落地页给出固定节奏（Hero → Support → Detail → Final CTA）和一串「默认不要」（无 hero 卡片、无统计条、无 logo 云）；App/看板走 Linear 式克制，有「Utility Copy For Product UI」一节明确说**看板不要 hero、用实用文案**。
- 单个 HTML：能。与「自包含」有两处张力：它要求至少一张真实感图片和强视觉锚点，单文件无外链时只能用内联 SVG/CSS 画；动效写的是「Prefer Framer Motion when available」，单文件里应改成纯 CSS/原生 JS。
- Claude Code：复制 SKILL.md（和 LICENSE.txt）到 `.claude/skills/frontend-skill/`；`agents/openai.yaml` 对 Claude 无用，Claude Code 对未知字段不报错。`/frontend-skill <题目>`。
- Codex：复制到 `<项目>/.agents/skills/frontend-skill/`（含 `agents/openai.yaml`）；`$frontend-skill <题目>`（yaml 里的 default_prompt 就是 "Use $frontend-skill to ..."）。**不要用 `$skill-installer`**：当前 HEAD 已经没有这个目录。
- 对实验的影响：gpt-6.1-sol 可能已经内化了类似偏好，「Codex + skill」和「Codex 原生」的差异可能很小。这本身是有价值的结论，页面上要如实展示。

---

## 4. 在三道题（落地页 / 看板 / 博客作品集）、单个自包含 `index.html` 约束下的适配

| skill | 能不能直接用 | 差在哪 / 要补什么 |
|---|---|---|
| frontend-design | 能 | 题目写死「单文件、无外链」；主题受众写全，避免它「先确认客户」 |
| ui-ux-pro-max | 能，要补约束 | 需 python3 + 允许 Bash；题目指定「纯 HTML/CSS/JS」；压制 Tailwind/框架栈；别用 `--persist`；路径变量问题（上节） |
| frontend-skill | 能，要补约束 | 「真实图片」改为内联 SVG/CSS；Framer Motion 改纯 CSS/JS |
| taste-skill | 不能，要改造 | 多文件、联网、Chrome、Node 22+ |
| web-design-engineer | 能 | 题目禁用 React+Babel CDN 路径，用默认手写 CSS 路径 |
| impeccable | 不适合 | 全局下载二进制、遥测、hooks |
| landing-page-design | 只覆盖第一题 | 强制 Tailwind 刻度 |
| theme-factory / emil-design-eng | 只能当修饰器 | `-p` 下一行只加载第一个 skill，叠加使用不可行 |
| web-artifacts-builder | 不适合 | React 工程、联网安装、全局装 pnpm |
| web-design-guidelines | 不能生成 | 审查器、联网拉规则、无 LICENSE |

整个矩阵共同的问题：**「自包含」要先定义**。三个 v0 skill 都鼓励「有性格的字体」「真实图片」，agent 一旦引用 Google Fonts 或外链图，就不再是自包含。建议在题库里统一写一条硬规则（不得有任何外部 URL 资源，字体用系统字体栈或内联 base64，图片用内联 SVG/CSS），并在评分时用脚本扫描 `index.html` 里的 `http(s)://` 引用。这条规则对四个格子一视同仁。

---

## 5. 官方文档查清的两件事

### 5.1 Codex CLI：从哪些目录加载 skill，怎么显式调用

文档：[Codex Skills](https://developers.openai.com/codex/skills)（取页时 308 重定向到 `https://learn.chatgpt.com/docs/build-skills.md`，页面标题 "Build skills"）；[非交互模式](https://developers.openai.com/codex/noninteractive)（重定向到 `https://learn.chatgpt.com/docs/non-interactive-mode`）。另用 Codex 源码交叉核对（`openai/codex`@`970111f6cb62`，[host_roots.rs](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/ext/skills/src/host_roots.rs)、[selection.rs](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/ext/skills/src/selection.rs)）。

加载目录：

| 范围 | 路径 | 来源 |
|---|---|---|
| 仓库 | `$CWD/.agents/skills`，向上到 `$REPO_ROOT/.agents/skills`（含 `$CWD/../.agents/skills`） | 文档 + 源码 |
| 用户 | `$HOME/.agents/skills` | 文档 + 源码 |
| 管理员 | `/etc/codex/skills` | 文档 |
| 系统 | Codex 自带（本机 `~/.codex/skills/.system`：imagegen、openai-docs、review-agent、skill-creator、skill-installer） | 文档 + 本机观察 |
| 已弃用的用户目录 | `$CODEX_HOME/skills`（默认 `~/.codex/skills`），为兼容仍会加载 | **仅源码**，文档页没有 |

注意：文档页**没有**提 `~/.codex/skills`，很多旧教程还写这个路径；新版推荐的是 `.agents/skills`。

显式调用：在提示词里写 **`$skill-name`**（CLI / IDE 扩展），或 `/skills` 列出；ChatGPT 里用 `@`。隐式触发靠 description，`agents/openai.yaml` 的 `policy.allow_implicit_invocation: false` 可关闭隐式触发，显式 `$name` 仍然有效。源码里 `collect_explicit_skill_mentions` 对每个 `UserInput::Text` 解析 `$name`。

**`codex exec`（非交互）是否加载 skill：官方文档没有写。** 源码里 skill 解析挂在 core 线程上，推断 `codex exec "…$frontend-design…"` 同样生效，但**我没有实测**。本机装有 `codex-cli 0.164.0`，`codex exec --help` 里确认存在 `-m/--model`、`-c/--config key=value`、`-C/--cd`、`-s/--sandbox`、`--json`、`-o/--output-last-message`、`--ephemeral`、`--skip-git-repo-check`、`--ignore-user-config`。写文件需要 `-s workspace-write`（默认只读沙箱）；`--full-auto` 已不再支持。`--ignore-user-config` 只跳过 `config.toml`，**不影响 skill 目录**。

建议：正式跑之前，先在空项目里放一个只有一行指令（例如「回答时第一行输出 SKILL_LOADED」）的测试 skill，用 `codex exec` 实测一次 `$name` 能不能触发，再开始跑矩阵。

### 5.2 Claude Code headless（`claude -p`）：skill 会不会加载，怎么显式触发

文档：[Skills](https://code.claude.com/docs/en/skills)、[Headless / `claude -p`](https://code.claude.com/docs/en/headless)、[插件](https://code.claude.com/docs/en/discover-plugins)。

- **会加载。** headless 页明确写：用户可调用的 skill 和自定义命令在 `-p` 下可用，「在提示词字符串里写 `/skill-name`，Claude Code 会先展开再运行」；纯终端 UI 命令（如 `/login`）不可用。
- **显式触发：** `claude -p "/frontend-design <完整题目>" --permission-mode acceptEdits`。参数会填进 `$ARGUMENTS`；SKILL.md 里没有占位符时，Claude Code 会把 `ARGUMENTS: <你的输入>` 追加到 skill 内容末尾，所以题目不会丢。插件里的 skill 命名空间是 `/plugin-name:skill-name`。
- **`-p` 下一行只加载第一个 skill**（`/a /b` 只会加载 `/a`），叠加多个 skill 只有交互终端可以。
- **`--bare` 会关掉 skill 自动发现**：headless 页说 `--bare` 跳过 hooks、skills、插件、CLAUDE.md、auto memory 的自动发现，并且「将来会成为 `-p` 的默认值」。跑 skill 格时**不要加 `--bare`**；或者用 `--add-dir <含 .claude/skills 的目录>`（bare 下 `--add-dir` 的 `.claude/skills` 仍会加载，但系统提醒里不再列 skill 清单；这种情况下显式 `/name` 是否仍可用，文档没明说，我推断可用，未实测）。因为默认值会变，每次 run 要记录 `claude --version`。
- **权限：** v2.1.302 起 `-p` 默认 Manual 模式，要写 `index.html` 需要 `--permission-mode acceptEdits` 或 `--allowedTools "Write,Edit,Bash"`。
- **插件在 `-p` 里：** `/plugin` 命令不可用，已安装的插件会加载；一次性加载本地插件用 `--plugin-dir <路径>`（不落盘安装）。
- **留证据：** `--output-format stream-json` 的 `system/init` 事件列出会话元数据（模型、工具、MCP、已加载插件），可以在每次 run 里存下来，证明原生组确实没加载任何 skill / 插件。
- **我没有实测**：本机 PATH 里没有 `claude` 命令（只有 Claude.app），以上全部来自官方文档。

插件安装默认是 **user 作用域**（写 `~/.claude/settings.json` 的 `enabledPlugins`，并在 `~/.claude/plugins` 下落盘），会污染原生对照组。实验里请只用项目级 `.claude/skills/<name>/` 复制，或 `--plugin-dir`。

---

## 6. 对实验设计的提醒（和仓库搭建会话有关）

1. **钉 SHA、记 CLI 版本。** 本次看到的几个仓库一天内就有多次提交（taste-skill、impeccable、MengTo/Skills）。`candidates.json` 里每个候选都有 `repo_head_sha`，收录时用它。
2. **原生组的隔离基线（本机，调研结束时核对）：** `~/.claude/skills` 不存在；`~/.agents/skills` 不存在；`~/.codex/skills` 只有 `.system`；`~/.claude/plugins` 只有 `plugin-directory-cache-v2.json`。但登录 claude.ai 后，账号侧启用的插件会在交互会话启动时同步进来（`<name>@synced`），建议原生组 run 前跑一次 `claude plugin list`，并用 `stream-json` 的 `system/init` 留证。
3. **Codex 的 `.system` skill 对所有格子可见**（imagegen、openai-docs、review-agent、skill-creator、skill-installer），与网页样式无关，但属于固定背景，gallery 页面里写一句即可。
4. **v0 的三个 skill 都不需要全局安装。** 复制进每个格子的工作目录（`.claude/skills/<name>/` 与 `.agents/skills/<name>/`）即可。ui-ux-pro-max 若走官方 CLI 安装，`npm install -g` 会改全局环境，建议在单独的临时目录里用一次性方式取出生成物再复制。
5. **许可证与收录方式：** 三个 v0 skill 都允许再分发，但三者要求保留的文件不同——frontend-design 带它目录里的 `LICENSE.txt`；ui-ux-pro-max 带仓库根 `LICENSE`；frontend-skill 带它目录里的 `LICENSE.txt`。如果更倾向「仓库里只放安装脚本 + pinned SHA，不放 skill 文件」，就没有再分发问题，只需要 README 里标明来源与许可证。vercel 的 web-design-guidelines 在没有 LICENSE 文件之前不要收文件。

---

## 7. 没能核实的部分

- 两个 CLI 里各个 skill 的**实际触发表现**（本机没有 `claude` 命令；`codex exec` 下 `$name` 是否触发，文档没写、我没跑）。
- OpenAI 删除 `frontend-skill` 的**原因**。
- ui-ux-pro-max：`uipro init` 生成物的实际文件内容（未运行 CLI）；插件会注册 7 个 skill 是推断。
- impeccable：完整子命令清单、引擎二进制的许可证、遥测行为（只读了 README）。
- taste-skill：skills.sh 榜上同作者另外三个条目（high-end-visual-design、redesign-existing-projects、minimalist-ui）在当前 HEAD 里不存在，历史位置未查；`npx skills add` 是否只装项目级。
- MengTo/Skills：绝大多数子 skill 没读，只看了两个 frontmatter。
- 未打开的仓库或条目（只取了 stars/许可证或排行榜行）：`microsoft/skills`（`frontend-design-review`，3,147★ MIT）、`google-labs-code/stitch-skills`（`shadcn-ui`、`design-md`，8,588★ Apache-2.0）、`zarazhangrui/frontend-slides`（31,262★ MIT，幻灯片类，按范围排除）、`wshobson/agents`、`mxyhi/ok-skills`、skills.sh 上的 `uizze.sh / ui-taste`（约 729K 安装，没找到对应 GitHub 仓库）。详见 JSON 的 `excluded_or_not_examined`。
- 榜单口径：skills.sh 页面没有日期；Skillselion 页面本身取不到内容，只引用了搜索摘要里的数字；Bitdoze 的 stars 是 2026-08 的快照，已被我 2026-10-25 的 API 数字取代。

---

## 8. 来源索引

- GitHub API（只读）：`https://api.github.com/repos/{anthropics/skills, openai/skills, vercel-labs/agent-skills, nextlevelbuilder/ui-ux-pro-max-skill, pbakaus/impeccable, Leonxlnx/taste-skill, ConardLi/garden-skills, emilkowalski/skills, MengTo/Skills, elayadesign/ai-design-skills}`（stars、HEAD、路径提交、文件树）
- 榜单 / 列表：[skills.sh](https://skills.sh)、[Bitdoze 对比（2026-08-28）](https://www.bitdoze.com/best-ai-skills-for-web-design/)、[Composio Top 10（2026-05-05）](https://composio.dev/blog/top-design-skills)、[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)、[travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- 官方文档：[Claude Code Skills](https://code.claude.com/docs/en/skills)、[Headless](https://code.claude.com/docs/en/headless)、[Plugins](https://code.claude.com/docs/en/discover-plugins)、[Codex Skills](https://developers.openai.com/codex/skills)、[Codex 非交互](https://developers.openai.com/codex/noninteractive)
- 各 skill 的 SKILL.md / LICENSE 固定链接见 [candidates.json](candidates.json) 每个候选的 `skill`、`license`、`sources` 字段。
