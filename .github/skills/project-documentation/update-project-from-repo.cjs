#!/usr/bin/env node
/* eslint-disable no-console */

const { spawnSync } = require('node:child_process')
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

const hasFlag = (name) => args.includes(`--${name}`)

const repoUrl = getArg('repo')
const slug = getArg('slug')
const branch = getArg('branch')

if (!repoUrl || !slug) {
  console.error(
    'Usage: node .github/skills/project-documentation/update-project-from-repo.cjs --repo <git-url> --slug <slug> [--branch <name>] [--update-description] [--copy-screenshot]'
  )
  process.exit(1)
}

const repoRoot = path.resolve(__dirname, '..', '..', '..')
const projectsPath = path.join(repoRoot, 'src', 'data', 'projects.ts')
const scanScript = path.join(__dirname, 'scan-project-repo.cjs')

const runScan = () => {
  const scanArgs = [
    scanScript,
    '--repo',
    repoUrl,
    ...(branch ? ['--branch', branch] : []),
    '--json',
    '--include-temp-path'
  ]

  const result = spawnSync(process.execPath, scanArgs, { encoding: 'utf8' })
  if (result.status !== 0) {
    process.stderr.write(result.stderr || '')
    process.stderr.write(result.stdout || '')
    throw new Error('scan-project-repo failed')
  }

  // The scan script may print a "Cloning to ..." line before JSON.
  const jsonStart = (result.stdout || '').indexOf('{')
  if (jsonStart === -1) throw new Error('scan output missing JSON')
  const jsonText = (result.stdout || '').slice(jsonStart)
  return JSON.parse(jsonText)
}

const indentOf = (text, index) => {
  const lineStart = text.lastIndexOf('\n', index) + 1
  const line = text.slice(lineStart, index)
  const m = line.match(/^[\t ]+/)
  return m ? m[0] : ''
}

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true })
}

const copyScreenshotIntoPublic = (scan) => {
  if (!hasFlag('copy-screenshot')) return null
  if (!scan || !scan.tempClonePath || !scan.screenshotPathInRepo) return null

  const sourcePath = path.join(scan.tempClonePath, scan.screenshotPathInRepo)
  if (!fs.existsSync(sourcePath)) return null

  const ext = path.extname(sourcePath).toLowerCase() || '.png'
  const destDir = path.join(repoRoot, 'public', 'project-screenshots')
  ensureDir(destDir)

  const destPath = path.join(destDir, `${slug}${ext}`)
  fs.copyFileSync(sourcePath, destPath)

  // Use BASE_URL so it works on GitHub Pages subpaths.
  return `\`${'${import.meta.env.BASE_URL}'}project-screenshots/${slug}${ext}\``
}

const sanitizeUrl = (url) => {
  if (!url) return null
  let next = String(url).trim()
  // Common README markdown artifacts
  next = next.replace(/\)\.?$/, '')
  next = next.replace(/\.$/, '')
  return next
}

const formatStringArray = (items, indent) => {
  const safe = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  if (!items || items.length === 0) return '[]'
  if (items.length <= 3 && items.every((s) => String(s).length < 24)) {
    return `[${items.map((s) => `'${safe(s)}'`).join(', ')}]`
  }

  const innerIndent = `${indent}  `
  return `[` +
    `\n${items.map((s) => `${innerIndent}'${safe(s)}'`).join(',\n')}` +
    `\n${indent}]`
}

