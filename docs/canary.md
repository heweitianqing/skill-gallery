# Skill trigger canary

Before trusting `skill_triggered`, we ran a test skill whose only job is to leave a marker that cannot be guessed from the task.

- Skill: [scripts/canary/skills/canary-marker/SKILL.md](../scripts/canary/skills/canary-marker/SKILL.md). It tells the agent to put `<!-- SG-CANARY-7F3A -->` on the first line of every HTML file and to end its reply with `SG-CANARY-7F3A`.
- Prompt: [scripts/canary/prompts/canary.md](../scripts/canary/prompts/canary.md), a one-line "write a Hello page" task. The runner appends the same kind of skill line as in the real cells.
- Command:

  ```bash
  SG_PROMPTS_DIR=scripts/canary/prompts SG_RUNS_DIR=/tmp/canary-runs \
    node scripts/run-codex.mjs canary canary-marker scripts/canary/skills/canary-marker
  ```

## Codex (`codex exec`, codex-cli 0.164.0, gpt-6.1-sol)

Result: [docs/canary/codex/](canary/codex/) (`run.json`, `transcript.jsonl`, `index.html`).

- The skill was installed only at `$RUN/work/.agents/skills/canary-marker/` and showed up in the model's skills list as a second root (`r1 = $RUN/work/.agents/skills`), next to the bundled `.system` skills.
- The prompt ended with `Use the $canary-marker skill.` Codex resolved the `$canary-marker` mention under `codex exec` and injected a `<skill><name>canary-marker</name><path>…/SKILL.md</path>…</skill>` block holding the full SKILL.md into the conversation. The block is recorded in the session rollout as a `response_item` message.
- The agent also ran `cat .agents/skills/canary-marker/SKILL.md` itself (visible in `transcript.jsonl` as a `command_execution` item).
- `index.html` starts with `<!-- SG-CANARY-7F3A -->`, and the final message ends with the marker. The behavior came from the skill.

So `$name` works in `codex exec`, and either signal is enough evidence.

## How `skill_triggered` is decided

| Agent | `skill_triggered` is `true` when | Evidence fields |
| --- | --- | --- |
| Codex | the rollout contains a `<skill>` block whose `<name>` is the skill under test (Codex loaded SKILL.md because of the explicit `$name` mention), **or** a tool call / shell command read `<name>/SKILL.md` | `skill_evidence.injected`, `skill_evidence.skill_md_reads` |
| Claude | a `Skill` tool call for the skill under test returned without error (the Skill tool loads SKILL.md), **or** a `Read`/`Bash` call read `<name>/SKILL.md` | `skill_evidence.skill_tool_calls`, `skill_evidence.skill_content_loaded`, `skill_evidence.skill_md_reads` |

A skill cell with `skill_triggered: false` is marked failed (`failure_reasons: ["skill_not_triggered"]`). For Codex, the cell also fails if the skill is missing from the skills list the model was given (`skill_not_listed`), which would mean it was installed in the wrong place.

The Claude side of the canary has not run yet: it needs the one-time token from `scripts/setup-claude-auth.sh`.
