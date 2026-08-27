# Contributing

This repository is a skill package. Each skill is a directory under `skills/` with a `SKILL.md` file. People install the package with:

```bash
npx skills add ziedhajsalah/agent-skills
```

## Add a skill

1. Pick a kebab-case name. It must match the folder name and the `name` field in frontmatter.
2. Create `skills/<skill-name>/SKILL.md`. Start from `templates/SKILL.template.md`.
3. Write a `description` that covers both what the skill does and when an agent should load it. Include trigger phrases. Minimum 40 characters, enforced by the validator, because shorter descriptions do not route reliably.
4. Put the procedure in the Markdown body. Keep it under 500 lines. Split detail into `references/`, `scripts/`, or `assets/` as needed.
5. Add the skill to a group in `skills.sh.json`.
6. Add a row to the skills table in `README.md`.
7. Run `npm install` once, then `npm run validate`.

Frontmatter rules are in the [Agent Skills specification](https://agentskills.io/specification). This file is the single source for the procedure; other docs link here instead of restating it.

## Vendoring a third-party skill

Skills copied from another repository are welcome when the license allows it.

1. Confirm the upstream license permits redistribution and is compatible with MIT.
2. Copy the upstream notice to `skills/<name>/LICENSE` and set `license: LICENSE` in frontmatter.
3. Credit the author and link the upstream source in frontmatter `metadata`. Keep
   credit out of the body so the body stays diffable against upstream.
4. Keep the body byte-identical to upstream where the license allows it, and set
   `metadata.vendored: verbatim`. Pulling a later upstream version is then a diff,
   not a merge. The validator skips the trigger-phrase warning for these skills,
   since their description is upstream's to write.

Edit a vendored body only when it is actually broken in this catalog, and say so
in the commit message. `skills/unslop` is the worked example: frontmatter adds
`license` and `metadata`, and every other byte is upstream's.

## What belongs in a skill

Skills are for workflows the agent should load on demand: deploy, review, extract, author. Put rules that apply to every task in `AGENTS.md` instead.

Do not add a `SKILL.md` at the repository root. The CLI treats a root `SKILL.md` as a single-skill package.

## Scripts

If you add `scripts/`, keep them self-contained, document arguments in `SKILL.md`, and avoid surprising side effects. Treat skill scripts like code you would run yourself.

## License

Contributions are MIT, same as the repository.
