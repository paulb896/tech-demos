# Copilot Instructions (Project)

This repo maintains an append-only prompt log used by the "Generated with Agent Prompts" page.

## Required on every new prompt

When responding to a new user prompt in this repository:

1. Append an entry to `src/data/agent-prompts.json`.
2. Do **not** include private chain-of-thought. Record only:
   - The full user prompt text (verbatim)
   - Date/time
   - High-level outcome/summary
   - Files changed (optional)

## How to append

Prefer using the helper script:

- `node scripts/append-agent-prompt.cjs --prompt "<user prompt>" --summary "<one-line outcome>" --files "src/foo.tsx,src/bar.ts"`

If the script is not used, edit `src/data/agent-prompts.json` manually and keep it valid JSON.

Note: the current log lives at `src/data/agent-prompts.json`.

## Schema expectations

- Keep `schemaVersion` unchanged unless you migrate old data.
- Append to `sessions[0].userPromptEntries` for ongoing work (preferred), or add a new session object for a new work session.
