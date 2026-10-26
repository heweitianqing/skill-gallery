# GitHub repository metadata

Values for `heweitianqing/skill-gallery`. `scripts/apply-github-meta.sh` sets the first three with `gh repo edit`; keep the two in sync.

## Description

162 characters (GitHub allows 350):

```text
See what web-design agent skills actually do: the same prompts built by Claude Code and Codex, with and without each skill, side by side. 同一道题，用和不用 skill 的网页并排对比。
```

## Homepage

```text
https://heweitianqing.github.io/skill-gallery/
```

## Topics

```text
agent-skills
skill-md
claude-code
codex
openai-codex
coding-agents
ai-agents
llm
frontend
web-design
ui-design
design-systems
comparison
gallery
```

## Done by hand on github.com

These have no `gh` command, or need a decision on the website:

1. **Social preview.** Settings → General → Social preview → Edit → Upload an image: [`docs/launch/social-preview.png`](social-preview.png) (1280×640).
2. **Pages.** Settings → Pages → Build and deployment → Source: **GitHub Actions**. `scripts/apply-github-meta.sh --with-pages` can do this instead through the API. The first deployment runs on the next push to `main` that touches the gallery inputs, or from Actions → Pages → Run workflow.
3. **Release.** Releases → Draft a new release → tag `v0.1.0`, title `skill-gallery v0.1.0`, body from [`release-v0.1.0.md`](release-v0.1.0.md). Its counts were checked against `runs/` on 2026-10-26 (24 of 24 cells).
4. Optional: in About (the gear next to the description), tick "Use your GitHub Pages website" if the homepage field is empty.
