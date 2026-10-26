# skill-gallery 第二批候选（batch 2）

核实时间：2026-10-26 05:08 UTC（北京时间 13:08）。机器可读版本在 [candidates.json](candidates.json)（已补入本批的选中项、新发现项，字段格式不变）。第一轮调研见 [candidates.md](candidates.md)。

方法与约束同第一轮：GitHub 只读 API 取 stars / SHA / 文件树；SKILL.md 与脚本只读（scratchpad 下新建空目录里的浅克隆，没有执行任何一个 skill 脚本）；没有往任何全局目录装 skill，没有 commit、发帖、提 issue、点 star。**没有实际跑过 `claude -p` / `codex exec`**，下面所有「会怎样」都是对 SKILL.md、脚本、运行脚本和题目文本的静态阅读推断，已逐条标明。

---

## 1. 结论

**选中的 3 个**（顺序即建议的运行顺序）：

| # | skill | 路线 | 要不要改运行脚本 | 主要风险 |
|---|---|---|---|---|
| 1 | [`Leonxlnx/taste-skill`](https://github.com/Leonxlnx/taste-skill/tree/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill)（frontmatter 名 `design-taste-frontend`，v2.1.5） | 研究出来的「方向库」+ 抽方向 + 真实图片 + 浏览器检查器，严格的反 AI 味白名单 | **要**（保留并展示本地资源文件，见第 3 节） | 与题目的「不准远程图片、只写一个文件」有正面冲突，Codex 沙箱无网络；先跑金丝雀 |
| 2 | [`addyosmani/agent-skills` → `frontend-ui-engineering`](https://github.com/addyosmani/agent-skills/tree/aeac41d4d005999432bb7312f7ff06383a91d59d/skills/frontend-ui-engineering) | 工程质量路线：无障碍、状态覆盖（加载/空/错误）、间距与语义色板、「避开 AI 美学」清单 | 不用 | 视觉差异可能比较小；SKILL.md 默认项目里有设计系统，没有时靠模型自己定 |
| 3 | [`anthropics/skills` → `theme-factory`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/theme-factory) | 预设主题路线：10 套固定色板 + 字体搭配，或现场生成新主题 | 不用 | 流程写的是「让用户挑主题并等待确认」，一次完成下可能停下来问；主要为幻灯片写的，用在网页上是延伸用法 |

三个都满足：知名（见各自小节）、路线与 v0 的三个（frontend-design 的设计方向 + 自查、ui-ux-pro-max 的数据库检索、web-design-engineer 的 HTML 优先 + 风格配方）不同、**不改题目的前提下能跑**。

**备选**（第 1 个金丝雀不过时按顺序顶上）：

1. `elayadesign/ai-design-skills` → `landing-page-design`（MIT，单个 SKILL.md，只对落地页那题有用，知名度低：skills.sh 1.8K 安装）。
2. `emilkowalski/skills` → `emil-design-eng`（见 4.4，截图基本看不出差异，等有动效录屏再收）。
3. taste-skill 的旧版（现在在 `Leonxlnx/taste-skill-classics`，只有 SKILL.md，可用原名安装，见 3.7 和第 9 节）。

**被排除的**（原因见第 4、5 节）：`ui-taste`（没有公开源码）、`huashu-design`、`oil-ui`、`impeccable`（三个都在「先问用户、等选择」的门上停下）、`MengTo` 合集里最像的 `build-awwwards-quality-sites`（规则与题目冲突）、`google-labs-code/stitch-skills`（需要 Stitch MCP）、`web-artifacts-builder`（装 pnpm、联网装包）、`web-design-guidelines`（审查器、规则运行时联网拉取）。

**有一件事得先告诉你**：taste-skill 在 skills.sh 上的 677.8K 安装，我推断主要是它旧版（只有 SKILL.md 的指引型）累积的（首次收录 2026-02-21，带脚本的 v2 才发布 13 天）。2026-10-13 起仓库改写成带脚本的 v2，10-19 又清成「只留一个 skill」，现在 `npx skills add … --skill design-taste-frontend` 装到的就是带脚本的 v2.1.5，skills.sh 页面上的内容摘要（三个旋钮：variance / motion / density）还是旧版的。画廊展示的应该是读者今天装到的那个，所以我选 v2.1.5；但它是目前所有候选里最重的一个，所以要先跑金丝雀。

**更正（第 9 节）**：我上一版写「旧版在当前 HEAD 里不存在、读者装不到」是错的。旧版没有消失，而是搬到了 [`Leonxlnx/taste-skill-classics`](https://github.com/Leonxlnx/taste-skill-classics)，保留原安装名（`high-end-visual-design`、`minimalist-ui` 等），今天仍然可以装。

---

## 2. 逐个核实：被要求补查的四项

### 2.1 `google-labs-code/stitch-skills`（`design-md`、`shadcn-ui`）→ 排除

- 仓库：[`google-labs-code/stitch-skills`](https://github.com/google-labs-code/stitch-skills)，8,595★，Apache-2.0（LICENSE 文件已打开确认是 Apache 2.0 全文），HEAD `0337446dadde6f8c94210444e2aa9d546126480f`（2026-08-17）。
- `design-md`（`plugins/stitch-utilities/skills/design-md`，路径最后提交 `5532ce08bb`，2026-05-10）：分析 **Stitch 项目** 里已有的屏幕，合成 `DESIGN.md`；frontmatter 的 `allowed-tools` 是 `stitch*:*`，skills.sh 页面写明需要 Stitch MCP Server 和一个已设计好的 Stitch 项目。它**不产出网页**，产出的是设计说明文件。skills.sh 64.7K 安装。
- `shadcn-ui`（`plugins/stitch-build/skills/shadcn-ui`，最后提交 `a6f6cadc65`，2026-07-21）：把 shadcn/ui 组件装进应用，`allowed-tools` 含 `shadcn*:*`、`mcp_shadcn*`（需要 shadcn MCP）；面向 React 工程，不是单文件 HTML。
- 同仓库的 `stitch-design/generate-design`、`stitch-build/react-vite-dashboard` 同样依赖 Stitch MCP。
- 结论：都需要外部 MCP / 账号，不改题目就跑不起来。

### 2.2 `MengTo/Skills` 合集里最像网页样式类的一个 → `build-awwwards-quality-sites`，但与题目冲突，不选

- 合集：[`MengTo/Skills`](https://github.com/MengTo/Skills)，7,029★，MIT（Copyright (c) 2026 Meng To）。`agent-skills/web-design/` 下有约 100 个小配方（风格、效果、WebGL、GSAP、定价页、落地页等），`agent-skills/ui/` 下有 3 个「反 AI 味」skill。
- 最像一个完整网页风格 skill 的是 [`web-design/build-awwwards-quality-sites`](https://github.com/MengTo/Skills/tree/a45892d2fdadab75b31fb16abecc02f101b31c43/agent-skills/web-design/build-awwwards-quality-sites)（SKILL.md 7.2KB + `agents/openai.yaml`，路径最后提交 `61239697f1`，2026-07-25；合集 HEAD `a45892d2fdadab75b31fb16abecc02f101b31c43`）。
- 冲突点（逐条读 SKILL.md）：
  - 「**不要用模型写的 SVG、CSS 或 canvas 路径画插画**，用生成的或授权的透明 PNG 抠图」——题目要求图片只能是内联 SVG 或 CSS。
  - 「用 Iconify 的 Solar 图标」「Iconify SVG Logos / Logo Ipsum」——外部图标源。
  - 「选并点名至少一个**已安装**的 web-design skill」——依赖别的 skill 同时在场，单独跑没有对象。
  - 「运行 production build」——假设有工程。
  - 「GSAP + 二选一 Lenis/Locomotive + 可选 Three.js」——允许 CDN，这一条不冲突。
- 其余配方（如 `landing-page`、`product-proof-saas`、`editorial-portfolio-chapters`）是更小的单风格配方，各自一个 SKILL.md；只抽样读了 frontmatter，没有逐个评估。要收的话得先挑具体一个，合集本身不是一个 skill。
- 结论：不选。若以后要收，建议挑一个小配方，而不是这个。

### 2.3 skills.sh 上的 `uizze.sh / ui-taste` → 找不到源码仓库，排除

- skills.sh 条目：`ui-taste`，来源显示为域名 `uizze.sh`，729K 安装（[claudemarket 镜像页](https://www.claudemarket.ai/skills/source/uizze.sh/ui-taste)的「View on GitHub」链接指回 `https://uizze.sh`，不是 GitHub；该页同时给出站内评分 69/100，provenance 一项很低）。安装命令是 `npx skills add https://uizze.sh --skill ui-taste`。
- 官方仓库 [`uizze/uizze`](https://github.com/uizze/uizze)（68★，MIT，2026-07-15 创建）的 README 第 56 行明确写：「UI Taste and iOS Design are distributed only from `https://uizze.sh`, not mirrored in this repository.」所以 **ui-taste 没有公开源码，无法固定 SHA，也找不到它自己的 LICENSE 文件**。
- 同仓库公开的是 `anti-ui-slop`、`ui-design`（Apache-2.0）等，内容来自 impeccable 的剧本（`LICENSING.md` 里写明了出处）；这几个 star 很低（仓库 68★），不满足「知名」。
- 结论：按你的规则（找不到就排除）排除。

### 2.4 `emilkowalski/skills` → `emil-design-eng`：偏动效，截图基本体现不出差异，不选

- 数据：49,675★，MIT（Copyright (c) 2026 Emil Kowalski），skills.sh 387.8K 安装（首次收录 2026-03-16，三项安全审计均 Pass），HEAD `2d228630ba1446365f614a108cb8252f1feda202`（2026-10-11），skill 路径最后提交 `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`（2026-09-15）。单个 SKILL.md，26.5KB，无脚本。
- 内容：逐节读目录，几乎全是动效与交互手感：该不该动画、缓动曲线、时长、弹簧、`scale(0)` 禁忌、popover 的 transform-origin、`@starting-style`、`clip-path` 动画、拖拽/手势、只动 `transform` 和 `opacity`、`prefers-reduced-motion`、stagger、慢动作调试。**没有色板、字体、版式、首屏构图方面的指导。**
- 对画廊截图的影响：`scripts/screenshot.mjs` 按文档是「全页 PNG，截图前关掉 CSS 动画（有限动画直接跳到终态）」，hover、过渡、入场 stagger、弹簧都不会出现在 PNG 里；差异只会出现在站内的实时 iframe 查看器里（`sandbox="allow-scripts"` 的 iframe，动效会跑）。所以**用静态截图看不出它的效果**；要体现，得加几秒钟的录屏或悬停状态序列帧，这是新的取证功能。
- 一个陷阱：SKILL.md 规定「第一次被调用且没有具体问题时，只回复一句固定的话」。我们的题目带完整任务，应该不会触发，但没实测。
- 同仓库的 `apple-design`（skills.sh 244.2K 安装，2026-07-09 收录）同样是「Apple 式流畅界面」的动效物理（弹簧、速度、可打断），属于同一类，处理方式相同。
- 结论：知名度很高（388K 安装），值得以后收，但要先有动效取证。放入备选第 2 位。

---

## 3. 重点评估：taste-skill

### 3.1 基本信息

| 项 | 内容 | 来源 |
|---|---|---|
| 仓库 / 路径 | `Leonxlnx/taste-skill` / `skills/taste-skill` | [tree](https://github.com/Leonxlnx/taste-skill/tree/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill) |
| pinned SHA | **`12af471f627f866411b4bd785b19646d3672784c`**（tag `v2.1.5`，2026-10-24；仓库 HEAD 与 tag 相同）。skill 目录最后提交 `af8a897996e159ccc89c9da535dff714d5dba62d`（同日） | [commit](https://github.com/Leonxlnx/taste-skill/commit/12af471f627f866411b4bd785b19646d3672784c) |
| frontmatter `name` | **`design-taste-frontend`**（目录名是 `taste-skill`，两者不同） | [SKILL.md](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/SKILL.md) |
| 许可证 | MIT，仓库根 [LICENSE](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/LICENSE)（已打开：Copyright (c) 2026 Leonxlnx）。skill 目录里没有 LICENSE，收录时要带根 LICENSE（`fetch-skill.mjs` 已会存成 `LICENSE.upstream`）。示例截图里的图片有各自署名（`examples/v2/CREDITS.md`），不在 skill 目录内 | 同上 |
| 知名度 | 102,578★；skills.sh `design-taste-frontend` 677.8K 安装（首次收录 2026-02-21），页面上 Socket 与 Snyk 两项审计是 **Warn**（页面没给原因，v2 脚本会联网下载并启动 Chrome，我推测与此有关，未核实）；同作者 `high-end-visual-design`、`minimalist-ui` 等条目在榜上，但当前 HEAD 里不存在（已搬到 `Leonxlnx/taste-skill-classics`，同名可装，见第 9 节） | [skills.sh](https://skills.sh/leonxlnx/taste-skill/design-taste-frontend) |
| 大小 | 39 个文件、2.4MB（Node 脚本、`library/*.json` 方向库、`references/*.md`、`assets/`） | tree |
| 版本节奏 | 2026-10-13 的 v2.0.0 到 10-24 的 v2.1.5 共 7 次发布；今天（10-26）仍在推送 | [tags](https://github.com/Leonxlnx/taste-skill/tags) |

### 3.2 要求的运行环境

- Node 22+（`cdp.mjs` 用内置 `WebSocket`，没有就直接抛错）+ 本机 Chrome / Edge / Chromium（`findChrome()` 会找 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`）。本机：Node v22.18.0，`/Applications/Google Chrome.app` 在。
- 运行脚本的 `isolatedPath()` 把 `process.execPath` 所在目录放进 `PATH`，所以用 Node 22 启动运行脚本时，skill 里的 `node …/scripts/*.mjs` 能找到 node。
- `assets.mjs` 需要联网（Openverse、Wikimedia Commons、Art Institute of Chicago、The Met、Internet Archive、NASA）；无 API key。
- 脚本把 Chrome 的临时 profile 建在 `TASTE_SKILL_TMP || tmpdir()`（运行脚本里 `TMPDIR` 是一次性目录，OK）；Chrome 是直接 spawn 的，没有传 `--use-mock-keychain`，靠运行脚本已有的一次性 keychain 兜住（docs/running.md 里的 macOS keychain 一节）。
- `draw.mjs` 会往 `~/.taste-skill/history.json` 写历史（`HOME` 是一次性目录，写失败被 try/catch 吞掉，不影响）。
- **Codex 格**：`sandbox_mode = "workspace-write"`，**没有网络**。`assets.mjs` 拿不到任何东西；`inspect.mjs` 要在 `127.0.0.1` 随机端口起一个本地 HTTP 服务并启动 Chrome，沙箱里能不能做到我不确定（Codex 以前的 v0 记录里有 agent 在沙箱里用 Playwright 的先例，但那不能证明这里能行）。SKILL.md 对这两种情况都写了降级条款：「No network. … draw the pictures and say in the report」「No Chrome or Node 22. Run lint.mjs … take screenshots with whatever browser tool you have」。

### 3.3 在题目约束下实际会怎样（静态阅读推断，未实测）

我把 SKILL.md、`draw.mjs` 打印的「方向单」、`inspect.mjs`/`rules.mjs` 的检查项，和三道题的「Output requirements」逐条对照：

| 题目要求 | skill 要求 | 预期 |
|---|---|---|
| 只写**一个** `index.html`，HTML/CSS/JS 都在里面 | 「从项目根目录运行」，工作文件落在 **`.taste-skill/`**（`direction.json`、`inspect/` 截图和 `report.json`、`scenes/`、`app/`）；可选从 `assets/base.css`、`base.js` 起步；方向单抽到滚动场景时要求「Copy the shared stage and the scene's files from `<skill>/assets/scenes/`」（`stage.js`、`stage.css`、场景 js/css，stage.js 里固定版本 CDN 加载 GSAP 与 Lenis）；看板走 `assets/app.css` + `assets/charts.js` | `.taste-skill/` 几乎一定会出现（这是 skill 流程自带的草稿目录）。把 base.css / scenes / app.css / charts.js **内联进 index.html** 还是写成 `<link>`/`<script src="assets/…">` 引用，取决于模型怎么权衡题目和 skill；我没法在不执行的前提下确定。引用就会产生运行脚本当前**保存不下来**的文件 |
| **不要引用远程图片**，图片只能是内联 SVG 或 CSS | SKILL.md：「at least four real pictures on the page … **SVG drawings do not count**」，检查器规则 `few-pictures` 是 **FAIL**，且「Fix every FAIL」；方向单把 **`https://picsum.photos/id/<id>/<w>/<h>` 远程图片地址**列在「Imagery」里让 agent 取用（`draw.mjs` 第 84、531 行，`references/imagery.md` 第 184、299 行的示例也是 `<img src="https://picsum.photos/…">`）；`assets.mjs --get` 把找到的图下载到 **`assets/`** 并写 `assets/credits.json` | **这是最大的冲突点。** 可能的结果：（a）按题目办，用内联 SVG/CSS，检查器 FAIL 但不管；（b）直接用方向单里的 picsum 地址，被运行脚本的扫描器记成 `remote_image` 违规；（c）Claude 格联网下载图片放进 `assets/`，页面引用本地相对路径——不算「远程」，但违反「只写一个文件」，且现有脚本不保存这些文件；（d）下载后转 base64 内联进 index.html——扫描器看不出来，也没违反 `http(s)` 规则，但不是「内联 SVG 或 CSS」。我预计 Claude 格会出现（b）(c)(d) 中的一种或几种，Codex 格因无网络多半是（a）或（b） |
| 看板题 | 「应用屏」模式（`references/app-screens.md`）：没有 hero、没有图片门槛（`rules.mjs` 第 199 行注释），自己的 `draw.mjs --app` | 冲突最小；主要风险是引用 `assets/app.css`、`assets/charts.js` 而不内联 |
| 落地页题（Rotaline，软件产品） | 软件产品的「图片」可以用自己界面的 HTML 片段（根节点带 `data-ui`），检查器把它们算作图片 | 能在不用位图的情况下满足图片门槛，压力小 |
| 博客/作品集题（Maya，虚构的人） | 虚构作品要「画成作品的成品静帧」，仍要 4 张以上位图；`assets.mjs` 会去找潮汐表、旧地图一类的档案图（题目里恰好有 tide table） | 压力最大，最可能出现（b）(c)(d) |
| 一次完成，不要追问 | 「If the request is vague, decide and state your reading in one line instead of asking. Ask only when a missing fact blocks the work」 | 兼容，不会停下来问 |
| 允许 Google Fonts 和 CDN | 方向单里有 Google Fonts `<link>`（`app-draw.mjs` 第 131 行），stage.js 用固定 CDN | 兼容 |
| 页面直接从磁盘打开 | 检查器用本地服务器打开；SKILL.md 另要求「if the page must also open straight from the file system, open index.html that way once」 | 兼容，前提是引用的本地文件还在旁边 |

另外三点会影响这个格子的结果：

- **时间和成本**。流程是：读 brief → 盘点题材 → 写论点 → `draw.mjs` 抽方向 → 选方向 → 找图 → 写站 → `lint`/`inspect`（1440/768/390 三个宽度）→ 看截图写评审（最多 3 轮）→ 做动效层（要求至少 8 个会动的元素）→ 再检查 → 报告。比 v0 任何一个 skill 都长得多；`SG_TIMEOUT_MIN` 默认 60 分钟，我估计不够稳，建议这几个格子设 120（估计，未实测；README 第 134 行自述一次构建约 30–45 分钟、几十万 token）。
- **滚动场景和全页截图**。方向单可能抽到「钉住的舞台 + 滚动驱动」的场景，用 Lenis 平滑滚动。`screenshot.mjs` 的全页 PNG 对 `position: sticky` / `100vh` 舞台本来就会失真（docs/running.md 已写明），这类页面的缩略图可能看起来很怪，站内实时 iframe 才是真实效果。
- **「只写一个文件」被 skill 自己的流程违反是必然的**（`.taste-skill/`），所以这一格的 `run.json` 里 `output.other_files` 一定非空；展示时要把它当成「skill 的草稿目录」，不是违规。

### 3.4 运行脚本要怎么改（才能把本地资源和页面一起保留、并能正常显示）

**原则**：不改题目；index.html 照旧是唯一被评审的交付物；它引用到的**本地相对路径文件**必须一起保留并发布；草稿目录不保留；每个例外都写进 `run.json`，让读者看到「这一格写了多个文件」。

| 文件 | 现状 | 改动 |
|---|---|---|
| `scripts/lib/common.mjs` → `collectOutput(work, out, ignoreTop)` | 只拷 `index.html`；其余文件只记路径和字节数进 `other_files`，随后临时目录被删，文件丢失 | ① `ignoreTop` 增加 `.taste-skill`、`node_modules`、`.git`（可做成 `meta.yaml` 里每个 skill 的 `output.ignore`）；② 拷完 index.html 后，用 `scanExternalRefs` 里那套正则解析 **非 http(s)、非 `data:`、非 `#`/`mailto:`** 的相对引用（`src`、`href`、`srcset`、`poster`、`data`、`url()`、`@import`），解析成 work 目录内的路径（拒绝越出 work 目录），按**相同的相对路径**拷进 `out/`；③ 名字与运行产物冲突的（`desktop.png`、`mobile.png`、`run.json`、`transcript.jsonl`）不覆盖，记为冲突；④ 写入 `output.kept_assets: [{path, bytes, sha256}]` 和 `output.missing_local_refs: [...]`；⑤ 总量上限（比如每格 25MB，环境变量可调），超了只记不拷；⑥ 可选：把 `.taste-skill/direction.json` 和 `.taste-skill/inspect/report.json`（几 KB）存成 `out/evidence/`，证明方向单和检查器真的跑过，**不要**保留里面的截图 |
| `scripts/run-claude.mjs`、`scripts/run-codex.mjs` | `failures` 里没有本地引用检查 | 当 `missing_local_refs` 非空时加 `broken_local_ref`；另外在 `rule_violations` 里加一个可展示的 `extra_files`（`kept_assets` 非空），语义是「写了不止一个文件」，不算失败 |
| `scripts/scan-refs.mjs` | 只重算 http(s) 引用 | 同步重算 `kept_assets` / `missing_local_refs`（它是「改了扫描器后重算」的工具） |
| `scripts/screenshot.mjs` | 用 `file://…/runs/<cell>/index.html` 打开 | **不用改代码**——只要资源按相同相对路径放在 index.html 旁边就能加载。它已经把失败请求写进 `run.json`；建议把「本地文件 404」也计入 `missing_local_refs` |
| `scripts/build-site.mjs` | `CELL_FILES = ['index.html','desktop.png','mobile.png','run.json']`，只复制这四个；查看器是 `<iframe sandbox="allow-scripts" src=…/index.html>`；还有一个 `download="index.html"` 按钮 | ① 复制 `output.kept_assets` 列出的文件到站点输出的同样相对路径下，iframe 才能加载到图片/脚本；② **「下载 index.html」按钮**对有 kept_assets 的格子要么隐藏，要么改成提示「依赖旁边的文件」，否则读者下载到的是一张破页面；③ `refs`（外部请求列表）不受影响 |
| `docs/run-schema.md` | — | 记录 `output.kept_assets`、`output.missing_local_refs`、`rule_violations: extra_files`、`evidence/` |
| 环境变量 | `SG_TIMEOUT_MIN` 默认 60 | taste-skill 格设 120 |

**仓库体积**：每格可能多出几 MB 图片；`runs/` 是提交进 git 的，建议在 `meta.yaml` 或环境变量里给个上限，必要时只保留页面真正引用的文件（上面第②步已经是这样）。

### 3.5 安装与调用

| | Claude Code | Codex |
|---|---|---|
| 项目级安装（实验用） | 把 `skills/taste-skill/` 整个目录复制为 `<项目>/.claude/skills/design-taste-frontend/` | 复制为 `<项目>/.agents/skills/design-taste-frontend/` |
| 为什么目录名要用 `design-taste-frontend` | 运行脚本的 `copySkill` 用 `meta.name` 当目标目录名，`skill_listed` 检查用 `meta.name` 对比 `system/init` 的 skill 清单，而 Claude Code 列表里的名字取 frontmatter 的 `name` | Codex 的 `$名字` 取 frontmatter 的 `name`；目录名保持一致最稳 |
| 调用（沿用你们的格式） | `Use the design-taste-frontend skill.` | `Use the $design-taste-frontend skill.` |
| 其它官方安装方式（**实验里不要用**） | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`（`npx skills` CLI，是否默认装到全局目录未核实）；插件 `/plugin marketplace add Leonxlnx/taste-skill` + `/plugin install taste-skill@taste-skill`；`./install.sh` 会往 `~/.claude/skills` 建符号链接 | `codex plugin marketplace add Leonxlnx/taste-skill` + `codex plugin add taste-skill@taste-skill`（运行脚本里 `plugins = false`） |

兼容性小提示：Codex 源码对 skill 的 `name` 限 64 字符、`description` 限 1024 字符（`codex-rs/skills/src/interface.rs` 的 `MAX_NAME_LEN`、`MAX_DESCRIPTION_LEN`）；taste 的 description 是 948 字符，在限内但余量不大。我把 frontmatter 用 `yaml` 包解析过，是合法的（`name` + `description` 两个字段）。

`skills/design-taste-frontend/meta.yaml` 草稿（仓库现有格式；`fetch-skill.mjs` 的 sparse checkout 会取 `/skills/taste-skill/` 和根 LICENSE）：

```yaml
name: design-taste-frontend          # frontmatter name; upstream folder is skills/taste-skill
summary: >-
  Art-direction skill for websites and app screens. Deals three researched
  directions from a library of 247 studied sites, builds the page from the
  chosen blueprint, then checks it in a real browser with a bundled inspector.
  Instructions plus Node scripts; needs Node 22+, Chrome, and network for found pictures.
research_id: leonxlnx-taste-skill   # research/candidates.json

upstream:
  repo: https://github.com/Leonxlnx/taste-skill
  commit: 12af471f627f866411b4bd785b19646d3672784c   # tag v2.1.5
  path: skills/taste-skill
  skill_md: https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/SKILL.md

license:
  spdx: MIT
  file: https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/LICENSE
  in_skill_folder: false
  copyright: Copyright (c) 2026 Leonxlnx

fetch:
  method: git

install:
  claude: Copy the folder to <project>/.claude/skills/design-taste-frontend/
  codex: Copy the folder to <project>/.agents/skills/design-taste-frontend/

invoke:
  claude: "Use the design-taste-frontend skill."   # interactive: /design-taste-frontend <task>
  codex: "$design-taste-frontend"                   # e.g. "... Use the $design-taste-frontend skill."

notes:
  - The upstream folder name (taste-skill) differs from the skill name (design-taste-frontend); the gallery installs it under the skill name.
  - Writes working files to .taste-skill/ and may download pictures to assets/; the run scripts keep files that index.html references (see research/batch2.md).
  - Codex cells have no network, so the picture search step cannot run there.
  - Upstream released v2.0.0 to v2.1.5 within 12 days; always use the pinned commit.
```

### 3.6 金丝雀方案（正式跑 6 格之前）

用 `SG_KEEP_TMP=1`，先跑 **`blog-portfolio`**（最容易触发图片冲突）和 **`landing-saas`**，各在 Claude 和 Codex 上一格，共 4 格：

1. `skill_triggered`、`skill_evidence.skill_content_loaded` 是否为 true（名字对不对）。
2. `activity`（工具调用次数）里有没有大量 Bash；留下的临时目录里 `.taste-skill/direction.json` 是否存在（说明 `draw.mjs` 真的跑了）；`.taste-skill/inspect/report.json` 是否存在（`inspect.mjs` 是否跑起来）。
3. `output.other_files`：除了 `.taste-skill/`，还有没有 `assets/`、`credits.json` 等。
4. `external_refs` / `rule_violations`：有没有 `picsum.photos`、有没有 `remote_image`。
5. `index.html` 里有没有指向本地相对路径的 `src`/`href`（决定第 3.4 节的改动是不是必须）。
6. 用时与花费（`duration_ms`、`usage.total_cost_usd`）；Codex 格看 `inspect.mjs` 能不能在沙箱里启动 Chrome。
7. 取回的 `index.html` 直接从磁盘打开是否完整。

**判定**：（1）(2) 不通过就是装法问题，先修；（5）有本地引用则必须先做 3.4 的改动再跑正式格；其余违规属于「结果」，如实记录并展示，不要为了好看去改题目。**撤退条件**：金丝雀 `no_index_html`、或每格超过 2 小时、或 Codex 格因沙箱无法运行脚本而完全退化成没有 skill 的效果，则换成备选 1（landing-page-design）或 3.7 的 classics 版。

### 3.7 旧版（撤退选项）——已更正

上一版这一节写错了。taste-skill 的 README 有一节「Moved skills」（[README.md 第 140–156 行](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/README.md)）：「This repo holds one skill, `design-taste-frontend`. The others moved to repos of their own and kept their install names」。旧版现在在 [`Leonxlnx/taste-skill-classics`](https://github.com/Leonxlnx/taste-skill-classics)（HEAD `5e08c9383dc4ad7fc0df70e1ac8cfa09ec356305`，2026-10-19，MIT），其中和撤退相关的是：

- `design-taste-frontend-v1`（目录 `skills/taste-skill-v1/`，21KB 单个 SKILL.md，无脚本）：「The original taste-skill」，顶部有三个 1–10 的旋钮（DESIGN_VARIANCE、MOTION_INTENSITY、VISUAL_DENSITY）。skills.sh 上 `design-taste-frontend` 的历史安装数大概率主要来自这一类（推断）。
- 它们都带 `disable-model-invocation: true`，见第 9 节的运行注意事项。

撤退时优先用这个，而不是我上一版写的 `archive/taste-skill-v1.9` 标签（那个只有 git 历史里能取到，不是读者能装的东西）。

---

## 4. 另外两个选中的 skill

### 4.1 `frontend-ui-engineering`（Addy Osmani）

| 项 | 内容 |
|---|---|
| 仓库 / 路径 | `addyosmani/agent-skills` / `skills/frontend-ui-engineering` |
| pinned SHA | **`aeac41d4d005999432bb7312f7ff06383a91d59d`**（HEAD，2026-10-13）；skill 路径最后提交 `3e1e0a2db595ab2abe89b1204f7eabb67a24eb90`（2026-10-03，「Bind the frontend error-state retry callback」） |
| 许可证 | MIT，仓库根 [LICENSE](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/LICENSE)（已打开：Copyright (c) 2025 Addy Osmani）；skill 目录里没有 LICENSE（`in_skill_folder: false`） |
| 知名度 | 仓库 110,557★；skills.sh 67.2K 安装（首次收录 2026-02-16）；非官方，作者 Addy Osmani；仓库里共 25 个 skill |
| 输出形态 | 单个 SKILL.md（11.7KB），无脚本、无资源。末尾「See Also」指向 `../../references/accessibility-checklist.md`（5.2KB，在 skill 目录外）；只复制 skill 目录时这个链接会悬空，agent 读不到——影响很小，但要在 meta 里写一笔 |
| 路线 | 「像一个有设计意识的工程师做的，而不是 AI 生成的」：组件结构与状态管理、设计系统遵循（语义色板、间距刻度、字体层级）、「Avoid the AI Aesthetic」对照表（紫/靛蓝、满屏渐变、全圆角、泛用 hero、重阴影等）、WCAG 2.1 AA、键盘与焦点、空/错误/加载状态、320/768/1024/1440 响应式、过渡与加载。**不是美学方向型**，预期的差异在无障碍结构、状态覆盖、令牌化的间距和颜色，而不是气质 |
| 对题目的冲突 | 无硬冲突。默认前提是「项目里有设计系统」，没有时模型自己定；示例是 React/TS，单文件里自然改写；「Verification」里提到 axe-core 和 dev tools，agent 跑不了就跳过；「Reference-led UI quality」说要先搜参考站，Claude 格有 WebSearch、Codex 格没有 |
| 一次完成 | 没有先问用户的门（同仓库的 `interview-me` 是另一个 skill） |
| Claude Code | 复制为 `<项目>/.claude/skills/frontend-ui-engineering/`；`Use the frontend-ui-engineering skill.`。插件方式（`/plugin marketplace add addyosmani/agent-skills` + `/plugin install agent-skills@addy-agent-skills`）会装全部 25 个，别用 |
| Codex | 复制为 `<项目>/.agents/skills/frontend-ui-engineering/`；`Use the $frontend-ui-engineering skill.`。原生插件 `codex plugin marketplace add addyosmani/agent-skills` 会读整个 `skills/`，别用 |
| 要不要改运行脚本 | 不用（单文件、不产生额外文件） |

```yaml
name: frontend-ui-engineering
summary: >-
  Engineering-quality front-end skill: accessible, responsive UIs with loading,
  empty and error states, semantic tokens and a table of "AI aesthetic" defaults to avoid.
  Instructions only, no scripts.
research_id: addyosmani-frontend-ui-engineering   # research/candidates.json

upstream:
  repo: https://github.com/addyosmani/agent-skills
  commit: aeac41d4d005999432bb7312f7ff06383a91d59d
  path: skills/frontend-ui-engineering
  skill_md: https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/skills/frontend-ui-engineering/SKILL.md

license:
  spdx: MIT
  file: https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/LICENSE
  in_skill_folder: false
  copyright: Copyright (c) 2025 Addy Osmani

fetch:
  method: git

install:
  claude: Copy the folder to <project>/.claude/skills/frontend-ui-engineering/
  codex: Copy the folder to <project>/.agents/skills/frontend-ui-engineering/

invoke:
  claude: "Use the frontend-ui-engineering skill."
  codex: "$frontend-ui-engineering"

notes:
  - The "See Also" link (../../references/accessibility-checklist.md) points outside the skill folder and is not copied.
  - Part of a 25-skill repo; install only this folder, not the plugin.
```

### 4.2 `theme-factory`（Anthropic）

| 项 | 内容 |
|---|---|
| 仓库 / 路径 | `anthropics/skills` / `skills/theme-factory` |
| pinned SHA | **`dbd4588f9e1033efb41dad4bef2f7947c8993d44`**（HEAD，2026-10-09，与 v0 的 frontend-design 同一提交）；skill 路径最后提交 `b9e19e6f44773509fbdd7001d77ff41a49a486c1`（2026-04-20） |
| 许可证 | Apache-2.0，skill 目录自带 [LICENSE.txt](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/theme-factory/LICENSE.txt)（已打开，201 行，附录里有 `Copyright 2026 Anthropic, PBC.`）。仓库 README 说明本 skill 所在目录属于「open source (Apache 2.0)」那一类 |
| 知名度 | 仓库 183,806★，官方 Anthropic；skills.sh 95.4K 安装（首次收录 2026-01-19）；claudemarket 榜上 90K |
| 输出形态 | 13 个文件、约 135KB：`SKILL.md`（3.1KB）、`LICENSE.txt`、`theme-showcase.pdf`（124KB）、`themes/*.md` ×10（每个约 0.5KB：4 个具名色值 + 标题/正文字体 + 适用场景）。无脚本 |
| 路线 | 预设主题：Ocean Depths、Sunset Boulevard、Forest Canopy、Modern Minimalist、Golden Hour、Arctic Frost、Desert Rose、Tech Innovation、Botanical Garden、Midnight Galaxy，或按描述现场生成一个新主题。**只管色板与字体，不管版式与内容**，所以预期是「模型惯用版式 + 一套固定色板」，截图上差异清楚（颜色），但版式差异小 |
| 对题目的冲突 | SKILL.md 写的流程是「展示 theme-showcase.pdf → 问用户选哪个 → **等待明确确认** → 应用」。一次完成、不准追问的题目下，agent 有两种走法：自己挑一个主题往下做（我预期是主流），或者停下来问（那一格就是 `no_index_html`）。**这是金丝雀要看的重点**。主题文件里的字体是 DejaVu Sans 之类的系统字体（为 PDF/PPT 写的），网页上需要替换成 Google Fonts，题目允许 |
| 适用范围 | description 写了「slides, docs, reportings, HTML landing pages」，正文的 Purpose 一句只提幻灯片。网页是延伸用法，所以它在三个里最「弱」，选它是因为官方、知名、路线不同、零改动 |
| Claude Code | 复制为 `<项目>/.claude/skills/theme-factory/`；`Use the theme-factory skill.` |
| Codex | 复制为 `<项目>/.agents/skills/theme-factory/`；`Use the $theme-factory skill.` |
| 要不要改运行脚本 | 不用 |

```yaml
name: theme-factory
summary: >-
  Anthropic's theme toolkit: ten preset colour palettes with font pairings (or a
  generated custom theme) applied to a finished artifact such as a landing page.
  Colour and type only, no layout. Instructions plus ten small theme files and a showcase PDF.
research_id: anthropics-theme-factory   # research/candidates.json

upstream:
  repo: https://github.com/anthropics/skills
  commit: dbd4588f9e1033efb41dad4bef2f7947c8993d44
  path: skills/theme-factory
  skill_md: https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/theme-factory/SKILL.md

license:
  spdx: Apache-2.0
  file: https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/theme-factory/LICENSE.txt
  in_skill_folder: true
  copyright: Copyright 2026 Anthropic, PBC.

fetch:
  method: git

install:
  claude: Copy the folder to <project>/.claude/skills/theme-factory/
  codex: Copy the folder to <project>/.agents/skills/theme-factory/

invoke:
  claude: "Use the theme-factory skill."   # interactive: /theme-factory <task>
  codex: "$theme-factory"

notes:
  - Written mainly for slide decks; the description also lists HTML landing pages.
  - The documented workflow asks the user to pick a theme and waits; in one-pass cells the agent has to choose.
  - Theme fonts are system fonts (DejaVu Sans etc.) meant for documents.
```

---

## 5. 扫描新冒出来的（2026-10-25 到现在）

覆盖范围：skills.sh（总榜、trending、hot）、claudemarket 的 UI/UX 榜、GitHub 的 topic 与搜索（`agent-skills`、`claude-skills`、`claude-code-skills`、`codex-skills`、`ai-design`、`skill-md`，以及 `pushed:>2026-10-01`、`created:>2026-09-01` 的设计类查询）、VoltAgent / travisvn / Composio 的列表、一轮网页搜索。**说明**：时间窗口只有一天多，真正「新」的东西很少；skills.sh 的 trending / hot 页只能看到被折叠后的部分名次（页面上有大量「+N more」），所以这不是穷尽扫描。

| 发现 | 数据 | 判断 |
|---|---|---|
| [`alchaincyf/huashu-design`](https://github.com/alchaincyf/huashu-design)（花叔Design 3.0） | 26,335★，MIT（Copyright (c) 2026 alchaincyf），2026-04-19 创建，HEAD `4fc7bfdbd5ec3fa2d43ce7a6433de60976a5e4b1`（2026-10-23），claudemarket 榜 48K 安装 | HTML 原生设计 skill，中文写成。**SKILL.md 第 3 条「三方向门」规定：任何新设计先出三个方向的真实初稿给用户选，「摆出来就停，结束回合等用户选，包括无人值守会话」，指定风格也不豁免**；豁免只有「用户本次会话明说跳过」。题目写了「不要追问」，但它要的是用户明说「跳过」；一次完成下大概率停在三个初稿上，没有 `index.html`。另外 skill 目录含 4–5MB 的 mp3 若干，整个仓库 39.8MB。→ **不改题目跑不了**，放备选（若以后允许在题目末尾加一句「跳过方向选择」就可以收） |
| [`oil-oil/oil-ui`](https://github.com/oil-oil/oil-ui) | 2,263★，MIT（Copyright (c) 2026 oil-oil），2026-09-30 创建，HEAD `ff3ed0a88972747840ece9d4cd664807d6f5d501`（2026-10-24），v0.25.0 | 中文写成；「新界面 → 先用文字写出三个风格不同的方向问用户，发给用户后结束这一轮」；还有版本检查脚本 `check_update.sh`。同类「先问再做」的门，且知名度低 → 排除 |
| [`pbakaus/impeccable`](https://github.com/pbakaus/impeccable)（上轮已列 backlog） | 87,972★；HEAD 已是 `3671d50f0ac9a662ce0615e85a256110c9cd720b`（2026-10-25）；claudemarket 榜上 `frontend-design`（impeccable 别名）55K 安装 | 重新读了 `new-work.md`（62KB）：「Before implementation, get the user's answer through the structured question tool … Ask two or three related questions」；还有「decision page」「put in front of the user」的方向选择轮次、会派 finish-reviewer 与 documenter 子 agent、写 `PRODUCT.md`/`DESIGN.md`/`.impeccable/`。流程与「一次完成不追问」直接冲突，且文件体量大（含 1.1MB 的字体索引）→ 仍不适合；若要收，先做一格金丝雀看它会不会停在提问上 |
| [`nexu-io/open-design`](https://github.com/nexu-io/open-design) | 103,996★，Apache-2.0，2026-04-28 创建，HEAD `26d60298f8129e229a1c10aab4df7ca25b1e9ad3` | 是一个设计工作台**应用**，仓库里的 `design-templates/*`（`saas-landing`、`dashboard`、`blog-post` 等）和 `skills/*`（大量收录别人的 skill：`frontend-design`、`emil-design-eng`、`gpt-tasteskill` 等）依赖该应用的 `od:` 元数据与「当前 DESIGN.md」运行时，不是自包含的 skill → 排除 |
| [`wshobson/agents`](https://github.com/wshobson/agents) → `brand-landingpage` | 仓库 41,7xx★ MIT；claudemarket 榜 39K 安装；路径最后提交 `373dc369304e…`（2026-10-04） | Phase 0 要装 Stitch SDK、配 API key、做品牌访谈；description 里写明「用 frontend-design 处理看板」→ 跑不了 → 排除。同仓库 `tailwind-design-system`（skills.sh 70.4K 安装）是 React + Tailwind v4 的令牌体系，偏组件库，不是页面风格 → 不选 |
| `mattpocock/skills` → `design-an-interface`（217K）、`codebase-design`（736K） | 来自 claudemarket 榜 | 名字带 design，但是软件接口/代码库设计，不是网页 → 排除 |
| `heygen-com/hyperframes` → `hyperframes-creative`（628K） | 来自 claudemarket 榜 | HTML 转视频框架，不是网页 → 排除 |
| `arvindrk/extract-design-system`（130K 安装）、`firecrawl/firecrawl-workflows` → `firecrawl-website-design-clone`（33K） | 来自 claudemarket 榜 | 需要给一个现成网址去提取/克隆，不是从题目生成 → 排除 |
| `designed-by-ai/skills` → `design-mobile-apps` | skills.sh 总榜约 1.0M、trending 第 5 名 17.7K | 移动 App 界面，不是网页 → 排除（上轮已排除） |
| `tt-a1i/archify`（89K★）、`cathrynlavery/diagram-design`（61K★） | GitHub topic 搜索 | 画图/图表 skill，不是页面风格 → 排除 |
| `emilkowalski/skills` → `apple-design`（244K 安装） | 见 2.4 | 同 emil-design-eng，偏动效 |
| `superdesigndev/superdesign-skill`（904★）、`bitjaru/styleseed`（989★）、`educlopez/ui-craft`（398★） | GitHub 搜索 | star 都在 1K 以下，没有深读 → 不满足「知名」，未评估 |

没有发现新的官方（Anthropic / OpenAI / Vercel / Google）网页样式 skill：`anthropics/skills` HEAD 仍是 `dbd4588f…`（10-09），技能清单没变；`anthropics/claude-plugins-official` 的 `frontend-design` 仍是同一份；`openai/skills` 的 HEAD 仍是 `49f948faa9…`（06-24）。

---

## 6. 需要运行脚本配合改的地方（汇总）

1. **仅 taste-skill 需要改**（第 3.4 节）：`collectOutput` 保留 index.html 引用的本地文件并记录；`build-site.mjs` 复制这些文件、处理「下载 index.html」按钮；两个 runner 加 `broken_local_ref` 与 `extra_files`；`docs/run-schema.md` 补字段；taste 格 `SG_TIMEOUT_MIN=120`。
2. **meta.yaml 的 `name` 要用 `design-taste-frontend`**，不是目录名 `taste-skill`；`upstream.path` 写 `skills/taste-skill`。
3. 另外两个（frontend-ui-engineering、theme-factory）**不需要改脚本**，直接按 `meta.yaml` 草稿放进 `skills/` 即可。
4. 建议在 `docs/running.md` 的「Known limitations」补一条：taste-skill 的流程在 Codex 格因沙箱无网络，无法执行「找真实图片」一步，这是 Codex 与 Claude 的固有差异，不是 skill 的问题。
5. 先跑金丝雀（3.6），再批量跑。

---

## 7. 没能核实的部分

- 所有「实际会怎样」（taste-skill 的 5 个冲突点、theme-factory 会不会停下来问、两个 CLI 里 skill 的实际触发）。本次任务不允许执行 skill 脚本，也没有跑 `claude -p` / `codex exec`。
- taste-skill 在 Codex 沙箱里能否启动 Chrome、能否绑定 `127.0.0.1` 端口。
- skills.sh 上 taste-skill 两项 **Warn**（Socket、Snyk）的具体原因。
- `npx skills add`（vercel-labs/skills CLI）默认装到项目级还是全局。
- OpenAI 删除 `frontend-skill` 的原因（上一轮遗留）。
- MengTo 合集里除 `build-awwwards-quality-sites` 外的各个小配方（只读了 frontmatter）。
- 排行榜口径：skills.sh 页面无日期，trending / hot 只能看到未折叠的部分；claudemarket 榜没有日期也没有 stars；两处安装数不完全一致（例如 emil-design-eng 387.8K 对 324K、web-design-guidelines 782.7K 对 701K）。
- `wshobson/agents` 的精确 star 数（话题搜索里是 41,7xx，没有单独取）。

---

## 8. 来源

- GitHub API（只读）：`https://api.github.com/repos/{Leonxlnx/taste-skill, addyosmani/agent-skills, anthropics/skills, emilkowalski/skills, MengTo/Skills, google-labs-code/stitch-skills, alchaincyf/huashu-design, oil-oil/oil-ui, pbakaus/impeccable, nexu-io/open-design, uizze/uizze, wshobson/agents}`（stars、HEAD、路径提交、文件树、tag / release 列表）
- 固定链接：taste-skill [SKILL.md](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/SKILL.md)、[scripts/lib/rules.mjs](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/scripts/lib/rules.mjs)、[scripts/draw.mjs](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/scripts/draw.mjs)、[scripts/assets.mjs](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/scripts/assets.mjs)、[scripts/lib/cdp.mjs](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/scripts/lib/cdp.mjs)；[Addy SKILL.md](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/skills/frontend-ui-engineering/SKILL.md)；[theme-factory SKILL.md](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/theme-factory/SKILL.md)；[huashu-design SKILL.md](https://github.com/alchaincyf/huashu-design/blob/4fc7bfdbd5ec3fa2d43ce7a6433de60976a5e4b1/SKILL.md)；[uizze README](https://github.com/uizze/uizze/blob/40b0ee439ba88aecb65d68bcb379da0e716b899e/README.md)
- skills.sh 页面：[总榜](https://skills.sh)、[trending](https://skills.sh/trending)、[hot](https://skills.sh/hot)、[design-taste-frontend](https://skills.sh/leonxlnx/taste-skill/design-taste-frontend)、[emil-design-eng](https://skills.sh/emilkowalski/skills/emil-design-eng)、[apple-design](https://skills.sh/emilkowalski/skills/apple-design)、[theme-factory](https://skills.sh/anthropics/skills/theme-factory)、[frontend-ui-engineering](https://skills.sh/addyosmani/agent-skills/frontend-ui-engineering)、[tailwind-design-system](https://skills.sh/wshobson/agents/tailwind-design-system)、[landing-page-design](https://skills.sh/elayadesign/ai-design-skills/landing-page-design)、[stitch design-md](https://skills.sh/google-labs-code/stitch-skills/design-md)
- 其它：[claudemarket UI/UX 榜](https://claudemarket.ai/skills/best-ui-ux-skills)、[claudemarket ui-taste](https://www.claudemarket.ai/skills/source/uizze.sh/ui-taste)
- 官方文档与源码（Codex 加载目录、调用语法、长度限制）：见 [candidates.md](candidates.md) 第 5 节；`codex-rs/skills/src/interface.rs`（[`MAX_NAME_LEN`、`MAX_DESCRIPTION_LEN`](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/skills/src/interface.rs)）
- 你们仓库里被引用的文件：`prompts/*.md`、`scripts/lib/common.mjs`（`collectOutput`、`scanExternalRefs`、`isolatedPath`）、`scripts/run-claude.mjs`、`scripts/run-codex.mjs`、`scripts/build-site.mjs`、`scripts/screenshot.mjs`、`docs/running.md`、`skills/*/meta.yaml`

---

# 补充（2026-10-26 下午）：主打优势、适用题目、展示题、动效取证

这部分回应「画廊应展示每个 skill 的优势，不擅长的不展示」。所有引文都来自 skill 自己的 SKILL.md 或 README，行号对应固定 SHA 的文件；我**没有打开 `runs/` 里任何已有结果**，下面的判断只依据文字。

## 9. 更正与新发现：`taste-skill-classics`

**更正**：上一版（第 1、3.1、3.7 节）说 taste-skill 的旧版「在当前 HEAD 里不存在、读者装不到」。事实是它们搬到了 [`Leonxlnx/taste-skill-classics`](https://github.com/Leonxlnx/taste-skill-classics)，README 明确写「kept their install names」，安装命令 `npx skills add https://github.com/Leonxlnx/taste-skill-classics --skill "high-end-visual-design"`。已同步改了 3.7，`candidates.json` 里 taste 条目的说明也改了。

**这个仓库的情况**：16★（2026-10-19 新建），MIT（LICENSE 已打开：Copyright (c) 2026 Leonxlnx），HEAD `5e08c9383dc4ad7fc0df70e1ac8cfa09ec356305`。7 个 skill，全部是**单个 SKILL.md、无脚本**：

| 安装名 | 目录 | 自己的一句话（description 原文） | skills.sh / claudemarket 安装数 |
|---|---|---|---|
| `minimalist-ui` | `skills/minimalist-skill` | 「Editorial product UI with a warm monochrome palette, typographic contrast and flat bento grids.」 | 425.1K / — |
| `high-end-visual-design` | `skills/soft-skill` | 「A calm, polished look with soft contrast, generous whitespace and spring motion.」 | 458.8K / 412K |
| `industrial-brutalist-ui` | `skills/brutalist-skill` | 「A hard mechanical look with Swiss type, rigid grids, extreme scale contrast and utilitarian colour.」 | 未取 |
| `gpt-taste` | `skills/gpt-tasteskill` | 「Classic skill for GPT and Codex … Layout variance, a strict AIDA page structure and GSAP scroll motion.」 | 未取 |
| `stitch-design-taste` | `skills/stitch-skill` | 写 `DESIGN.md`，给 Google Stitch 用，不是网页 | — / 354K |
| `design-taste-frontend-v1` | `skills/taste-skill-v1` | 「The original taste-skill」 | — / 289K |
| `design-taste-frontend-v2-experimental` | `skills/taste-skill-v2-experimental` | 单文件旋钮版重写（89KB） | 未取 |

**为什么值得记下来**：这三个「风格车道」skill（minimalist-ui、high-end-visual-design、industrial-brutalist-ui）正好符合「每个 skill 展示自己的优势」的思路——每个都在 description 里声明了一种具体风格，纯指引、不需要改运行脚本、不联网。知名度靠的是 skills.sh 上沿用原名累积的安装数（400K 以上），仓库本身 stars 很少（新仓库）。**我没有选它们进第二批**（你要求的是 taste-skill 本体），列为备选，需要的话再评估适用的题。

**运行注意事项（只对 classics 有影响，对已选的 6 个没有影响）**：classics 的每个 SKILL.md 都有 `disable-model-invocation: true`，每个目录还有 `agents/openai.yaml`（内容是 `policy: allow_implicit_invocation: false`），description 里写着「it runs only when called by name」。按 Claude Code 文档，`disable-model-invocation: true` 表示「Claude can't invoke it; only you can」，所以运行脚本那句结尾的 `Use the <name> skill.` **在 Claude 格里大概率触发不了**（模型调用不了它），要改成在提示词**开头**写 `/<name> `（headless 文档：在 `-p` 的提示词里写 `/skill-name`，Claude Code 会先展开）。Codex 的 `$name` 显式提及不受 `allow_implicit_invocation: false` 影响。这是文档推断，未实测；而且它会让这类格子的提示词不再是「题目 + 结尾一句」的统一格式，需要你决定。我检查过：已选的 6 个 skill 的 frontmatter 都没有这两个字段（`disable-model-invocation`、`user-invocable`）。

## 10. 每个 skill 自己声称的主打优势与适用范围

引文是原文（英文），说明是我的转述。「行」指固定 SHA 下该文件的行号；SHA：anthropics/skills `dbd4588f9e1033efb41dad4bef2f7947c8993d44`，ui-ux-pro-max-skill `d14efff8ed1faa4187f004f79926f428c8074ec7`，garden-skills `2b9a89340b70f632d31c0f1c69fce94a7912423e`，taste-skill `12af471f627f866411b4bd785b19646d3672784c`，agent-skills `aeac41d4d005999432bb7312f7ff06383a91d59d`。

### v0 的三个

**frontend-design**（[SKILL.md](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/SKILL.md)）
- 主打优势：
  - 「Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.」（第 3 行）
  - 「giving every client a distinct visual identity that is not mistaken for anyone else's」；「make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief」（第 9 行）
  - 「Typography carries the personality of the page.」（第 19 行）；「Spend your boldness in one place.」（第 59 行）
- 适用范围：「building new UI or reshaping an existing one」（第 3 行）；「For web designs, the hero is the first thing viewers will see.」（第 17 行）；第 13 行把「a dashboard for financial analysts」当作一种与玩具设计完全不同的题材举例。
- 明确不适用：原文没有排除项。
- 它没有声称的：动效只有一条克制性规则（第 32 行，页面加载只做一次编排好的动作）。

**ui-ux-pro-max**（[repo 里的 SKILL.md](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/.claude/skills/ui-ux-pro-max/SKILL.md)，画廊实际用 CLI 生成的版本，正文来自 [cli 模板](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/cli/assets/templates/base/skill-content.md)，description 相同）
- 主打优势：
  - 「UI/UX design intelligence for web, mobile, and desktop … Searchable local data: 79 searchable styles (50 active), 192 product palettes and reasoning profiles, 74 font pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22 stacks.」（SKILL.md 第 3 行）
  - README 的 Features：「192 Color Palettes - Industry-specific palettes aligned 1:1 with the 192 product types」「25 Chart Types - Recommendations for dashboards and analytics」「192 Reasoning Rules - Industry-specific design system generation」（[README.md 第 192–198 行](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/README.md)）
- 适用范围：
  - SKILL.md 第 12 行：「designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency, implementing navigation/animation/responsive behavior」；第 68 行 Product type：「SaaS, e-commerce, portfolio, dashboard, entertainment, tool, productivity, or hybrid」。
  - 安装版模板的触发表（第 25–35 行）：「New project / page: "Build a dashboard"」「Add charts / data viz: "Add an analytics dashboard chart"」。
  - README 的 Example Prompts（第 363–372 行）：「Build a landing page for my SaaS product」「Create a dashboard for healthcare analytics」「Design a portfolio website with dark mode」。
- 明确不适用：第 14 行「Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts」。
- 注意：画廊用的 CLI 版本是 2.15.0（`meta.yaml`），我读的模板是 d14efff 那一版；两者是否一致未核实。

**web-design-engineer**（[SKILL.md](https://github.com/ConardLi/garden-skills/blob/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer/SKILL.md)、[README.md](https://github.com/ConardLi/garden-skills/blob/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer/README.md)）
- 主打优势：
  - 「Build or redesign polished browser-rendered visual artifacts with HTML/CSS/JavaScript/React: pages, dashboards, prototypes, slide decks, animations, UI mockups, and data visualizations.」（SKILL.md 第 3 行）
  - 「The bar is "stunning," not "functional."」（第 10 行）；README 第 3 行「transforms AI-generated web pages from "functional" to "stunning."」
  - README 第 23–34 行列出手段：反套路清单、动手前先声明设计系统、oklch 色彩、Design Read 五个旋钮、25 个风格配方（`references/style-recipes/`）。
- 适用范围：SKILL.md 第 16 行「pages / dashboards / prototypes / slide decks / visualizations / animations / UI mockups / design systems」；README「What It Covers」表：「Web pages & landing pages — Marketing sites, product pages, portfolios」「Data visualizations — Dashboards with Chart.js or D3.js」。
- 明确不适用：第 18 行「Back-end APIs, CLI tools, data-processing scripts, pure logic development, source material → long-form HTML article conversion, or narration-beat → recordable web-video presentation」。
- 它声称但三道题覆盖不到的：交互原型、幻灯片、动画；这几类在画廊的范围之外（网页样式类），所以不另设题。

### 第二批的三个

**taste-skill**（[SKILL.md](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/SKILL.md)、[README.md](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/README.md)）
- 主打优势：
  - 「tasteskill v2, the anti-slop frontend skill. Art direction for websites, distilled from a study of 247 curated gallery sites (One Page Love, Awwwards Sites of the Day).」（description，第 3–12 行）
  - README 第 61 行：「makes coding agents design websites and app screens instead of assembling the average landing page. It gives the agent an art direction, real pictures and a way to check its own work in a real browser.」
  - SKILL.md 第 22–32 行的四点：脚本抽方向让 agent 选；「The idea comes from the subject」；浏览器里量出来的无装饰「house style」；看自己的截图再改。
- 适用范围：description：「a landing page, marketing site, portfolio, product page, one-pager, hero or any public-facing web page … Also for app screens: dashboards, admin and analytics views, settings, inboxes」；SKILL.md 第 48–51 行把「A page」（落地页、营销站、作品集）和「An app screen」（看板、管理、设置）分成两条流程。
- 不适用/另走的：第 506 行「A component or a single section, not a page. Skip the draw …」；重做/评审已有页面走另一条（第 483 行）。
- 对我们的题目：它最强的两项——**真实图片**和**滚动场景/动效层**——在统一的输出规则下被压制（不准远程图片）或在静态截图里看不见，见第 13 节。

**frontend-ui-engineering**（[SKILL.md](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/skills/frontend-ui-engineering/SKILL.md)、[README.md](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/README.md)）
- 主打优势：
  - 「Builds production-quality, accessible, responsive user-facing UIs.」（第 3 行）
  - 「UI that looks like it was built by a design-aware engineer at a top company — not like it was generated by an AI.」（第 10 行）
  - README 第 258 行：「Component architecture, design systems, state management, responsive design, WCAG 2.1 AA accessibility」。
  - 正文小节：「Avoid the AI Aesthetic」（第 129 行）、「Accessibility (WCAG 2.1 AA)」（第 176 行）、「Meaningful Empty and Error States」（第 233 行）、「Loading and Transitions」（第 269 行）。
- 适用范围（第 14–18 行 When to Use）：「Building new UI components or pages」「Modifying existing user-facing interfaces」「Implementing responsive layouts」「Adding interactivity or state management」「Fixing visual or UX issues」。
- 明确不适用：原文没有排除项。
- 它的优势里，无障碍（键盘、焦点、ARIA）和状态处理（加载/空/错误）三道题基本不要求，静态截图也看不到。

**theme-factory**（[SKILL.md](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/theme-factory/SKILL.md)）
- 主打优势：「Toolkit for styling artifacts with a theme … There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.」（第 3 行）；「A cohesive color palette with hex codes」「Complementary font pairings for headers and body text」（第 15–16 行）。
- 适用范围：「These artifacts can be slides, docs, reportings, HTML landing pages, etc.」（第 3 行）；「Once a theme is chosen, it can be applied to any artifact.」（第 10 行）；但 Purpose 一节只写「To apply consistent, professional styling to presentation slide decks, use this skill.」（第 14 行）。
- 明确不适用：原文没有排除项。
- 只管色板与字体，不管版式与内容。

### 参考：没选但被问到的

- **emil-design-eng**（[SKILL.md](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/emil-design-eng/SKILL.md) 第 3 行）：「This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great.」正文是动效决策框架（第 62 行起）、组件细节、手势、性能、无障碍。
- **landing-page-design**（elayadesign，[SKILL.md](https://github.com/elayadesign/ai-design-skills/blob/38bbe5765600b9178b5395a823c9f6c8d2b8e730/skills/landing-page-design/SKILL.md) 第 3 行）：「Complete system for building high converting landing pages … Use this skill whenever building, editing, styling, reviewing, or writing copy for ANY landing page, marketing site, web UI, page section, component, or prototype」；Scope 一节写「Apply to all web UI work: landing pages, marketing sites, components, dashboards, prototypes, and design reviews」。
- **classics 三个车道**：见第 9 节的 description 原文。

## 11. 适用哪几道题（只依据第 10 节的原文）

**规则（在看任何结果之前定）**：一个 skill 的原文**点名**了这类页面，或者声称覆盖**任何网页/界面**时，这道题就跑；原文**排除**了这类页面、或者把范围限定在别处时，不跑。

| skill | landing-saas | dashboard | blog-portfolio | 依据 |
|---|---|---|---|---|
| frontend-design | 跑（通用） | 跑（通用，第 13 行把看板当题材举例） | 跑（通用） | 「building new UI」，无排除项 |
| ui-ux-pro-max | 跑（点名） | 跑（点名） | 跑（点名） | README 示例提示正好是 SaaS 落地页、看板、作品集 |
| web-design-engineer | 跑（点名） | 跑（点名） | 跑（点名） | 「Web pages & landing pages … portfolios」「Dashboards」 |
| taste-skill | 跑（点名） | 跑（点名，走应用屏流程） | 跑（点名 portfolio） | description 的列表 |
| frontend-ui-engineering | 跑（通用） | 跑（通用） | 跑（通用） | 「Building new UI components or pages」，无排除项 |
| theme-factory | 跑（点名「HTML landing pages」） | 跑（通用：「reportings」「any artifact」） | 跑（通用：「any artifact」） | 依据最弱的两格是看板和博客 |

**结果：按原文，没有一个 skill 被排除任何一道题**，所以不存在「因为不适用而不跑」的格子。我没有为了显得有选择而硬造排除。

两点说明：
1. **v0 的三个已经跑完，这个判断不是「跑前登记」**。我没有打开 `runs/`，只依据文字，三个 skill 的原文也确实没有排除这三题；但从时间上讲，这份记录是在结果出来之后写的。如果你需要「严格的跑前登记」，对 v0 只能如实写成「事后依据原文核对，结论是三题都适用」，不要写成跑前决定。
2. **theme-factory 的依据最弱**（Purpose 只提幻灯片），所以如果要在这三个里砍格子，最该砍的是它的 dashboard 和 blog-portfolio；但砍的理由必须是「原文没点名」而不是「结果不好看」。你可以在跑之前决定是否采用这条更严的标准，我的建议是不砍，因为原文有「any artifact」。

备选 skill 的适用题：`landing-page-design` 原文是「ANY landing page, marketing site, web UI … dashboards」，三题都适用（虽然名字是落地页）；classics 的三个车道还没细读，暂不判断。

## 12. 展示题

**判断依据**：一个 skill 的主打优势，如果在上面三道题（统一的输出规则）里能被看见，就不另设题。输出规则不能改，所以「真实图片」这类被规则压制的优势也无法靠新题展示。

| skill | 主打优势能不能被三道题展示 | 展示题 |
|---|---|---|
| frontend-design | 能（配色、字体、首屏构图） | 不设 |
| ui-ux-pro-max | 能（风格、配色、字体、图表；看板题正好有图表）。表单与反馈规则展示有限 | 不设（可选跑 `form-states`） |
| web-design-engineer | 能（页面与看板）。它声称的原型、幻灯片、动画不在画廊范围 | 不设 |
| taste-skill | 部分：构图、字体、色彩、house style 能。「真实图片」被规则压制，「动效层、滚动场景」在静态截图里看不到 | 不设（规则不能改；动效用录屏，见第 13 节） |
| frontend-ui-engineering | **不能**：无障碍和状态处理（加载/空/错误）是它的主打，三题不要求，截图也看不到 | **`form-states`** |
| theme-factory | 能（色板与字体全页可见） | 不设 |
| emil-design-eng（未选） | 不能（动效） | `interaction-patterns`，**只在收入它时才需要** |

所以**当前真正需要的展示题只有 1 道**（`form-states`，给 frontend-ui-engineering）；`interaction-patterns` 是备着的，只有收入偏动效的 skill 才用。草稿放在 [`research/batch2-prompts/`](batch2-prompts/)，没有动 `prompts/`：

- [`form-states.md`](batch2-prompts/form-states.md)：Harbor Bank（虚构网银）的表单与反馈组件状态参考页。要求**所有状态同时可见**（输入框的默认/聚焦/填写/禁用/只读/错误/成功，勾选、单选、开关、下拉的各状态，三种按钮的默认/悬停/聚焦/按下/禁用/加载，转账列表的加载/空/错误/有数据四个面板，四种提示条、两个 toast、一个确认对话框，一张转账表单的错误态和成功态并排）。这样静态截图就能比较状态覆盖，而不用写交互脚本。
- [`interaction-patterns.md`](batch2-prompts/interaction-patterns.md)：Tern Notes（虚构笔记应用）的交互参考页：按钮、工具提示、菜单、标签页、手风琴、对话框、侧边面板、toast、开关与分段控件、任务列表的增删勾选。每个组件只写**功能行为**（点什么、开什么、Esc 关闭、焦点回到哪里），不写任何动效参数，让 skill 的动效建议自己起作用。

**中立性核对**（脚本比对过）：
- 「Output requirements」一节与 `prompts/landing-saas.md` **逐字相同**（6 条）。
- 结构沿用现有格式：frontmatter（`id`、`title`、`version: 1`）→ 一段背景 → 带编号的内容清单 → 输出规则。
- 正文 742 / 639 词，现有三题是 775 / 819 / 679 词。
- 没有风格形容词（检查了 modern、clean、polished、smooth、minimal、bold 等 30 个词）。唯一命中的 `Bold` 是编辑器工具栏里「Bold」按钮的名字，是内容不是形容词。

**成本**：`form-states` 要加 2 格原生对照（Claude、Codex）+ skill 格（frontend-ui-engineering × 2）；如果想看 ui-ux-pro-max、web-design-engineer 在表单状态上的表现，它们也各是 2 格，这是可选的，不是必须。

**一个提醒**：frontend-ui-engineering 最主要的优势之一是**无障碍**（键盘可达、焦点、ARIA、语义标记），任何截图都看不到。如果要展示，建议加一个**非视觉证据**：对 `index.html` 跑一次 axe-core 或写一个小脚本统计（有 `label` 关联的输入数、`aria-*`/`role` 数量、有无 `:focus-visible` 样式、有无 `prefers-reduced-motion`），在画廊里作为小标签。这个不属于题目，也不改题目，是后处理。

## 13. 偏动效的 skill：静态截图看不看得出差别，要录什么

### 13.1 静态截图能不能看出

**基本看不出。** 依据是你们自己的文档：`docs/running.md` 写明 `screenshot.mjs` 是全页 PNG，「captures with CSS animations disabled (finite animations jump to their end state)」，并且为了让滚动触发的内容出现，会先滚动页面一遍。所以：

- 看不到：悬停/按下/聚焦的过渡、tooltip 的延迟与连续悬停、popover/对话框/抽屉的出入场、弹簧、stagger、`scale(0)` 起始、入场序列、滚动驱动的场景（钉住的舞台）、reduced-motion 的差别。
- 看得到：终态上有没有这些组件；不能判断它们动不动、怎么动。
- 站内实时 iframe（`sandbox="allow-scripts"`）里动效是真的会跑，所以读者**自己点**能看到，但缩略图和对比图看不到。

对本批的 6 个 skill 来说：

| skill | 动效对它的主打优势有多重要 | 建议 |
|---|---|---|
| emil-design-eng（未选） | 几乎全部 | 不收，除非加录屏 |
| taste-skill | 重要：要求「动效层」（检查器要求页面里有至少 8 个会动的元素），滚动场景是签名动作之一 | 加滚动录屏（13.3） |
| frontend-design | 有一条克制规则（第 32 行），不是主打 | 不用录 |
| ui-ux-pro-max | 数据里有 17 个 GSAP 预设，但不是主打 | 不用录 |
| web-design-engineer | 「动画」在其范围内，但三题没要求 | 不用录 |
| frontend-ui-engineering | 「Loading and Transitions」一节，不是主打 | 不用录 |
| theme-factory | 无 | 不用录 |

### 13.2 如果收入偏动效的 skill（emil-design-eng、apple-design），录什么

配合 `interaction-patterns` 展示题（页面里每个组件一节）。**建议 8 个短片段，合计约 40 秒**，1440×900，每段从一个静止状态开始：

| # | 操作 | 时长 | 能看出什么 |
|---|---|---|---|
| 1 | 打开页面，不动鼠标，等 3 秒 | 3 s | 页面加载时的入场序列 |
| 2 | 悬停「New note」1 s → 按住 0.6 s → 松开 → 移开；对「Share」重复一次 | 6 s | 悬停与按下反馈（缩放、颜色），松手回弹 |
| 3 | 悬停 Bold 按钮停 1.2 s，再在 300 ms 内依次移到 Italic、Link，然后移出 | 6 s | tooltip 首次延迟、连续悬停是否跳过延迟、出入场 |
| 4 | 点「More actions」停 1 s，点页面空白处关闭 | 4 s | popover 的出现位置与起点（origin-aware）、关闭 |
| 5 | 点「Delete note」，停 1 s，按 Esc | 4 s | 对话框与遮罩的出入场，焦点回位 |
| 6 | Notes → Shared with me → Archive，每个停 1 s | 4 s | 标签切换的指示条与面板切换 |
| 7 | 手风琴展开一项停 1 s，再收起 | 4 s | 高度/不透明度动画 |
| 8 | 点「Save changes」，等 4 s | 4–5 s | toast 入场、自动消失 |

合计约 35–40 s。

### 13.3 对三道标准题（尤其 taste-skill）怎么录

| 页面 | 操作 | 时长 |
|---|---|---|
| 任意页面 | 先 3 s 页面加载，不动鼠标 | 3 s |
| landing-saas | 以约 600 px/s 匀速从顶滚到底，每个区段起点停 0.5 s，再滚回顶；悬停主 CTA 2 s；价格月/年切换两次；FAQ 展开收起各一项 | 约 30–45 s（页面高度 ÷ 600 + 停顿 + 约 8 s 交互） |
| dashboard | 悬停图表一个月份 2 s；切 All / Online / Cafés 各停 1.5 s；点两次表头排序；悬停一行 | 约 15 s |
| blog-portfolio | 切换明暗配色两次；点三个标签筛选；匀速滚动全页 | 约 30 s |
| taste-skill 的手机版 | 390×844，触摸滚动一遍 | 约 10–15 s |

### 13.4 录制方法的提醒（都是建议，未实测）

- 仓库已有 Playwright 1.64.1（`package.json`），其 `recordVideo` 带 `size` 和 `fps` 选项（在 `playwright-core/lib/coreBundle.js` 里看到 `recorder.start({ size, fps, … })`）；默认帧率我没核实。150–250 ms 的过渡在 25 fps 下只有 4–6 帧，**应显式设成 ≥50 fps 并先试录一段确认**。
- 想看清缓动曲线，同一段脚本再录一遍慢放：用 CDP 的 `Animation.setPlaybackRate`（比如 0.25）。动作脚本要**写成确定的序列**（固定坐标、固定停顿），原生格和 skill 格用同一份，才能并排比较。
- 滚动要用**鼠标滚轮事件**（Playwright 的 `mouse.wheel`），不要用 `window.scrollTo`：taste-skill 的场景用 Lenis 平滑滚动，它监听的是滚轮；直接跳滚动位置可能绕过它。
- 输出建议 WebM（VP9）或 MP4（H.264），无声，每段 ≤ 3MB，网页里用 `<video muted loop playsinline controls>`，不要自动带声音播放。
- 录屏会使 `screenshot.mjs` 之外多出一个取证步骤，也会让 `runs/<cell>/` 多文件（如 `motion.webm`），`build-site.mjs` 的 `CELL_FILES` 要加；这是**新增**的取证，不改题目。
