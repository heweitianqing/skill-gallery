**English** · [简体中文](CONTRIBUTING.zh-CN.md)

# Contributing to skill-gallery

Thanks for helping. The gallery is only useful if every result is produced the same way, so most of this page is about keeping runs fair.

## Ways to help

- **Suggest a skill.** Use the [skill suggestion form](https://github.com/heweitianqing/skill-gallery/issues/new?template=skill-suggestion.yml). Give the repository, the folder that contains `SKILL.md`, and the license.
- **Report a problem with a result.** A broken screenshot, wrong data in a `run.json`, wrong install steps, or a fairness concern: use the [result problem form](https://github.com/heweitianqing/skill-gallery/issues/new?template=result-problem.yml).
- **Fix a translation.** The translated READMEs were made with AI. Pull requests from native speakers are very welcome (see [Translations](#translations)).
- **Add a skill yourself.** See below.

## Ground rules for results

1. **One generation per cell, no picking.** Do not rerun a cell because you prefer another result. Rerun only if the run produced no `index.html`, the skill did not fire (`skill_triggered: false`), or the run broke for a reason outside the agent (network outage, expired login). The runner moves the earlier attempt to `runs/<prompt>/_attempts/` and lists it in `previous_attempts`; keep both in the pull request.
2. **Do not edit generated files.** `index.html`, `run.json`, `transcript.jsonl` and the screenshots in `runs/` stay exactly as the scripts wrote them.
3. **Use the scripts.** `scripts/run-claude.mjs` and `scripts/run-codex.mjs` create the isolated environment and record the evidence. Results produced any other way cannot be accepted.
4. **Never commit credentials.** The runners keep tokens outside the repository; check `git status` before you commit.
5. **Skill files are not stored here.** `scripts/fetch-skill.mjs` downloads each skill at its pinned commit or CLI version into the git-ignored `.cache/skills/`.

## Adding a skill

1. **Metadata.** Create `skills/<name>/meta.yaml`, using an existing one as a template. It records:
   - `upstream`: repository URL, a full commit SHA, the path of the skill folder, and a pinned link to `SKILL.md`;
   - `license`: SPDX id and a pinned link to the license file;
   - `fetch`: `method: git` (sparse checkout of the pinned commit) or `method: npm-cli` (the skill's own installer at an exact version);
   - `install` and `invoke`: how a reader installs and calls the skill in Claude Code and in Codex;
   - `notes`: anything a reader needs to know (runtime requirements, known gotchas).
2. **Fetch it.** `node scripts/fetch-skill.mjs <name>` and check that the cached folder contains `SKILL.md`.
3. **Run the six skill cells**, once each:

   ```bash
   for p in landing-saas dashboard blog-portfolio; do
     node scripts/run-codex.mjs "$p" <name>
     node scripts/run-claude.mjs "$p" <name>
   done
   node scripts/screenshot.mjs
   ```

   The native cells are shared by all skills; do not rerun them.
4. **Add it to the site.** Put the name in `site/config.json` (`skills`). The gallery takes the skill's summary, source, license and install notes from `meta.yaml`.
5. **Rebuild.** `node scripts/build-site.mjs` (gallery in `site/dist/`) and `node scripts/build-readme.mjs` (tables in every README). Preview with `python3 -m http.server 8000 --directory site/dist`.
6. **Open a pull request** with `skills/<name>/meta.yaml`, the new `runs/` cells, the site and README changes, and the regenerated `docs/launch/` images.

Skills have to be public, and their license has to allow fetching and running them. A skill that needs a paid service, an account or network access during the run is hard to compare fairly; say so in the suggestion.

## Translations

The README comes in six languages; the gallery is in English with key notes in Chinese.

| Part | Files |
| --- | --- |
| README | `README.<lang>.md` |
| Text inside the README's generated tables | `scripts/build-readme.strings.json` |
| This guide | `CONTRIBUTING.zh-CN.md` (others welcome) |

- Keep `{placeholders}` and anything inside backticks unchanged.
- Do not translate the names skill, Codex, Claude Code, or file and field names.
- The prompt files in `prompts/` are never translated: they are the exact input the agents received.
- In the READMEs, leave the `<!-- results:start -->`, `<!-- skills:start -->` and `<!-- credits:start -->` blocks alone; `scripts/build-readme.mjs` rewrites them.

To add a README language, add an entry for it to `scripts/build-readme.strings.json`, create `README.<code>.md` from `README.md`, add it to the language links at the top of every README, and run `node scripts/build-readme.mjs`.

## Code

The build scripts (`scripts/build-site.mjs`, `scripts/build-readme.mjs`) use only Node built-ins; please keep it that way. `build-readme.mjs` uses Playwright (already a dev dependency) only to render the two images in `docs/launch/`.

By contributing, you agree that your contribution is released under the repository's [MIT License](LICENSE). Third-party skills keep their own licenses.
