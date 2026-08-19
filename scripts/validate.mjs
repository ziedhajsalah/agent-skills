#!/usr/bin/env node
/**
 * Validate skill packages in this repository.
 *
 * Checks SKILL.md frontmatter against the Agent Skills spec, enforces
 * directory naming, and verifies skills.sh.json groupings.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");
const MANIFEST_PATH = join(ROOT, "skills.sh.json");

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 1024;
const MAX_COMPATIBILITY_LENGTH = 500;
const MAX_SKILL_LINES = 500;
const MIN_DESCRIPTION_LENGTH = 40;

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function listSkillDirs() {
  let entries;
  try {
    entries = readdirSync(SKILLS_DIR, { withFileTypes: true });
  } catch {
    fail(`Missing skills directory at ${relative(ROOT, SKILLS_DIR)}`);
    return [];
  }

  const dirs = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = join(SKILLS_DIR, entry.name);
    if (!entry.isDirectory()) {
      fail(`Unexpected file in skills/: ${entry.name}`);
      continue;
    }
    dirs.push({ name: entry.name, path: fullPath });
  }
  return dirs.sort((a, b) => a.name.localeCompare(b.name));
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(text, label) {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    fail(`${label}: SKILL.md must start with YAML frontmatter delimited by ---`);
    return null;
  }

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    fail(`${label}: SKILL.md frontmatter is not closed with ---`);
    return null;
  }

  const yaml = normalized.slice(4, end);
  const body = normalized.slice(end + 5);
  const fields = {};
  const lines = yaml.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "" || line.trimStart().startsWith("#")) {
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      fail(`${label}: cannot parse frontmatter line "${line}"`);
      continue;
    }

    const key = match[1];
    let value = match[2];

    if (value === "|" || value === ">" || value === "|-" || value === ">-") {
      const block = [];
      i += 1;
      while (i < lines.length && (lines[i] === "" || /^\s+/.test(lines[i]))) {
        block.push(lines[i].replace(/^\s{2}/, ""));
        i += 1;
      }
      i -= 1;
      value = block.join("\n").trim();
    } else if (value === "") {
      const nested = {};
      i += 1;
      while (i < lines.length) {
        const nestedLine = lines[i];
        if (nestedLine.trim() === "") {
          i += 1;
          continue;
        }
        const nestedMatch = nestedLine.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!nestedMatch) {
          i -= 1;
          break;
        }
        nested[nestedMatch[1]] = unquote(nestedMatch[2]);
        i += 1;
      }
      i -= 1;
      value = nested;
    } else {
      value = unquote(value);
    }

    fields[key] = value;
  }

  return { fields, body, lineCount: normalized.split("\n").length };
}

function validateSkill(skill) {
  const label = `skills/${skill.name}`;
  const skillFile = join(skill.path, "SKILL.md");

  let stat;
  try {
    stat = statSync(skillFile);
  } catch {
    fail(`${label}: missing SKILL.md`);
    return;
  }
  if (!stat.isFile()) {
    fail(`${label}: SKILL.md is not a file`);
    return;
  }

  const text = readFileSync(skillFile, "utf8");
  const parsed = parseFrontmatter(text, label);
  if (!parsed) {
    return;
  }

  const { fields, body, lineCount } = parsed;
  const name = fields.name;
  const description = fields.description;

  if (typeof name !== "string" || name.length === 0) {
    fail(`${label}: frontmatter is missing name`);
  } else {
    if (name !== skill.name) {
      fail(`${label}: name "${name}" must match the directory name`);
    }
    if (name.length > MAX_NAME_LENGTH) {
      fail(`${label}: name exceeds ${MAX_NAME_LENGTH} characters`);
    }
    if (!NAME_PATTERN.test(name)) {
      fail(
        `${label}: name must be lowercase alphanumeric with single hyphens (no leading, trailing, or consecutive hyphens)`,
      );
    }
  }

  if (typeof description !== "string" || description.length === 0) {
    fail(`${label}: frontmatter is missing description`);
  } else {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      fail(
        `${label}: description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${description.length})`,
      );
    }
    if (description.length < MIN_DESCRIPTION_LENGTH) {
      fail(
        `${label}: description is too short to trigger reliably (${description.length} chars; need at least ${MIN_DESCRIPTION_LENGTH})`,
      );
    }
    const lower = description.toLowerCase();
    if (!lower.includes("use when") && !lower.includes("use this skill")) {
      warn(
        `${label}: description should say what the skill does and when to use it`,
      );
    }
  }

  if (fields.compatibility && fields.compatibility.length > MAX_COMPATIBILITY_LENGTH) {
    fail(
      `${label}: compatibility exceeds ${MAX_COMPATIBILITY_LENGTH} characters`,
    );
  }

  if (lineCount > MAX_SKILL_LINES) {
    fail(
      `${label}: SKILL.md has ${lineCount} lines; keep it under ${MAX_SKILL_LINES} and move detail into references/`,
    );
  }

  if (!/^#\s+\S/m.test(body)) {
    fail(`${label}: SKILL.md body needs a top-level Markdown heading`);
  }
}

function validateManifest(skillNames) {
  let raw;
  try {
    raw = readFileSync(MANIFEST_PATH, "utf8");
  } catch {
    fail("Missing skills.sh.json at the repository root");
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (error) {
    fail(`skills.sh.json is not valid JSON: ${error.message}`);
    return;
  }

  if (!Array.isArray(manifest.groupings) || manifest.groupings.length === 0) {
    fail("skills.sh.json must include a non-empty groupings array");
    return;
  }

  if (
    manifest.notGrouped !== undefined &&
    manifest.notGrouped !== "top" &&
    manifest.notGrouped !== "bottom"
  ) {
    fail('skills.sh.json notGrouped must be "top" or "bottom"');
  }

  const seen = new Set();
  const skillSet = new Set(skillNames);

  for (const group of manifest.groupings) {
    if (!group || typeof group.title !== "string" || group.title.trim() === "") {
      fail("skills.sh.json grouping is missing a title");
      continue;
    }
    if (!Array.isArray(group.skills) || group.skills.length === 0) {
      fail(`skills.sh.json grouping "${group.title}" needs at least one skill`);
      continue;
    }
    for (const skill of group.skills) {
      if (typeof skill !== "string" || skill.trim() === "") {
        fail(`skills.sh.json grouping "${group.title}" has an empty skill name`);
        continue;
      }
      if (!skillSet.has(skill)) {
        fail(
          `skills.sh.json grouping "${group.title}" references unknown skill "${skill}"`,
        );
      }
      if (seen.has(skill)) {
        warn(
          `skills.sh.json lists "${skill}" in more than one group; the first group wins on skills.sh`,
        );
      }
      seen.add(skill);
    }
  }

  for (const name of skillNames) {
    if (!seen.has(name)) {
      warn(
        `skill "${name}" is not listed in skills.sh.json and will appear under Other skills`,
      );
    }
  }
}

const skills = listSkillDirs();
if (skills.length === 0 && errors.length === 0) {
  fail("No skill directories found under skills/");
}

for (const skill of skills) {
  validateSkill(skill);
}
validateManifest(skills.map((skill) => skill.name));

for (const warning of warnings) {
  console.warn(`warning: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`error: ${error}`);
  }
  console.error(
    `\n${errors.length} error(s), ${warnings.length} warning(s) across ${skills.length} skill(s).`,
  );
  process.exit(1);
}

console.log(
  `ok: ${skills.length} skill(s) valid (${warnings.length} warning(s)).`,
);
