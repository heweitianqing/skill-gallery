# skills/

Skills under test. Each skill gets its own folder:

```
skills/<skill-name>/
  source.json   # where the skill came from: {"url": "...", "commit": "...", "path": "..."}
  SKILL.md      # (optional) vendored copy, only if the skill's license allows redistribution
```

Third-party skills keep their own licenses. The repository's MIT license does not apply to them.

The run scripts take the skill's source directory (the folder that contains `SKILL.md`) as an argument and copy it into the throwaway run directory's project-level skill location. Nothing is installed globally.
