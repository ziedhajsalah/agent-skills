# Authoring notes

## Description is the trigger

Agents decide whether to load a skill from `name` + `description`. Write the description like a routing rule.

Weak:

```yaml
description: Helps with PDFs.
```

Strong:

```yaml
description: Extract text and tables from PDF files, fill forms, and merge documents. Use when the user mentions PDFs, forms, scanning, or document extraction.
```

Include concrete verbs and the words a user would type. If the skill under-triggers, the description is too timid. If it over-triggers, it is too broad.

## Body structure that holds up

Use this shape unless the workflow needs a different one:

1. What this skill does in one short paragraph
2. When not to use it
3. Inputs you need before starting
4. Numbered procedure
5. Done criteria
6. Failure modes only if they are non-obvious

Write instructions in the imperative. Do not explain the domain unless the model is likely to get the project-specific part wrong.

## Progressive disclosure

1. Metadata (`name`, `description`) is always available.
2. The `SKILL.md` body loads when the skill activates. Stay under 500 lines.
3. `references/`, `scripts/`, and `assets/` load only when the body tells the agent to use them.

Point to extra files with relative paths from the skill root:

```markdown
See [the API notes](references/api.md).
Run `node scripts/check.mjs`.
```

Do not chain reference files more than one level deep.

## Freedom vs rigidity

- Open-ended work (review, writing): steps and heuristics.
- Preferred pattern with some variation: a template plus parameters.
- Fragile sequences (migrations, publishes): exact commands, no extra flags.

## Catalog edits

When adding a skill to this repository:

- Folder lives at `skills/<name>/`
- `name` in frontmatter equals `<name>`
- Group it in `skills.sh.json`
- List it in `README.md`
- Run `npm run validate`

Always-on repo rules go in `AGENTS.md`. Skills are for on-demand workflows.
