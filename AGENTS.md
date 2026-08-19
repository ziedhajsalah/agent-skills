# Agent notes

Read by agents working on this catalog. It does not ship to people who install
these skills; `npx skills add` copies `skills/*/` and nothing else.

## What this repo is

A skill package for [skills.sh](https://skills.sh). Users install it with:

```bash
npx skills add ziedhajsalah/agent-skills
```

The CLI finds `SKILL.md` files under `skills/` (up to three levels). Do not put a `SKILL.md` at the repo root. That would make the whole repo look like one skill.

## Add or edit a skill

The procedure lives in `CONTRIBUTING.md`. Follow it there rather than repeating it here.

Rules for contributors go in this file. Anything a user of the catalog should
get belongs in a skill under `skills/`, because that is the only part that
ships.

## Validate before you finish

```bash
npm ci && npm run validate
```

Fix every error. Treat warnings as errors unless you have a reason to leave them.

## Do not

- Invent extra package managers, registries, or publish steps. Git plus `npx skills add` is the distribution path.
- Add `scripts/` that run unexpected network or filesystem changes. If a skill has scripts, say what they do in `SKILL.md`.
- Vendor a third-party skill without checking its license, bundling the notice
  in `skills/<name>/LICENSE`, and crediting the author in frontmatter `metadata`.
  See "Vendoring a third-party skill" in `CONTRIBUTING.md`.
