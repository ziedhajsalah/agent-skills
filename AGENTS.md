# Agent notes

Guidance for coding agents working in this repository.

## What this repo is

A skill package for [skills.sh](https://skills.sh). Users install it with:

```bash
npx skills add ziedhajsalah/agent-skills
```

The CLI finds `SKILL.md` files under `skills/` (up to three levels). Do not put a `SKILL.md` at the repo root. That would make the whole repo look like one skill.

## Add or edit a skill

The procedure lives in `CONTRIBUTING.md`. Follow it there rather than repeating it here.

Always-on rules for *this* repo belong in this file. On-demand workflows belong in skills.

## Validate before you finish

```bash
npm run validate
```

Fix every error. Treat warnings as errors unless you have a reason to leave them.

## Do not

- Invent extra package managers, registries, or publish steps. Git plus `npx skills add` is the distribution path.
- Add `scripts/` that run unexpected network or filesystem changes. If a skill has scripts, say what they do in `SKILL.md`.
- Vendor a third-party skill without checking its license, bundling the notice
  in `skills/<name>/LICENSE`, and crediting the author in frontmatter `metadata`
  and the skill body. `skills/unslop` is the worked example.
