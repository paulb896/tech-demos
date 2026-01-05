#!/usr/bin/env node
/* eslint-disable no-console */

const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const args = process.argv.slice(2)

const getArg = (name) => {
  const index = args.indexOf(`--${name}`)
  if (index === -1) return null
  const value = args[index + 1]
  if (!value || value.startsWith('--')) return null
  return value
}

const hasFlag = (name) => args.includes(`--${name}`)

const repoUrl = getArg('repo')
const branch = getArg('branch')

if (!repoUrl) {
  console.error('Usage: node .github/skills/project-documentation/scan-project-repo.cjs --repo <git-url> [--branch <name>] [--json]')
  process.exit(1)
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tech-demos-scan-'))
const repoDir = path.join(tempRoot, 'repo')

const runGit = (gitArgs) => {
  execFileSync('git', gitArgs, { stdio: 'ignore' })
}

const readTextIfExists = (filePath, maxBytes = 250_000) => {
  try {
    const buf = fs.readFileSync(filePath)
    return buf.slice(0, maxBytes).toString('utf8')
  } catch {
    return null
  }
}

const exists = (filePath) => {
  try {
    fs.accessSync(filePath)
    return true
  } catch {
    return false
  }
}

const listFiles = (dir, maxFiles = 50_000) => {
  const out = []
  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    if (!current) continue

    let entries
    try {
      entries = fs.readdirSync(current, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      if (out.length >= maxFiles) return out
      if (entry.name === '.git') continue
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) stack.push(full)
      else out.push(full)
    }
  }

  return out
}

const parsePackageJsonDeps = (text) => {
  try {
    const json = JSON.parse(text)
    const deps = Object.keys(json.dependencies || {})
    const dev = Object.keys(json.devDependencies || {})
    return Array.from(new Set([...deps, ...dev])).sort()
  } catch {
    return []
  }
}

const extractLinks = (text) => {
  const links = new Set()
  const re = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g
  for (const match of text.matchAll(re)) {
    links.add(match[0])
  }
  return Array.from(links)
}

const chooseLiveUrl = (links) => {
  const priority = ['demo', 'live', 'app', 'vercel', 'netlify', 'github.io', 'render.com', 'fly.dev', 'railway.app']
  for (const key of priority) {
    const found = links.find((l) => l.toLowerCase().includes(key))
    if (found) return found
  }
  return links[0] || null
}

const sanitizeUrl = (url) => {
  if (!url) return null
  let next = String(url).trim()
  next = next.replace(/\)\.?$/, '')
  next = next.replace(/\.$/, '')
  return next
}

