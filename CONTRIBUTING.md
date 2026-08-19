# Contributing

This repository is a skill package. Each skill is a directory under `skills/` with a `SKILL.md` file. People install the package with:

```bash
npx skills add ziedhajsalah/agent-skills
```

## Add a skill

1. Pick a kebab-case name. It must match the folder name and the `name` field in frontmatter.
2. Create `skills/<skill-name>/SKILL.md`. Start from `skills/write-a-skill/assets/SKILL.template.md`.
3. Write a `description` that covers both what the skill does and when an agent should load it. Include trigger phrases.
4. Put the procedure in the Markdown body. Keep it under 500 lines. Split detail into `references/`, `scripts/`, or `assets/` as needed.
5. Add the skill to a group in `skills.sh.json`.
6. Add a row to the skills table in `README.md`.
7. Run `npm run validate`.

Frontmatter rules are in the [Agent Skills specification](https://agentskills.io/specification). The `write-a-skill` skill is the in-repo checklist for agents.

## What belongs in a skill

Skills are for workflows the agent should load on demand: deploy, review, extract, author. Put rules that apply to every task in `AGENTS.md` instead.

Do not add a `SKILL.md` at the repository root. The CLI treats a root `SKILL.md` as a single-skill package.

## Scripts

If you add `scripts/`, keep them self-contained, document arguments in `SKILL.md`, and avoid surprising side effects. Treat skill scripts like code you would run yourself.

## License

Contributions are MIT, same as the repository.
