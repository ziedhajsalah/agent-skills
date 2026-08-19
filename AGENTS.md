# Agent notes

Guidance for coding agents working in this repository.

## What this repo is

A skill package for [skills.sh](https://skills.sh). Users install it with:

```bash
npx skills add ziedhajsalah/agent-skills
```

The CLI finds `SKILL.md` files under `skills/` (up to three levels). Do not put a `SKILL.md` at the repo root. That would make the whole repo look like one skill.

## Add or edit a skill

Read `skills/write-a-skill/SKILL.md` and follow it. Summary:

1. Create `skills/<skill-name>/` with kebab-case that matches frontmatter `name`.
2. Write `SKILL.md` with YAML `name` and `description`. The description must say what the skill does and when to use it.
3. Keep `SKILL.md` under 500 lines. Move long material to `references/`.
4. Add the skill to `skills.sh.json` and the table in `README.md`.
5. Run `npm run validate`.

Always-on rules for *this* repo belong here or in `CONTRIBUTING.md`. Specialized procedures belong in skills.

## Validate before you finish

```bash
npm run validate
```

Fix every error. Treat warnings as errors unless you have a reason to leave them.

## Do not

- Invent extra package managers, registries, or publish steps. Git plus `npx skills add` is the distribution path.
- Add `scripts/` that run unexpected network or filesystem changes. If a skill has scripts, say what they do in `SKILL.md`.
- Copy third-party skills verbatim. Write original instructions.
