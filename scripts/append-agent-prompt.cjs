#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('node:fs')
const path = require('node:path')

const args = process.argv.slice(2)

const getArg = (name) => {
  const index = args.indexOf(`--${name}`)
  if (index === -1) return null
  const value = args[index + 1]
  if (!value || value.startsWith('--')) return null
  return value
}

const promptArg = getArg('prompt')
const promptFile = getArg('prompt-file')
const summary = getArg('summary')
const files = getArg('files')

if (!promptArg && !promptFile) {
  console.error('Missing required --prompt "..." or --prompt-file <path>')
  process.exit(1)
}

const readPrompt = () => {
  if (promptFile) {
    return fs.readFileSync(path.resolve(process.cwd(), promptFile), 'utf8')
  }

  if (promptArg === '-') {
    // Read stdin fully (supports: cat prompt.txt | node ... --prompt -)
    return fs.readFileSync(0, 'utf8')
  }

  return promptArg
}

const prompt = readPrompt()

const repoRoot = path.resolve(__dirname, '..')
const logPath = path.join(repoRoot, 'src', 'data', 'agent-prompts.json')

const now = new Date()
const iso = now.toISOString()

const raw = fs.readFileSync(logPath, 'utf8')
const data = JSON.parse(raw)

if (!data.sessions || !Array.isArray(data.sessions) || data.sessions.length === 0) {
  data.sessions = [
    {
      id: iso.slice(0, 10),
      startedAt: iso,
      userPrompts: [],
      highLevelSummary: {
        outcome: '',
        keyTech: [],
        deploymentNotes: [],
        notableUX: []
      },
      filesTouchedExamples: []
    }
  ]
}

const session = data.sessions[data.sessions.length - 1]
session.userPromptEntries = Array.isArray(session.userPromptEntries) ? session.userPromptEntries : []

// Migrate legacy string prompts if present
if (Array.isArray(session.userPrompts) && session.userPrompts.length && session.userPromptEntries.length === 0) {
  session.userPromptEntries = session.userPrompts.map((p, index) => ({
    id: `legacy-${index + 1}`,
    at: null,
    prompt: p,
    verbatim: false
  }))
}

const last = session.userPromptEntries[session.userPromptEntries.length - 1]
if (last && typeof last.prompt === 'string' && last.prompt.trim() === prompt.trim()) {
  console.log('Latest entry already matches prompt; skipping append.')
  process.exit(0)
}

const nextId = `p${String(session.userPromptEntries.length + 1).padStart(3, '0')}`
const entry = {
  id: nextId,
  at: iso,
  prompt,
  verbatim: true
}

if (summary) {
  entry.summary = summary
}

if (files) {
  const parsed = files
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  entry.files = parsed
}

session.userPromptEntries.push(entry)

fs.writeFileSync(logPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
console.log(`Appended prompt to ${path.relative(repoRoot, logPath)} at ${iso}`)
