[English](README.md) · [简体中文](README.zh-CN.md) · **繁體中文** · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md)

# skill-gallery

看看網頁設計類的 agent skill 實際上做了什麼：同樣的題目，由 Claude Code 和 Codex 分別在使用與不使用各個 skill 的情況下製作，並排比較。

[![授權：MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![畫廊](https://img.shields.io/badge/gallery-online-555.svg)](https://heweitianqing.github.io/skill-gallery/)

[![結果表格總覽](docs/launch/overview.png)](https://heweitianqing.github.io/skill-gallery/)

<!-- status:start -->
> **狀態：v0。** 全部 24 格都已執行完畢（2026-10-25 – 2026-10-26，UTC）。
<!-- status:end -->

## 為什麼做這個專案

號稱能讓前端成品更好看的 agent skill（`SKILL.md` 格式）有很多，但很難看出它們實際改變了什麼。它們的 README 放的是精挑細選的範例，而同一個 skill 在 Claude Code 和 Codex 裡要怎麼安裝、怎麼呼叫，往往也說不清楚。這個儲存庫用同樣的題目、在同樣的條件下執行每個 skill，公開每一個結果，並寫下兩個 agent 確切的安裝與呼叫步驟。

## 比較方式

每個題目都會在四個格子中執行：

|  | 原生（不額外加 skill） | + skill |
| --- | --- | --- |
| **Codex** | `codex__native` | `codex__<skill>` |
| **Claude Code** | `claude__native` | `claude__<skill>` |

兩個原生格子只取決於題目，所以每個 skill 都是和同樣的兩個基準比較。

| Agent | 模型 | Effort |
| --- | --- | --- |
| Codex CLI | `gpt-6.1-sol` | `model_reasoning_effort=high` |
| Claude Code | `claude-opus-5-5` | `--effort high` |

共有三個題目，都只做網頁。題目用字中性，不含風格形容詞，四個格子拿到的文字完全相同；使用 skill 的格子只會在結尾多加一句指名該 skill 的話。

| 題目 | 要求內容 |
| --- | --- |
| [`landing-saas`](prompts/landing-saas.md) | 虛構值班排班工具的行銷頁面，含價格方案切換與常見問題 |
| [`dashboard`](prompts/dashboard.md) | 虛構咖啡烘焙商的銷售與營運儀表板，使用固定資料 |
| [`blog-portfolio`](prompts/blog-portfolio.md) | 虛構產品設計師的單頁作品集與部落格 |

## 結果

<!-- results:start -->
每個方格顯示桌面版寬度下的頁面頂端：上面是 Codex，下面是 Claude Code。點選縮圖即可在畫廊中開啟該結果。

<table>
<thead><tr><th>題目</th><th>原生（不額外加 skill）</th><th><a href="https://heweitianqing.github.io/skill-gallery/skills/frontend-design/">frontend-design</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/skills/ui-ux-pro-max/">ui-ux-pro-max</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/skills/web-design-engineer/">web-design-engineer</a></th></tr></thead>
<tbody>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/prompts/landing-saas/">SaaS 到達頁面</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__native/"><img src="docs/launch/assets/thumbs/landing-saas/codex__native.png" width="160" alt="Codex · 原生，SaaS 到達頁面"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__native/"><img src="docs/launch/assets/thumbs/landing-saas/claude__native.png" width="160" alt="Claude Code · 原生，SaaS 到達頁面"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/codex__frontend-design.png" width="160" alt="Codex · + frontend-design，SaaS 到達頁面"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design，SaaS 到達頁面"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max，SaaS 到達頁面"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max，SaaS 到達頁面"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer，SaaS 到達頁面"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/landing-saas/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer，SaaS 到達頁面"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/prompts/dashboard/">資料儀表板</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__native/"><img src="docs/launch/assets/thumbs/dashboard/codex__native.png" width="160" alt="Codex · 原生，資料儀表板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__native/"><img src="docs/launch/assets/thumbs/dashboard/claude__native.png" width="160" alt="Claude Code · 原生，資料儀表板"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/codex__frontend-design.png" width="160" alt="Codex · + frontend-design，資料儀表板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design，資料儀表板"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max，資料儀表板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max，資料儀表板"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer，資料儀表板"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/dashboard/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer，資料儀表板"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/prompts/blog-portfolio/">個人部落格與作品集</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__native.png" width="160" alt="Codex · 原生，個人部落格與作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__native.png" width="160" alt="Claude Code · 原生，個人部落格與作品集"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__frontend-design.png" width="160" alt="Codex · + frontend-design，個人部落格與作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design，個人部落格與作品集"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max，個人部落格與作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max，個人部落格與作品集"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer，個人部落格與作品集"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/cells/blog-portfolio/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer，個人部落格與作品集"></a><br><sub>Claude Code</sub></td></tr>
</tbody>
</table>
<!-- results:end -->

## Skill：安裝與使用

以下是各 agent 的精簡版本。畫廊中每個 skill 頁面都有完整的指令與說明。

<!-- skills:start -->
| Skill | Claude Code | Codex |
| --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/skills/frontend-design/#install) | 把資料夾複製到 `.claude/skills/frontend-design/`，然後在題目結尾加上 `Use the frontend-design skill.`（或輸入 `/frontend-design …`） | 把資料夾複製到 `.agents/skills/frontend-design/`，然後在題目中提到 `$frontend-design` |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/skills/ui-ux-pro-max/#install) | 執行 `npx ui-ux-pro-max-cli@2.15.0 init --ai claude`，然後在題目結尾加上 `Use the ui-ux-pro-max skill.`（或輸入 `/ui-ux-pro-max …`） | 執行 `npx ui-ux-pro-max-cli@2.15.0 init --ai codex`，然後在題目中提到 `$ui-ux-pro-max` |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/skills/web-design-engineer/#install) | 把資料夾複製到 `.claude/skills/web-design-engineer/`，然後在題目結尾加上 `Use the web-design-engineer skill.`（或輸入 `/web-design-engineer …`） | 把資料夾複製到 `.agents/skills/web-design-engineer/`，然後在題目中提到 `$web-design-engineer` |
<!-- skills:end -->

## 方法與限制

- **隔離。** 每次執行都從儲存庫外一個全新的拋棄式目錄開始，`HOME` 是空的，有自己的設定目錄（`CLAUDE_CONFIG_DIR` 或 `CODEX_HOME`），環境也是從頭建立。不會載入操作者的任何設定、外掛、使用者層級的 skill、MCP 伺服器或記憶。skill 只會複製到該專案的 skill 資料夾。agent 自己的日誌會作為證據，保存在每個 `run.json` 中。
- **Skill 必須真的觸發。** 只有日誌顯示 skill 已被載入（`skill_triggered`），使用 skill 的格子才算數，否則會標為失敗。這項檢查背後的金絲雀測試請見 [docs/canary.md](docs/canary.md)。
- **每格只取樣一次，不挑選結果。** 每個格子只生成一次，沒有後續對話。所有結果都會公開，包括失敗的；重新執行時會保留先前的嘗試。
- **「原生」指的是開箱即用的狀態，不是完全沒有 skill。** 每一格（包括原生格）都能使用 agent 內建的 skill：Claude Code 內建的 19 個 skill，以及 Codex 的系統 skill（`imagegen`、`openai-docs`、`skill-creator`、`skill-installer`）。在 `dashboard` 這道題目裡，Claude Code 內建的 `dataviz` skill 自行觸發了兩次，`claude__native` 一次、`claude__frontend-design` 一次，記錄在 `run.json` 的 `builtin_skills_used` 中。這是刻意保留的：比較的是讀者安裝 agent 之後實際得到的效果。
- **限制：磁碟上的其他內容仍然讀得到。** 隔離指的是什麼都不*載入*，而不是什麼都*讀不到*。Codex 預設的 `workspace-write` 沙箱可以讀取 `/`，而使用 `bypassPermissions` 的 Claude Code 沒有沙箱。在 v0 的執行中，有 agent 到上層目錄尋找 `AGENTS.md`，也有一個 agent 用了操作者 npm 快取裡的 Playwright 來測試自己的頁面。另開一個使用者帳號或改用容器，就能補上這個缺口。
- **限制：截圖中的固定側邊欄。** 整頁截圖只會以第一個畫面的高度繪製尺寸為 `100vh` 的 `position: fixed` 或 `sticky` 元素，因此儀表板的側邊欄看起來可能在 900 px 處就斷了。頁面本身沒有問題，可以在畫廊中開啟頁面確認。
- **限制：單次取樣稱不上評測。** 請把這個畫廊當成 skill 傾向產生什麼結果的範例，而不是分數。

詳細說明：[docs/running.md](docs/running.md) 與 [docs/run-schema.md](docs/run-schema.md)。

## 自行重現

需求：macOS 或 Linux、Node 20+、git、Codex CLI 與 Claude Code CLI，並且兩者都已登入。

```bash
git clone https://github.com/heweitianqing/skill-gallery.git
cd skill-gallery
npm install
npx playwright install --no-shell chromium
codex login
bash scripts/setup-claude-auth.sh        # 給隔離執行的 Claude 使用的長效 token

node scripts/fetch-skill.mjs --all       # 以固定版本取得 skill，放到 .cache/skills/
node scripts/run-codex.mjs landing-saas native
node scripts/run-codex.mjs landing-saas frontend-design
node scripts/run-claude.mjs landing-saas frontend-design
node scripts/screenshot.mjs              # 為新的格子產生 desktop.png 和 mobile.png

node scripts/build-site.mjs              # 畫廊輸出到 site/dist/
node scripts/build-readme.mjs            # 更新每份 README 中的表格
```

預覽畫廊：執行 `python3 -m http.server 8000 --directory site/dist`，然後開啟 <http://localhost:8000/>。

## 新增 skill

可以透過 [skill 建議表單](https://github.com/heweitianqing/skill-gallery/issues/new?template=skill-suggestion.yml)提出建議，或自己動手新增：

1. 建立 `skills/<name>/meta.yaml`，寫入固定的來源（儲存庫、commit、路徑）、授權，以及在各 agent 中如何安裝與呼叫。可以複製一份現有的檔案當作範本。
2. 執行 `node scripts/fetch-skill.mjs <name>`，接著執行六個 skill 格子（三個題目 × 兩個 agent），再執行 `node scripts/screenshot.mjs`。
3. 把 skill 名稱加到 `site/config.json`，然後執行 `node scripts/build-readme.mjs`。
4. 開一個 pull request，附上新的 `runs/` 格子。不要為了得到更好看的結果而重新執行格子。

詳情請見 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 致謝

這些 skill 屬於各自的作者，並保有各自的授權。本儲存庫不包含它們的檔案，而是依固定的 commit 或版本另行取得。

<!-- credits:start -->
| Skill | 來源 | 授權 | 固定 commit |
| --- | --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/skills/frontend-design/) | [anthropics/skills](https://github.com/anthropics/skills) `skills/frontend-design` | [Apache-2.0](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt) | [`dbd4588f9e`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design) |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/skills/ui-ux-pro-max/) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) `.claude/skills/ui-ux-pro-max`<br><sub>Copyright (c) 2024 Next Level Builder</sub> | [MIT](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/LICENSE) | `ui-ux-pro-max-cli@2.15.0`（由 CLI 產生）<br><sub>[`d14efff8ed`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d14efff8ed1faa4187f004f79926f428c8074ec7/.claude/skills/ui-ux-pro-max)</sub> |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/skills/web-design-engineer/) | [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) `skills/web-design-engineer`<br><sub>Copyright (c) 2026 (no name given; attribute to ConardLi/garden-skills)</sub> | [MIT](https://github.com/ConardLi/garden-skills/blob/2b9a89340b70f632d31c0f1c69fce94a7912423e/LICENSE) | [`2b9a89340b`](https://github.com/ConardLi/garden-skills/tree/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer) |
<!-- credits:end -->

## 免責聲明

本專案與 Anthropic 或 OpenAI 沒有任何關聯，也未獲得其背書或贊助。Claude、Claude Code、Codex 及其他名稱均為其各自擁有者的商標。`runs/` 中的頁面是未經修改的模型輸出，其中的公司與人物都是虛構的。

本 README 的翻譯是由 AI 完成的。歡迎以 pull request 提出修正。

本儲存庫的程式碼與文件以 [MIT 授權條款](LICENSE)釋出。
