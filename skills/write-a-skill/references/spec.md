# Agent Skills spec (short)

Full spec: https://agentskills.io/specification

## Required layout

```
skill-name/
  SKILL.md
  scripts/       optional
  references/    optional
  assets/        optional
```

`SKILL.md` must start with YAML frontmatter, then Markdown.

## Required fields

| Field | Rules |
| --- | --- |
| `name` | 1–64 chars. `a-z`, `0-9`, hyphens. No leading, trailing, or consecutive hyphens. Must match the parent directory. |
| `description` | 1–1024 chars. Non-empty. What it does and when to use it. |

## Optional fields

| Field | Use |
| --- | --- |
| `license` | Short license name or bundled file name. |
| `compatibility` | Max 500 chars. Only if the skill needs specific tools, packages, or network access. |
| `metadata` | String-to-string map for extra fields (author, version). |
| `allowed-tools` | Experimental. Space-separated pre-approved tools. Support varies by agent. Skip unless you have a reason. |

## Valid names

```yaml
name: pdf-processing
name: code-review
name: write-a-skill
```

Invalid: `PDF-Processing`, `-pdf`, `pdf--processing`, `pdf_processing`.

## Skills.sh discovery

The `skills` CLI looks for `SKILL.md` in:

- `skills/` (flat or one to two category levels)
- The repo root, only if that root itself is a single skill
- Several agent-specific skill directories

This catalog uses `skills/<skill-name>/SKILL.md`. Do not add a root `SKILL.md`.

`skills.sh.json` at the repo root only changes how the skills.sh website groups the repo page. It does not change install behavior.
