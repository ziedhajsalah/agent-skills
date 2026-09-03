# Agent skills

Installable skills for AI coding agents. Each skill is a folder with a `SKILL.md` file that agents load when the task matches.

This repository is a [skills.sh](https://skills.sh) package. The `skills` CLI discovers every `skills/*/SKILL.md` and installs those folders into Claude Code, Cursor, OpenCode, Codex, and other supported agents.

[![skills.sh](https://skills.sh/b/ziedhajsalah/agent-skills)](https://skills.sh/ziedhajsalah/agent-skills)

## Install

```bash
npx skills add ziedhajsalah/agent-skills
```

List skills without installing:

```bash
npx skills add ziedhajsalah/agent-skills --list
```

Install one skill:

```bash
npx skills add ziedhajsalah/agent-skills --skill unslop
```

Target specific agents:

```bash
npx skills add ziedhajsalah/agent-skills -a claude-code -a cursor -a opencode -a codex
```

Install globally (user-level, all projects):

```bash
npx skills add ziedhajsalah/agent-skills -g
```

After install, the agent reads each skill's `name` and `description` at session start. It loads the full `SKILL.md` only when the task matches.

## Skills

| Skill | Use when |
| --- | --- |
| [amanda-review-mode](skills/amanda-review-mode/SKILL.md) | Pre-reviewing a PR the way Amanda would |
| [how](skills/how/SKILL.md) | Answering "how does X work" and critiquing subsystem architecture |
| [unslop](skills/unslop/SKILL.md) | A draft reads like AI wrote it and needs an edit pass |

## Layout

```
skills/
  <skill-name>/
    SKILL.md          required: YAML frontmatter + instructions
    scripts/          optional: commands the agent can run
    references/       optional: docs loaded on demand
    assets/           optional: templates and other files
skills.sh.json         groups skills on the skills.sh repo page
scripts/validate.mjs   checks frontmatter, names, and the grouping file
templates/             starting file for a new skill
```

`npx skills add` walks `skills/` up to three levels deep and installs every directory that contains a valid `SKILL.md`. Keep one skill per folder. The folder name must match the `name` field in frontmatter.

Put always-on rules in `AGENTS.md`. Put specialized workflows in skills so they stay out of context until needed.

## Authoring

See [CONTRIBUTING.md](CONTRIBUTING.md) for the procedure. Frontmatter rules live in the [Agent Skills specification](https://agentskills.io/specification).

## Discovery on skills.sh

There is no publish command. skills.sh indexes GitHub repos after someone installs them with `npx skills add`. Repo page grouping comes from `skills.sh.json`. That file does not change CLI install behavior.

## Validate

```bash
npm install
npm run validate
```

Requires Node.js 18 or later. The only dependency is `gray-matter`, used to parse frontmatter.

## License

[MIT](LICENSE)
