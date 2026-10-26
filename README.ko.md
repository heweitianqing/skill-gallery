[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · **한국어** · [Español](README.es.md)

# skill-gallery

웹 디자인용 에이전트 skill이 실제로 무엇을 바꾸는지 확인합니다. 같은 프롬프트를 Claude Code와 Codex가 각 skill을 쓸 때와 쓰지 않을 때로 나누어 만들고, 그 결과를 나란히 보여 줍니다.

[![라이선스: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![갤러리](https://img.shields.io/badge/gallery-online-555.svg)](https://heweitianqing.github.io/skill-gallery/ko/)

[![결과 그리드 개요](docs/launch/overview.png)](https://heweitianqing.github.io/skill-gallery/ko/)

<!-- status:start -->
> **상태: v0.** 셀 24개를 모두 실행했습니다(2026-10-25 – 2026-10-26, UTC).
<!-- status:end -->

## 왜 만들었나

더 보기 좋은 프런트엔드 결과물을 약속하는 에이전트 skill(`SKILL.md` 형식)은 많습니다. 하지만 실제로 무엇이 달라지는지는 알기 어렵습니다. README에는 직접 고른 예시만 실려 있고, 같은 skill을 Claude Code와 Codex에서 어떻게 설치하고 호출하는지도 불분명한 경우가 많습니다. 이 저장소는 모든 skill을 같은 프롬프트와 같은 조건에서 실행하고, 결과를 빠짐없이 보여 주며, 두 에이전트 각각의 정확한 설치 및 호출 절차를 기록합니다.

## 비교 방식

각 프롬프트는 네 셀에서 실행됩니다.

|  | 네이티브(skill 추가 없음) | + skill |
| --- | --- | --- |
| **Codex** | `codex__native` | `codex__<skill>` |
| **Claude Code** | `claude__native` | `claude__<skill>` |

두 네이티브 셀은 프롬프트에만 의존하므로, 모든 skill은 같은 두 기준선과 비교됩니다.

| 에이전트 | 모델 | Effort |
| --- | --- | --- |
| Codex CLI | `gpt-6.1-sol` | `model_reasoning_effort=high` |
| Claude Code | `claude-opus-5-5` | `--effort high` |

프롬프트는 세 가지이며 모두 웹 페이지입니다. 스타일 형용사 없이 중립적인 표현을 쓰고, 네 셀 모두 같은 텍스트를 받습니다. skill 셀에는 skill 이름을 지정하는 마지막 문장 하나만 추가됩니다.

| 프롬프트 | 요구 내용 |
| --- | --- |
| [`landing-saas`](prompts/landing-saas.md) | 가상의 온콜 일정 관리 도구를 위한 마케팅 페이지(요금제 토글, FAQ 포함) |
| [`dashboard`](prompts/dashboard.md) | 가상의 커피 로스터리를 위한 매출·운영 대시보드(고정 데이터 사용) |
| [`blog-portfolio`](prompts/blog-portfolio.md) | 가상의 프로덕트 디자이너를 위한 원페이지 포트폴리오 겸 블로그 |

## 결과

<!-- results:start -->
각 칸은 데스크톱 너비에서 본 페이지 상단이며, 위쪽이 Codex, 아래쪽이 Claude Code입니다. 썸네일을 클릭하면 갤러리에서 해당 결과가 열립니다.

<table>
<thead><tr><th>프롬프트</th><th>네이티브(skill 추가 없음)</th><th><a href="https://heweitianqing.github.io/skill-gallery/ko/skills/frontend-design/">frontend-design</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/ko/skills/ui-ux-pro-max/">ui-ux-pro-max</a></th><th><a href="https://heweitianqing.github.io/skill-gallery/ko/skills/web-design-engineer/">web-design-engineer</a></th></tr></thead>
<tbody>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/ko/prompts/landing-saas/">SaaS 랜딩 페이지</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/codex__native/"><img src="docs/launch/assets/thumbs/landing-saas/codex__native.png" width="160" alt="Codex · 네이티브, SaaS 랜딩 페이지"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/claude__native/"><img src="docs/launch/assets/thumbs/landing-saas/claude__native.png" width="160" alt="Claude Code · 네이티브, SaaS 랜딩 페이지"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/codex__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/codex__frontend-design.png" width="160" alt="Codex · + frontend-design, SaaS 랜딩 페이지"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/claude__frontend-design/"><img src="docs/launch/assets/thumbs/landing-saas/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design, SaaS 랜딩 페이지"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max, SaaS 랜딩 페이지"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/landing-saas/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max, SaaS 랜딩 페이지"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer, SaaS 랜딩 페이지"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/landing-saas/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/landing-saas/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer, SaaS 랜딩 페이지"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/ko/prompts/dashboard/">데이터 대시보드</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/codex__native/"><img src="docs/launch/assets/thumbs/dashboard/codex__native.png" width="160" alt="Codex · 네이티브, 데이터 대시보드"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/claude__native/"><img src="docs/launch/assets/thumbs/dashboard/claude__native.png" width="160" alt="Claude Code · 네이티브, 데이터 대시보드"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/codex__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/codex__frontend-design.png" width="160" alt="Codex · + frontend-design, 데이터 대시보드"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/claude__frontend-design/"><img src="docs/launch/assets/thumbs/dashboard/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design, 데이터 대시보드"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max, 데이터 대시보드"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/dashboard/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max, 데이터 대시보드"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer, 데이터 대시보드"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/dashboard/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/dashboard/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer, 데이터 대시보드"></a><br><sub>Claude Code</sub></td></tr>
<tr><th><a href="https://heweitianqing.github.io/skill-gallery/ko/prompts/blog-portfolio/">개인 블로그 및 포트폴리오</a></th><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/codex__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__native.png" width="160" alt="Codex · 네이티브, 개인 블로그 및 포트폴리오"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/claude__native/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__native.png" width="160" alt="Claude Code · 네이티브, 개인 블로그 및 포트폴리오"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/codex__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__frontend-design.png" width="160" alt="Codex · + frontend-design, 개인 블로그 및 포트폴리오"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/claude__frontend-design/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__frontend-design.png" width="160" alt="Claude Code · + frontend-design, 개인 블로그 및 포트폴리오"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/codex__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__ui-ux-pro-max.png" width="160" alt="Codex · + ui-ux-pro-max, 개인 블로그 및 포트폴리오"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/claude__ui-ux-pro-max/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__ui-ux-pro-max.png" width="160" alt="Claude Code · + ui-ux-pro-max, 개인 블로그 및 포트폴리오"></a><br><sub>Claude Code</sub></td><td align="center"><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/codex__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/codex__web-design-engineer.png" width="160" alt="Codex · + web-design-engineer, 개인 블로그 및 포트폴리오"></a><br><sub>Codex</sub><br><a href="https://heweitianqing.github.io/skill-gallery/ko/cells/blog-portfolio/claude__web-design-engineer/"><img src="docs/launch/assets/thumbs/blog-portfolio/claude__web-design-engineer.png" width="160" alt="Claude Code · + web-design-engineer, 개인 블로그 및 포트폴리오"></a><br><sub>Claude Code</sub></td></tr>
</tbody>
</table>
<!-- results:end -->

## Skill: 설치 및 사용

에이전트별 요약입니다. 전체 명령어와 참고 사항은 갤러리의 각 skill 페이지에 있습니다.

<!-- skills:start -->
| Skill | Claude Code | Codex |
| --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/ko/skills/frontend-design/#install) | `.claude/skills/frontend-design/`에 폴더 복사, 그다음 프롬프트 끝에 `Use the frontend-design skill.` 추가(또는 `/frontend-design …` 입력) | `.agents/skills/frontend-design/`에 폴더 복사, 그다음 프롬프트에서 `$frontend-design` 언급 |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/ko/skills/ui-ux-pro-max/#install) | `npx ui-ux-pro-max-cli@2.15.0 init --ai claude` 실행, 그다음 프롬프트 끝에 `Use the ui-ux-pro-max skill.` 추가(또는 `/ui-ux-pro-max …` 입력) | `npx ui-ux-pro-max-cli@2.15.0 init --ai codex` 실행, 그다음 프롬프트에서 `$ui-ux-pro-max` 언급 |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/ko/skills/web-design-engineer/#install) | `.claude/skills/web-design-engineer/`에 폴더 복사, 그다음 프롬프트 끝에 `Use the web-design-engineer skill.` 추가(또는 `/web-design-engineer …` 입력) | `.agents/skills/web-design-engineer/`에 폴더 복사, 그다음 프롬프트에서 `$web-design-engineer` 언급 |
<!-- skills:end -->

## 방법과 한계

- **격리.** 모든 실행은 저장소 밖의 새 임시 디렉터리에서 시작하며, 빈 `HOME`, 전용 설정 홈(`CLAUDE_CONFIG_DIR` 또는 `CODEX_HOME`), 처음부터 새로 구성한 환경을 사용합니다. 운영자의 설정, 플러그인, 사용자 수준 skill, MCP 서버, 메모리는 전혀 로드하지 않습니다. skill은 해당 프로젝트의 skill 폴더에만 복사합니다. 에이전트 자체 로그는 각 `run.json`에 근거로 보관합니다.
- **skill이 실제로 호출되어야 합니다.** skill 셀은 로그에 skill이 로드된 기록(`skill_triggered`)이 있을 때만 인정하며, 그렇지 않으면 실패로 표시합니다. 이 검사의 바탕이 된 카나리 테스트는 [docs/canary.md](docs/canary.md)에서 설명합니다.
- **셀마다 한 번만 생성, 결과 골라내기 없음.** 각 셀은 후속 턴 없이 한 번만 생성합니다. 실패를 포함한 모든 결과를 공개하며, 다시 실행하더라도 이전 시도는 남겨 둡니다.
- **네이티브는 skill이 하나도 없는 상태가 아니라 기본 설치 상태를 뜻합니다.** 네이티브 셀을 포함한 모든 셀에서 각 에이전트에 기본으로 들어 있는 skill을 사용할 수 있습니다. Claude Code에 내장된 skill 19개와 Codex의 시스템 skill(`imagegen`, `openai-docs`, `skill-creator`, `skill-installer`)입니다. `dashboard` 프롬프트에서는 Claude Code에 내장된 `dataviz` skill이 스스로 두 번 실행되었습니다. `claude__native`에서 한 번, `claude__frontend-design`에서 한 번이며, `run.json`의 `builtin_skills_used`에 기록되어 있습니다. 이는 의도한 것입니다. 독자가 에이전트를 설치했을 때 실제로 얻는 결과를 비교하기 때문입니다.
- **한계: 디스크의 나머지 부분은 여전히 읽을 수 있습니다.** 격리는 아무것도 *로드*하지 않는다는 뜻이지, 아무것도 *읽을 수 없다*는 뜻이 아닙니다. Codex의 기본 `workspace-write` 샌드박스는 `/`를 읽을 수 있고, `bypassPermissions`로 실행한 Claude Code에는 샌드박스가 없습니다. v0 실행에서는 에이전트가 상위 디렉터리에서 `AGENTS.md`를 찾았고, 한 에이전트는 운영자의 npm 캐시에 있던 Playwright로 자신이 만든 페이지를 테스트했습니다. 별도 사용자 계정이나 컨테이너를 쓰면 이 빈틈을 막을 수 있습니다.
- **한계: 스크린샷 속 고정 사이드바.** 전체 페이지 캡처는 높이가 `100vh`인 `position: fixed` 또는 `sticky` 요소를 첫 화면 높이로만 그리기 때문에, 대시보드 사이드바가 900 px에서 끊긴 것처럼 보일 수 있습니다. 페이지 자체에는 문제가 없으며, 갤러리에서 열어 보면 확인할 수 있습니다.
- **한계: 샘플 하나로는 벤치마크가 되지 않습니다.** 갤러리는 점수가 아니라 skill이 보이는 경향을 보여 주는 예시로 읽어야 합니다.

자세한 내용: [docs/running.md](docs/running.md), [docs/run-schema.md](docs/run-schema.md).

## 재현하기

요구 사항: macOS 또는 Linux, Node 20 이상, git, Codex CLI와 Claude Code CLI, 그리고 각 CLI의 로그인.

```bash
git clone https://github.com/heweitianqing/skill-gallery.git
cd skill-gallery
npm install
npx playwright install --no-shell chromium
codex login
bash scripts/setup-claude-auth.sh        # 격리된 Claude 실행용 장기 토큰

node scripts/fetch-skill.mjs --all       # 고정 버전의 skill을 .cache/skills/에 가져옴
node scripts/run-codex.mjs landing-saas native
node scripts/run-codex.mjs landing-saas frontend-design
node scripts/run-claude.mjs landing-saas frontend-design
node scripts/screenshot.mjs              # 새 셀의 desktop.png와 mobile.png 생성

node scripts/build-site.mjs              # site/dist/에 갤러리 생성
node scripts/build-readme.mjs            # 모든 README의 표 갱신
```

갤러리를 미리 보려면 `python3 -m http.server 8000 --directory site/dist`를 실행한 뒤 브라우저에서 <http://localhost:8000/> 주소를 엽니다.

## Skill 추가하기

[skill 제안 양식](https://github.com/heweitianqing/skill-gallery/issues/new?template=skill-suggestion.yml)으로 제안하거나 직접 추가할 수 있습니다.

1. `skills/<name>/meta.yaml`을 만들고 고정 출처(저장소, 커밋, 경로), 라이선스, 각 에이전트에서의 설치 및 호출 방법을 적습니다. 기존 파일을 복사해 템플릿으로 쓰면 됩니다.
2. `node scripts/fetch-skill.mjs <name>`을 실행한 다음, skill 셀 6개(프롬프트 3개 × 에이전트 2개)와 `node scripts/screenshot.mjs`를 실행합니다.
3. `site/config.json`에 skill 이름을 추가한 뒤 `node scripts/build-readme.mjs`를 실행합니다.
4. 새 `runs/` 셀을 포함해 풀 리퀘스트를 엽니다. 더 나은 결과를 얻으려고 셀을 다시 실행해서는 안 됩니다.

자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)에 있습니다.

## 크레디트

각 skill은 작성자에게 속하며 각자의 라이선스를 따릅니다. 이 저장소에는 skill 파일이 포함되어 있지 않으며, 고정된 커밋이나 버전에서 가져옵니다.

<!-- credits:start -->
| Skill | 출처 | 라이선스 | 고정 커밋 |
| --- | --- | --- | --- |
| [frontend-design](https://heweitianqing.github.io/skill-gallery/ko/skills/frontend-design/) | [anthropics/skills](https://github.com/anthropics/skills) `skills/frontend-design` | [Apache-2.0](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt) | [`dbd4588f9e`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design) |
| [ui-ux-pro-max](https://heweitianqing.github.io/skill-gallery/ko/skills/ui-ux-pro-max/) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) `.claude/skills/ui-ux-pro-max`<br><sub>Copyright (c) 2024 Next Level Builder</sub> | [MIT](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/d14efff8ed1faa4187f004f79926f428c8074ec7/LICENSE) | `ui-ux-pro-max-cli@2.15.0`(CLI로 생성)<br><sub>[`d14efff8ed`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d14efff8ed1faa4187f004f79926f428c8074ec7/.claude/skills/ui-ux-pro-max)</sub> |
| [web-design-engineer](https://heweitianqing.github.io/skill-gallery/ko/skills/web-design-engineer/) | [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) `skills/web-design-engineer`<br><sub>Copyright (c) 2026 (no name given; attribute to ConardLi/garden-skills)</sub> | [MIT](https://github.com/ConardLi/garden-skills/blob/2b9a89340b70f632d31c0f1c69fce94a7912423e/LICENSE) | [`2b9a89340b`](https://github.com/ConardLi/garden-skills/tree/2b9a89340b70f632d31c0f1c69fce94a7912423e/skills/web-design-engineer) |
<!-- credits:end -->

## 면책 조항

이 프로젝트는 Anthropic 또는 OpenAI와 제휴 관계가 없으며, 이들의 보증이나 후원을 받지 않습니다. Claude, Claude Code, Codex 및 기타 명칭은 각 소유자의 상표입니다. `runs/`의 페이지는 편집하지 않은 모델 출력이며, 그 안에 등장하는 회사와 인물은 모두 가상입니다.

이 README와 갤러리의 번역은 AI로 작성했습니다. 수정 제안은 풀 리퀘스트로 환영합니다.

이 저장소의 코드와 문서는 [MIT 라이선스](LICENSE)로 공개됩니다.
