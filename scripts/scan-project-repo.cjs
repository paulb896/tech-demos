#!/usr/bin/env node
/* eslint-disable no-console */

const { spawnSync } = require('node:child_process')
const path = require('node:path')

const scriptPath = path.join(
  __dirname,
  '..',
  '.github',
  'skills',
  'project-documentation',
  'scan-project-repo.cjs'
)

const result = spawnSync(process.execPath, [scriptPath, ...process.argv.slice(2)], { stdio: 'inherit' })
process.exit(typeof result.status === 'number' ? result.status : 1)
