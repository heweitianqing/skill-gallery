[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · **日本語** · [한국어](README.ko.md) · [Español](README.es.md)

# skill-gallery

Web デザイン向けのエージェント skill が実際に何をするのかを確かめるためのプロジェクトです。同じプロンプトを Claude Code と Codex で、各 skill ありとなしの両方で生成し、並べて比較します。

[![ライセンス: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![ギャラリー](https://img.shields.io/badge/gallery-online-555.svg)](https://heweitianqing.github.io/skill-gallery/ja/)

[![結果グリッドの概要](docs/launch/overview.png)](https://heweitianqing.github.io/skill-gallery/ja/)

<!-- status:start -->
> **ステータス：v0。** 全 24 セルの実行が完了しています（2026-10-25 – 2026-10-26、UTC）。
<!-- status:end -->

## 背景

見栄えのよいフロントエンドを作れるとうたうエージェント skill（`SKILL.md` 形式）は数多くありますが、実際に何が変わるのかは判断しにくいものです。各 README には選び抜かれた例しか載っておらず、同じ skill を Claude Code と Codex でどうインストールし、どう呼び出すのかもはっきりしないことがよくあります。このリポジトリでは、すべての skill を同じプロンプト・同じ条件で実行してすべての結果を公開し、両エージェントでの正確なインストール手順と呼び出し方法を記録しています。

## 比較の仕組み

各プロンプトは 4 つのセルで実行します。

|  | ネイティブ（skill 追加なし） | + skill |
| --- | --- | --- |
| **Codex** | `codex__native` | `codex__<skill>` |
| **Claude Code** | `claude__native` | `claude__<skill>` |

2 つのネイティブセルはプロンプトだけで決まるため、すべての skill を同じ 2 つのベースラインと比較できます。

| エージェント | モデル | Effort |
| --- | --- | --- |
| Codex CLI | `gpt-6.1-sol` | `model_reasoning_effort=high` |
| Claude Code | `claude-opus-5-5` | `--effort high` |

プロンプトは 3 つで、いずれも Web ページです。スタイルを表す形容詞を含まない中立的な表現で書かれており、4 つのセルすべてに同じテキストを渡します。skill のセルでは、末尾に skill 名を指定する 1 文を追加するだけです。

| プロンプト | 内容 |
| --- | --- |
| [`landing-saas`](prompts/landing-saas.md) | 架空のオンコール当番管理ツールのマーケティングページ（料金の切り替えと FAQ を含む） |
| [`dashboard`](prompts/dashboard.md) | 架空のコーヒー焙煎会社の売上・運営ダッシュボード（固定データを使用） |
| [`blog-portfolio`](prompts/blog-portfolio.md) | 架空のプロダクトデザイナーの 1 ページのポートフォリオ兼ブログ |

## 結果

<!-- results:start -->
各マスはデスクトップ幅でのページ上部で、上が Codex、下が Claude Code の結果です。サムネイルをクリックすると、その結果をギャラリーで開きます。

<table>
<thead><tr><th>プロンプト</th><th>ネイティブ（skill 追加なし）</th><th><a href="https://heweitianqing.github.io/skill-gallery/ja/skills/frontend-design/">frontend-design</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/ja/skills/ui-ux-pro-max/">ui-ux-pro-max</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/ja/skills/web-design-engineer/">web-design-engineer</a></th></tr></thead>
<tbody>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/ja/prompts/landing-saas/">SaaS のランディングページ</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/codex__native/"><img src="docs/launch/assets/thumbs/landing-saas/codex__native.png" width="160" alt="Codex · ネイティブ、SaaS のランディングページ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/claude__native/"><img src="docs/launch/assets/thumbs/landing-saas/claude__native.png" width="160" alt="Claude Code · ネイティブ、SaaS のランディングページ"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/codex__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/codex__frontend-design.png" width="160" alt="Codex · + frontend-design、SaaS のランディングページ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/claude__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design、SaaS のランディングページ"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max、SaaS のランディングページ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max、SaaS のランディングページ"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer、SaaS のランディングページ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/landing-saas/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer、SaaS のランディングページ"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/ja/prompts/dashboard/">データダッシュボード</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/codex__native/"><img src="docs/launch/assets/thumbs/dashboard/codex__native.png" width="160" alt="Codex · ネイティブ、データダッシュボード"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/claude__native/"><img src="docs/launch/assets/thumbs/dashboard/claude__native.png" width="160" alt="Claude Code · ネイティブ、データダッシュボード"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/codex__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/codex__frontend-design.png" width="160" alt="Codex · + frontend-design、データダッシュボード"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/claude__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design、データダッシュボード"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max、データダッシュボード"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max、データダッシュボード"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer、データダッシュボード"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/dashboard/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer、データダッシュボード"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/ja/prompts/blog-portfolio/">個人ブログとポートフォリオ</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/codex__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__native.png" width="160" alt="Codex · ネイティブ、個人ブログとポートフォリオ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/claude__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__native.png" width="160" alt="Claude Code · ネイティブ、個人ブログとポートフォリオ"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/codex__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__frontend-design.png" width="160" alt="Codex · + frontend-design、個人ブログとポートフォリオ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/claude__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design、個人ブログとポートフォリオ"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max、個人ブログとポートフォリオ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max、個人ブログとポートフォリオ"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer、個人ブログとポートフォリオ"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ja/cells/blog-portfolio/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer、個人ブログとポートフォリオ"></a><br><sub>Claude Code</sub></td></tr>
</tbody>
</table>
<!-- results:end -->

## Skill のインストールと使い方

各エージェント向けの要約です。完全なコマンドと補足は、ギャラリーの各 skill ページに記載しています。

<!-- skills:start -->
| Skill | Claude Code | Codex |
| --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/ja/skills/frontend-design/#install) | フォルダを `.claude/skills/frontend-design/` にコピー。その後、プロンプトの末尾に `Use the frontend-design skill.` を追加（または `/frontend-design …` と入力） | フォルダを `.agents/skills/frontend-design/` にコピー。その後、プロンプトで `$frontend-design` に言及 |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/ja/skills/ui-ux-pro-max/#install) | `npx ui-ux-pro-max-cli@2.15.0 init --ai claude` を実行。その後、プロンプトの末尾に `Use the ui-ux-pro-max skill.` を追加（または `/ui-ux-pro-max …` と入力） | `npx ui-ux-pro-max-cli@2.15.0 init --ai codex` を実行。その後、プロンプトで `$ui-ux-pro-max` に言及 |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/ja/skills/web-design-engineer/#install) | フォルダを `.claude/skills/web-design-engineer/` にコピー。その後、プロンプトの末尾に `Use the web-design-engineer skill.` を追加（または `/web-design-engineer …` と入力） | フォルダを `.agents/skills/web-design-engineer/` にコピー。その後、プロンプトで `$web-design-engineer` に言及 |
<!-- skills:end -->

## 手法と制限

- **隔離。** 各実行は、リポジトリ外に新しく作成した使い捨てのディレクトリで開始します。`HOME` は空で、専用の設定ディレクトリ（`CLAUDE_CONFIG_DIR` または `CODEX_HOME`）を使い、環境は一から構築します。実行者の設定、プラグイン、ユーザーレベルの skill、MCP サーバー、メモリは一切読み込みません。skill はそのプロジェクトの skill フォルダにのみコピーします。エージェント自身のログを根拠として各 `run.json` に保存しています。
- **skill が発動していること。** skill のセルは、skill が読み込まれたことがログで確認できた場合（`skill_triggered`）にのみ有効とし、それ以外は失敗として扱います。このチェックの裏付けとなったカナリアテストについては [docs/canary.md](docs/canary.md) を参照してください。
- **各セル 1 回だけ生成、結果の選り好みなし。** 各セルは追加のやり取りなしで 1 回だけ生成します。失敗も含めてすべての結果を公開し、再実行した場合も以前の試行を残します。
- **ネイティブとはインストールしたままの状態のことで、skill がゼロという意味ではありません。** ネイティブを含むすべてのセルで、各エージェントに同梱の skill を使えます。Claude Code に組み込まれた 19 個の skill と、Codex のシステム skill（`imagegen`、`openai-docs`、`skill-creator`、`skill-installer`）です。`dashboard` のプロンプトでは、Claude Code 組み込みの `dataviz` skill が自動で 2 回発動しました（`claude__native` と `claude__frontend-design` で 1 回ずつ）。これは `run.json` の `builtin_skills_used` に記録されています。読者がエージェントをインストールしたときに実際に得られる結果を比べるため、意図的にそのままにしています。
- **制限：ディスク上の他の場所は読み取り可能。** 隔離とは何も*読み込まない*という意味であり、何も*読めない*という意味ではありません。Codex 標準の `workspace-write` サンドボックスは `/` を読み取ることができ、`bypassPermissions` を指定した Claude Code にはサンドボックスがありません。v0 の実行では、エージェントが親ディレクトリの `AGENTS.md` を探したほか、あるエージェントは実行者の npm キャッシュにある Playwright を使って自分のページをテストしました。別のユーザーアカウントやコンテナを使えば、この抜け穴を塞げます。
- **制限：スクリーンショット内の固定サイドバー。** ページ全体のキャプチャでは、`100vh` のサイズを持つ `position: fixed` または `sticky` の要素が最初の画面の高さでしか描画されないため、ダッシュボードのサイドバーが 900 px で途切れて見えることがあります。ページ自体に問題はありません。ギャラリーで開いて確認してください。
- **制限：1 回の生成はベンチマークではありません。** このギャラリーは、skill がどのような傾向を持つかを示す例として見てください。スコアではありません。

詳細は [docs/running.md](docs/running.md) と [docs/run-schema.md](docs/run-schema.md) を参照してください。

## 再現手順

必要なもの：macOS または Linux、Node 20 以上、git、Codex CLI と Claude Code CLI、およびそれぞれのログイン。

```bash
git clone https://github.com/heweitianqing/skill-gallery.git
cd skill-gallery
npm install
npx playwright install --no-shell chromium
codex login
bash scripts/setup-claude-auth.sh        # 隔離した Claude の実行で使う長期トークン

node scripts/fetch-skill.mjs --all       # 固定したバージョンの skill を .cache/skills/ に取得
node scripts/run-codex.mjs landing-saas native
node scripts/run-codex.mjs landing-saas frontend-design
node scripts/run-claude.mjs landing-saas frontend-design
node scripts/screenshot.mjs              # 新しいセルの desktop.png と mobile.png を作成

node scripts/build-site.mjs              # site/dist/ にギャラリーを生成
node scripts/build-readme.mjs            # すべての README の表を更新
```

ギャラリーをプレビューするには、`python3 -m http.server 8000 --directory site/dist` を実行してから <http://localhost:8000/> を開きます。

## Skill の追加

[skill 提案フォーム](https://github.com/heweitianqing/skill-gallery/issues/new?template=skill-suggestion.yml)から提案するか、次の手順で自分で追加してください。

1. `skills/<name>/meta.yaml` を作成し、固定したソース（リポジトリ、コミット、パス）、ライセンス、各エージェントでのインストールと呼び出しの方法を記述します。既存のファイルをテンプレートとしてコピーしてください。
2. `node scripts/fetch-skill.mjs <name>` を実行し、続けて 6 つの skill セル（3 プロンプト × 2 エージェント）と `node scripts/screenshot.mjs` を実行します。
3. `site/config.json` に skill 名を追加し、`node scripts/build-readme.mjs` を実行します。
4. 新しい `runs/` のセルを含めてプルリクエストを作成します。よりよい結果を得るためにセルを再実行しないでください。

詳しくは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## クレジット

各 skill の権利はその作者に帰属し、それぞれのライセンスが適用されます。このリポジトリには skill のファイルは含まれておらず、固定したコミットまたはバージョンで取得します。

<!-- credits:start -->
| Skill | ソース | ライセンス | 固定したコミット |
| --- | --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/ja/skills/frontend-design/) | [anthropics/skills](https://github.com/anthropics/skills) `skills/frontend-design` | [Apache-2.0](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt) | [`dbd4588f9e`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design) |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/ja/skills/ui-ux-pro-max/) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) `.claude/skills/ui-ux-pro-max`<br><sub>Copyright (c) 2024 Next Level Builder</sub> | [MIT](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/LICENSE) | `ui-ux-pro-max-cli@2.15.0`（CLI で生成）<br><sub>[`d14efff8ed`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d14efff8ed1faa4187f004f79926f428c8074ec7/.claude/skills/ui-ux-pro-max)</sub> |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/ja/skills/web-design-engineer/) | [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) `skills/web-design-engineer`<br><sub>Copyright (c) 2026 (no name given; attribute to ConardLi/garden-skills)</sub> | [MIT](https://github.com/ConardLi/garden-skills/blob/2b9a89340b70f632d31c0f1c69fce94a7912423e/LICENSE) | [`2b9a89340b`](https://github.com/ConardLi/garden-skills/tree/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer) |
<!-- credits:end -->

## 免責事項

このプロジェクトは Anthropic および OpenAI とは提携しておらず、両社による承認や後援も受けていません。Claude、Claude Code、Codex およびその他の名称は、それぞれの所有者の商標です。`runs/` 内のページはモデルの出力を編集せずに掲載したもので、そこに登場する企業や人物はすべて架空のものです。

この README とギャラリーの翻訳は AI によって作成されました。修正のプルリクエストを歓迎します。

このリポジトリのコードとドキュメントは [MIT ライセンス](LICENSE) で公開されています。