const removeDuplicateProps = (objectText, key) => {
  const keyRe = new RegExp(`\n[\t ]*${key}\s*:`, 'g')
  const hits = []
  for (const match of objectText.matchAll(keyRe)) {
    hits.push(match.index)
  }
  if (hits.length <= 1) return objectText

  const findPropEnd = (text, startIndex) => {
    // startIndex points at the leading "\n" before the key
    let i = startIndex + 1
    let inString = null // '\'', '"', '`'
    let escape = false
    let depthSquare = 0
    let depthParen = 0
    let depthBrace = 0

    for (; i < text.length; i += 1) {
      const ch = text[i]
      if (escape) {
        escape = false
        continue
      }

      if (inString) {
        if (ch === '\\') {
          escape = true
          continue
        }
        if (ch === inString) {
          inString = null
        }
        continue
      }

      if (ch === '\'' || ch === '"' || ch === '`') {
        inString = ch
        continue
      }

      if (ch === '[') depthSquare += 1
      else if (ch === ']') depthSquare = Math.max(0, depthSquare - 1)
      else if (ch === '(') depthParen += 1
      else if (ch === ')') depthParen = Math.max(0, depthParen - 1)
      else if (ch === '{') depthBrace += 1
      else if (ch === '}') {
        // if we hit the end of the object, stop before it
        if (depthSquare === 0 && depthParen === 0 && depthBrace === 0) return i
        depthBrace = Math.max(0, depthBrace - 1)
      }

      // a property ends at the first comma at depth 0
      if (ch === ',' && depthSquare === 0 && depthParen === 0 && depthBrace === 0) {
        // include trailing whitespace/newline after comma
        let j = i + 1
        while (j < text.length && /[\t \r\n]/.test(text[j])) j += 1
        return j
      }
    }

    return text.length
  }

  // Remove duplicates from the end to avoid index shifts.
  let next = objectText
  for (let i = hits.length - 1; i >= 1; i -= 1) {
    const start = hits[i]
    const end = findPropEnd(next, start)
    next = next.slice(0, start) + next.slice(end)
  }

  return next
}

const replaceOrInsertProp = ({ objectText, objectStart, objectEnd, key, valueText, objectIndent }) => {
  const propRe = new RegExp(`(^|\\n)([\\t ]*)${key}\\s*:\\s*([\\s\\S]*?)(,\\s*(\\n|$))`, 'm')
  const match = objectText.match(propRe)

  if (match) {
    const fullMatch = match[0]
    const propIndent = match[2] || objectIndent
    const replacement = `${match[1]}${propIndent}${key}: ${valueText},\n`
    const updated = objectText.replace(fullMatch, replacement)
    return { updatedText: updated, delta: updated.length - objectText.length }
  }

  // Insert before closing brace
  const insertAt = objectText.lastIndexOf('}')
  if (insertAt === -1) return { updatedText: objectText, delta: 0 }

  let prefix = objectText.slice(0, insertAt)
  const suffix = objectText.slice(insertAt)

  const prefixTrimmed = prefix.replace(/[\t \r\n]+$/, '')
  const lastChar = prefixTrimmed[prefixTrimmed.length - 1]
  const needsComma = prefixTrimmed.length > 0 && lastChar !== '{' && lastChar !== ','

  prefix = prefixTrimmed + (needsComma ? ',' : '')
  const insertion = `\n${objectIndent}${key}: ${valueText},`
  const updatedText = prefix + insertion + suffix
  return { updatedText, delta: updatedText.length - objectText.length }
}

