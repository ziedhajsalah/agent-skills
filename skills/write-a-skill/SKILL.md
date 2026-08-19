---
name: write-a-skill
description: Create, edit, and review Agent Skills (SKILL.md packages) so they install with npx skills add and work in Claude Code, Cursor, OpenCode, Codex, and other agents. Use when the user wants a new skill, to capture a workflow as a skill, to fix skill frontmatter or triggering, to split a skill into references/scripts/assets, or to make a catalog installable on skills.sh.
license: MIT
metadata:
  author: ziedhajsalah
  version: "1.0"
---

# Write a skill

Author a portable Agent Skill. A skill is a folder with `SKILL.md`. Agents read `name` and `description` at startup, then load the body only when the task matches.

If you are in this catalog (a `skills/` directory and `skills.sh.json` at the repo root), add the skill here so `npx skills add ziedhajsalah/agent-skills` can install it. If you are in another repo, still use the same folder shape.

## Read first

1. [references/spec.md](references/spec.md) for frontmatter constraints.
2. [references/authoring.md](references/authoring.md) for trigger text, body structure, and when to split files.
3. [assets/SKILL.template.md](assets/SKILL.template.md) as the starting file.

## Decide if this should be a skill

Write a skill when the work is a specialized workflow that should stay out of context until needed.

Put the rule in `AGENTS.md` (or the host agent's always-on file) when it must apply to almost every task.

Do not create a skill that only restates what the model already knows. Teach project-specific steps, constraints, and done criteria.

## Procedure

1. **Name it.** Lowercase letters, numbers, single hyphens. No leading, trailing, or consecutive hyphens. Max 64 characters. Folder name must equal `name`.
2. **Write the description as a router.** Say what the skill does and when to use it. Include the phrases a user would actually type. Put all triggering guidance in `description`, not only in the body.
3. **Create the folder.** `skills/<name>/SKILL.md` in this catalog. Copy [assets/SKILL.template.md](assets/SKILL.template.md).
4. **Write the body.** Imperative steps, inputs, constraints, and how to know the work is done. Assume the model is competent. Keep `SKILL.md` under 500 lines.
5. **Split on demand.** Long reference material goes in `references/`. Repeatable commands go in `scripts/`. Templates and static files go in `assets/`. Link those files from `SKILL.md` with relative paths. Keep links one level deep.
6. **Register it in this catalog.** Add the skill to a group in `skills.sh.json`. Add a row to the skills table in `README.md`.
7. **Validate.** From the repo root run `npm run validate`. Fix every error.

## Review an existing skill

Check, in order:

- Frontmatter `name` matches the directory.
- `description` is specific enough that a similar-but-wrong task would not trigger it, and the real task would.
- Body is a procedure, not an essay.
- Extra files are actually referenced from `SKILL.md`.
- `npm run validate` passes.

## Done when

- `skills/<name>/SKILL.md` exists with valid frontmatter.
- `npm run validate` exits 0.
- README and `skills.sh.json` include the new skill when working in this catalog.
