#!/usr/bin/env node
/**
 * Validate skill packages: SKILL.md frontmatter, directory naming, and
 * skills.sh.json groupings. Frontmatter parsing is delegated to gray-matter.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LIMITS = { name: 64, description: 1024, compatibility: 500, lines: 500 };
const MIN_DESCRIPTION = 40;

const errors = [];
const warnings = [];

function validateSkill(name) {
  const label = `skills/${name}`;
  const file = join(ROOT, "skills", name, "SKILL.md");

  let parsed;
  try {
    parsed = matter(readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${label}: cannot read or parse SKILL.md (${error.message})`);
    return;
  }

  const { name: fmName, description, compatibility, metadata } = parsed.data;
  const verbatim = metadata?.vendored === "verbatim";

  if (fmName !== name) {
    errors.push(`${label}: frontmatter name "${fmName}" must match the directory name`);
  } else if (name.length > LIMITS.name || !NAME_PATTERN.test(name)) {
    errors.push(`${label}: name must be kebab-case and at most ${LIMITS.name} characters`);
  }

  if (typeof description !== "string" || description.length < MIN_DESCRIPTION) {
    errors.push(`${label}: description must be at least ${MIN_DESCRIPTION} characters so it triggers reliably`);
  } else if (description.length > LIMITS.description) {
    errors.push(`${label}: description exceeds ${LIMITS.description} characters (${description.length})`);
  } else if (!verbatim && !/use when|use this skill/i.test(description)) {
    warnings.push(`${label}: description should say when to use the skill, not only what it does`);
  }

  if (typeof compatibility === "string" && compatibility.length > LIMITS.compatibility) {
    errors.push(`${label}: compatibility exceeds ${LIMITS.compatibility} characters`);
  }

  const lines = parsed.content.split("\n").length;
  if (lines > LIMITS.lines) {
    errors.push(`${label}: SKILL.md body has ${lines} lines; keep it under ${LIMITS.lines} and move detail into references/`);
  }

  if (!/^#\s+\S/m.test(parsed.content)) {
    errors.push(`${label}: SKILL.md body needs a top-level Markdown heading`);
  }
}

function validateManifest(names) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(ROOT, "skills.sh.json"), "utf8"));
  } catch (error) {
    errors.push(`skills.sh.json is missing or invalid (${error.message})`);
    return;
  }

  if (!Array.isArray(manifest.groupings) || manifest.groupings.length === 0) {
    errors.push("skills.sh.json must include a non-empty groupings array");
    return;
  }

  const grouped = new Set();
  for (const group of manifest.groupings) {
    if (!group?.title?.trim() || !Array.isArray(group.skills) || group.skills.length === 0) {
      errors.push(`skills.sh.json grouping ${JSON.stringify(group?.title ?? null)} needs a title and at least one skill`);
      continue;
    }
    for (const skill of group.skills) {
      if (!names.includes(skill)) {
        errors.push(`skills.sh.json grouping "${group.title}" references unknown skill "${skill}"`);
      }
      if (grouped.has(skill)) {
        warnings.push(`skills.sh.json lists "${skill}" in more than one group; the first group wins`);
      }
      grouped.add(skill);
    }
  }

  for (const name of names.filter((n) => !grouped.has(n))) {
    errors.push(`skill "${name}" is missing from skills.sh.json; add it to a group`);
  }
}

const entries = readdirSync(join(ROOT, "skills"), { withFileTypes: true })
  .filter((entry) => !entry.name.startsWith("."));

for (const entry of entries.filter((e) => !e.isDirectory())) {
  errors.push(`skills/ must contain only skill directories; found file "${entry.name}"`);
}

const names = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
if (names.length === 0) {
  errors.push("No skill directories found under skills/");
}

for (const name of names) {
  validateSkill(name);
}
validateManifest(names);

for (const warning of warnings) {
  console.warn(`warning: ${warning}`);
}
for (const error of errors) {
  console.error(`error: ${error}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s) across ${names.length} skill(s).`);
  process.exit(1);
}

console.log(`ok: ${names.length} skill(s) valid (${warnings.length} warning(s)).`);