const updateProjectsTs = ({ slugToUpdate, updates, updateDescription }) => {
  const src = fs.readFileSync(projectsPath, 'utf8')

  const slugNeedle = `slug: '${slugToUpdate}'`
  const slugIndex = src.indexOf(slugNeedle)
  if (slugIndex === -1) {
    throw new Error(`Could not find project with ${slugNeedle} in ${projectsPath}`)
  }

  // Find the object literal boundaries by scanning braces.
  const objectStart = src.lastIndexOf('{', slugIndex)
  if (objectStart === -1) throw new Error('Could not locate project object start')

  let depth = 0
  let objectEnd = -1
  for (let i = objectStart; i < src.length; i += 1) {
    const ch = src[i]
    if (ch === '{') depth += 1
    if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        objectEnd = i + 1
        break
      }
    }
  }
  if (objectEnd === -1) throw new Error('Could not locate project object end')

  const objectText = src.slice(objectStart, objectEnd)
  const closeIndent = indentOf(src, objectStart)
  const objectIndent = closeIndent + '  '

  let updatedObject = objectText

  if (updateDescription && updates.description) {
    const desc = updates.description.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    updatedObject = replaceOrInsertProp({
      objectText: updatedObject,
      objectStart,
      objectEnd,
      key: 'description',
      valueText: `'${desc}'`,
      objectIndent
    }).updatedText
  }

  if (updates.liveUrl) {
    const live = updates.liveUrl.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    updatedObject = replaceOrInsertProp({
      objectText: updatedObject,
      objectStart,
      objectEnd,
      key: 'liveUrl',
      valueText: `'${live}'`,
      objectIndent
    }).updatedText
  }

  if (updates.screenshotUrl) {
    updatedObject = replaceOrInsertProp({
      objectText: updatedObject,
      objectStart,
      objectEnd,
      key: 'screenshotUrl',
      valueText: updates.screenshotUrl,
      objectIndent
    }).updatedText
  }

  if (updates.techUsed && updates.techUsed.length) {
    updatedObject = replaceOrInsertProp({
      objectText: updatedObject,
      objectStart,
      objectEnd,
      key: 'techUsed',
      valueText: formatStringArray(updates.techUsed, objectIndent),
      objectIndent
    }).updatedText
  }

  if (updates.highlights && updates.highlights.length) {
    updatedObject = replaceOrInsertProp({
      objectText: updatedObject,
      objectStart,
      objectEnd,
      key: 'highlights',
      valueText: formatStringArray(updates.highlights, objectIndent),
      objectIndent
    }).updatedText
  }

  if (updates.whatILearned && updates.whatILearned.length) {
    updatedObject = replaceOrInsertProp({
      objectText: updatedObject,
      objectStart,
      objectEnd,
      key: 'whatILearned',
      valueText: formatStringArray(updates.whatILearned, objectIndent),
      objectIndent
    }).updatedText
  }

  for (const key of ['liveUrl', 'screenshotUrl', 'techUsed', 'whatILearned', 'highlights', 'description']) {
    updatedObject = removeDuplicateProps(updatedObject, key)
  }

  // Ensure the closing brace is on its own line (prevents `...],},` style output).
  const closeIndex = updatedObject.lastIndexOf('}')
  if (closeIndex !== -1) {
    let j = closeIndex
    while (j > 0 && (updatedObject[j - 1] === ' ' || updatedObject[j - 1] === '\t')) j -= 1
    if (updatedObject[j - 1] !== '\n') {
      updatedObject = updatedObject.slice(0, j) + `\n${closeIndent}` + updatedObject.slice(j)
    }
  }

  const next = src.slice(0, objectStart) + updatedObject + src.slice(objectEnd)
  fs.writeFileSync(projectsPath, next, 'utf8')
}

const main = () => {
  const scan = runScan()

  const screenshotUrl = copyScreenshotIntoPublic(scan)

  const updates = {
    description: scan.description || null,
    liveUrl: sanitizeUrl(scan.liveUrl) || null,
    screenshotUrl,
    techUsed: Array.isArray(scan.techUsed) ? scan.techUsed : [],
    whatILearned: Array.isArray(scan.whatILearned) ? scan.whatILearned : [],
    highlights: Array.isArray(scan.highlights) ? scan.highlights : []
  }

  updateProjectsTs({
    slugToUpdate: slug,
    updates,
    updateDescription: hasFlag('update-description')
  })

  console.log(`Updated src/data/projects.ts for slug: ${slug}`)
  if (screenshotUrl) console.log('Copied screenshot into public/project-screenshots/')
}

try {
  main()
} catch (err) {
  console.error(String(err && err.message ? err.message : err))
  process.exit(1)
}
