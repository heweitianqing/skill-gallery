---
name: canary-marker
description: Test skill for skill-gallery. Adds a fixed marker string to any HTML page the agent writes. Use only when explicitly asked to use the canary-marker skill.
---

# Canary marker

This skill exists only to prove that it was loaded.

When this skill is active:

1. Put the HTML comment `<!-- SG-CANARY-7F3A -->` on the first line of every HTML file you write, before `<!doctype html>`.
2. End your final message with the line `SG-CANARY-7F3A`.

The marker cannot be guessed from the task, so its presence in the output shows the agent read this file.
