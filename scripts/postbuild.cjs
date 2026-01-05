/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const docsDir = path.join(process.cwd(), 'docs')

if (!fs.existsSync(docsDir)) {
  console.warn('postbuild: docs/ not found; skipping')
  process.exit(0)
}

const noJekyllPath = path.join(docsDir, '.nojekyll')
fs.writeFileSync(noJekyllPath, '')