const collapseWhitespace = (text) => {
  if (!text) return text
  return String(text)
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const stripHtml = (text) => {
  if (!text) return text
  return collapseWhitespace(String(text)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim())
}

const stripMarkdownLinks = (text) => {
  if (!text) return text
  // [label](url) -> label
  return collapseWhitespace(String(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`+/g, '')
    .trim())
}

const stripCodeBlocks = (text) => {
  if (!text) return text
  // Remove fenced code blocks completely.
  return String(text)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
}

const extractReadmeSection = (readme, headings) => {
  if (!readme) return null
  const lines = readme.split(/\r?\n/)
  const lower = (s) => s.toLowerCase()

  const headingIndexes = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim()
    if (!line.startsWith('#')) continue
    const name = line.replace(/^#+\s*/, '').trim()
    if (headings.some((h) => lower(name) === lower(h))) headingIndexes.push(i)
  }

  if (!headingIndexes.length) return null
  const start = headingIndexes[0]
  const startLevel = (lines[start].match(/^#+/) || ['#'])[0].length

  const body = []
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i]
    const isHeading = /^#+\s+/.test(line)
    if (isHeading) {
      const level = (line.match(/^#+/) || ['#'])[0].length
      if (level <= startLevel) break
    }
    body.push(line)
  }

  const text = body.join('\n').trim()
  return text || null
}

const bulletize = (sectionText, maxItems = 8) => {
  if (!sectionText) return []
  const lines = stripCodeBlocks(sectionText)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const bullets = []
  for (const line of lines) {
    const m = line.match(/^[-*+]\s+(.*)$/)
    if (m && m[1]) bullets.push(m[1].trim())
  }

  if (bullets.length) return bullets.slice(0, maxItems)

  // If the section is written as headings (common for "Usage"), treat them as bullets.
  const headingBullets = []
  for (const line of lines) {
    const m = line.match(/^#{2,6}\s+(.*)$/)
    if (!m || !m[1]) continue
    const cleaned = stripMarkdownLinks(stripHtml(m[1].trim()))
    if (!cleaned) continue
    headingBullets.push(cleaned)
    if (headingBullets.length >= maxItems) break
  }

  if (headingBullets.length) return headingBullets

  // fallback: split paragraphs into sentences
  const joined = lines.map((l) => stripMarkdownLinks(stripHtml(l))).join(' ')
  const sentences = joined
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return sentences.slice(0, Math.min(maxItems, sentences.length))
}

const extractFirstBulletBlock = (readme, maxItems = 8) => {
  if (!readme) return []
  const lines = readme.split(/\r?\n/)
  const bullets = []
  let inBlock = false

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      if (inBlock && bullets.length) break
      continue
    }

    const m = line.match(/^[-*+]\s+(.*)$/)
    if (m && m[1]) {
      inBlock = true
      const cleaned = stripMarkdownLinks(stripHtml(m[1].trim()))
      if (cleaned) bullets.push(cleaned)
      if (bullets.length >= maxItems) break
      continue
    }

    // Stop if we already started collecting and hit a non-bullet line.
    if (inBlock && bullets.length) break
  }

  return bullets
}

console.log(`Cloning to ${repoDir} ...`)
runGit(['clone', '--depth', '1', ...(branch ? ['--branch', branch] : []), repoUrl, repoDir])

const packageJsonPath = path.join(repoDir, 'package.json')
const packageLockPath = path.join(repoDir, 'package-lock.json')
const readmeCandidates = ['README.md', 'Readme.md', 'readme.md'].map((n) => path.join(repoDir, n))
const readmePath = readmeCandidates.find((p) => exists(p)) || null
const readmeText = readmePath ? readTextIfExists(readmePath) : null

const deps = exists(packageJsonPath) ? parsePackageJsonDeps(readTextIfExists(packageJsonPath) || '') : []
const packageLockText = exists(packageLockPath) ? readTextIfExists(packageLockPath, 400_000) : null

const files = listFiles(repoDir)
const extCounts = new Map()
for (const file of files) {
  const ext = path.extname(file).toLowerCase()
  if (!ext) continue
  extCounts.set(ext, (extCounts.get(ext) || 0) + 1)
}

const topExts = Array.from(extCounts.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([ext]) => ext)

const readmeLinks = readmeText ? extractLinks(readmeText) : []
const liveUrl = sanitizeUrl(chooseLiveUrl(readmeLinks))

const screenshot = files.find((f) => {
  const lower = f.toLowerCase()
  const isImage = lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')
  if (!isImage) return false
  return lower.includes('screenshot') || lower.includes('screen') || lower.includes('demo')
})

const learnedSection = extractReadmeSection(readmeText, ['What I learned', 'Lessons learned', 'Learnings', 'Retrospective'])
const whatILearned = bulletize(learnedSection)

const highlightsSection =
  extractReadmeSection(readmeText, ['Features', 'Key features', 'Highlights']) ||
  extractReadmeSection(readmeText, ['How it works', 'How it works?']) ||
  extractReadmeSection(readmeText, ['Usage', 'How to use', 'Getting started'])
const highlights = bulletize(highlightsSection)
const fallbackHighlights = highlights.length ? [] : extractFirstBulletBlock(readmeText)

const lowerReadme = (readmeText || '').toLowerCase()
const lowerLock = (packageLockText || '').toLowerCase()
const hasFileNamed = (name) => {
  const target = String(name).toLowerCase()
  return files.some((f) => path.basename(f).toLowerCase() === target)
}

const techUsed = []
if (deps.includes('react')) techUsed.push('React')
if (deps.includes('next')) techUsed.push('Next.js')
if (deps.includes('vite')) techUsed.push('Vite')
if (deps.includes('@react-three/fiber')) techUsed.push('react-three-fiber')
if (deps.includes('three')) techUsed.push('three.js')
if (deps.includes('express')) techUsed.push('Express')
if (deps.includes('typescript')) techUsed.push('TypeScript')

// Infra/runtime signals
if (hasFileNamed('dockerfile') || hasFileNamed('.dockerfile') || files.some((f) => path.basename(f).toLowerCase().startsWith('dockerfile.'))) {
  techUsed.push('Docker')
}

if (
  files.some((f) => path.basename(f).toLowerCase().startsWith('docker-compose')) ||
  lowerReadme.includes('docker compose') ||
  lowerReadme.includes('docker-compose')
) {
  techUsed.push('Docker Compose')
}

if (deps.includes('pg') || lowerReadme.includes('postgres') || lowerReadme.includes('postgresql')) {
  techUsed.push('Postgres')
}

if (lowerReadme.includes('ollama')) {
  techUsed.push('Ollama')
}

if (
  lowerReadme.includes('bedrock') ||
  deps.some((d) => d.startsWith('@aws-sdk/client-bedrock')) ||
  deps.includes('@aws-sdk/credential-providers') ||
  lowerLock.includes('@langchain/aws') ||
  lowerLock.includes('client-bedrock')
) {
  techUsed.push('AWS Bedrock')
}

for (const d of deps.slice(0, 25)) {
  if (techUsed.length >= 16) break
  // keep a handful of useful deps even if not mapped
  if (['eslint', 'prettier', 'vitest', 'jest', 'react-router-dom', 'tailwindcss'].includes(d)) {
    techUsed.push(d)
  }
}

const description = (() => {
  if (!readmeText) return null
  const lines = readmeText.split(/\r?\n/)
  // skip header, blank lines, badges
  for (let i = 0; i < Math.min(lines.length, 40); i += 1) {
    const line = lines[i].trim()
    if (!line) continue
    if (line.startsWith('#')) continue
    if (line.startsWith('![') || line.startsWith('[![')) continue
    if (line.includes('shields.io')) continue
    if (line.startsWith('<') || line.toLowerCase().includes('<img')) continue
    const parts = [line]

    // Join a few wrapped lines that look like a continuation of the sentence.
    for (let j = i + 1; j < Math.min(lines.length, i + 6); j += 1) {
      const next = lines[j].trim()
      if (!next) break
      if (next.startsWith('#')) break
      if (next.startsWith('- ') || next.startsWith('* ') || next.startsWith('+ ')) break
      if (next.startsWith('![') || next.startsWith('[![')) break
      if (/^```/.test(next) || /^~~~/.test(next)) break
      parts.push(next)
      if (/[.!?]$/.test(next)) break
    }

    const cleaned = stripMarkdownLinks(stripHtml(parts.join(' ')))
    if (!cleaned) continue
    if (cleaned.length < 6) continue
    return cleaned
  }
  return null
})()

const result = {
  githubUrl: repoUrl,
  description,
  liveUrl,
  screenshotPathInRepo: screenshot ? path.relative(repoDir, screenshot) : null,
  techUsed: Array.from(new Set(techUsed)),
  whatILearned,
  highlights: highlights.length ? highlights : fallbackHighlights,
  repoSignals: {
    topExtensions: topExts,
    dependencyCount: deps.length,
    hasReadme: Boolean(readmeText)
  }
}

if (hasFlag('include-temp-path')) {
  result.tempClonePath = repoDir
}

if (hasFlag('json')) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
} else {
  console.log('\nSuggested project fields:')
  console.log(JSON.stringify(result, null, 2))
  console.log(`\nTemp clone is at: ${repoDir}`)
  console.log('Remove it when done.')
}
