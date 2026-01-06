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

const hasFlag = (name) => args.includes(`--${name}`)

const url = getArg('url')
const slug = getArg('slug')
const outFile = getArg('out')

if (!url || (!slug && !outFile)) {
  console.error(
    'Usage: node .github/skills/project-documentation/capture-website-screenshot.cjs --url <https://...> (--slug <slug> | --out <path>) [--full-page] [--also-full-page]'
  )
  process.exit(1)
}

const repoRoot = path.resolve(__dirname, '..', '..', '..')
const defaultOut = slug
  ? path.join(repoRoot, 'public', 'project-screenshots', `${slug}.png`)
  : null

const outputPath = path.resolve(outFile || defaultOut)

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true })
}

const deriveFullPagePath = (filePath) => {
  const parsed = path.parse(filePath)
  return path.join(parsed.dir, `${parsed.name}-full${parsed.ext || '.png'}`)
}

const removeCommonOverlays = async (page) => {
  // Removes common privacy/cookie overlays without clicking anything.
  // This avoids accidental navigation (some "dismiss" actions are actually links).
  try {
    await page.evaluate(() => {
      const selectors = [
        // TrustArc
        '#truste-consent-button',
        '.truste-banner-close',
        '#truste-consent-track',
        '#truste-consent-content',
        '#truste-consent',
        '#truste-consent-overlay',
        '#truste-consent-manager',
        '#truste-consent-required',
        '#truste-consent-required-overlay',
        '[id^="truste-"]',
        '[class*="truste" i]',
        // Common cookie/consent containers
        '[id*="cookie" i][role="dialog"]',
        '[class*="cookie" i][role="dialog"]'
      ]

      const shouldRemoveDialog = (el) => {
        try {
          const text = (el.textContent || '').toLowerCase()
          return text.includes('your privacy choices') || text.includes('cookie') || text.includes('consent')
        } catch {
          return false
        }
      }

      const removeNode = (node) => {
        if (!node) return
        try {
          node.remove()
        } catch {
          try {
            node.style.display = 'none'
            node.style.visibility = 'hidden'
            node.style.pointerEvents = 'none'
          } catch {
            // ignore
          }
        }
      }

      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach((el) => removeNode(el))
      }

      // Target privacy choice dialogs specifically.
      document.querySelectorAll('[role="dialog"]').forEach((el) => {
        if (shouldRemoveDialog(el)) removeNode(el)
      })

      // Some sites use full-screen backdrops.
      document.querySelectorAll('[class*="backdrop" i], [class*="overlay" i]').forEach((el) => {
        const style = window.getComputedStyle(el)
        const isFixed = style.position === 'fixed'
        const covers = el.clientWidth >= window.innerWidth * 0.9 && el.clientHeight >= window.innerHeight * 0.9
        if (isFixed && covers) removeNode(el)
      })
    })
  } catch {
    // best-effort
  }
}

const main = async () => {
  // Lazy-load so `npm install` isn't required unless used.
  let chromium
  try {
    ;({ chromium } = require('playwright'))
  } catch {
    console.error('Playwright is not installed.')
    console.error('Run: npm i')
    process.exit(1)
  }

  ensureDir(path.dirname(outputPath))

  const browser = await chromium.launch({
    headless: true
  })

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    })

    const page = await context.newPage()

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 })

    // Give client-side apps a moment to paint after initial load.
    await page.waitForTimeout(2500)

    await removeCommonOverlays(page)

    // Wait a bit longer before capture to allow images and client-side hydration to settle.
    await page.waitForTimeout(8000)

    // Some sites can end up scrolled down (e.g., focus/anchor/footer). Force top before capture.
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(600)

    // One more pass in case a banner appeared late.
    await removeCommonOverlays(page)
    await page.waitForTimeout(400)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)

    if (hasFlag('debug')) {
      try {
        const debug = await page.evaluate(() => ({
          url: String(location.href),
          title: document.title,
          scrollHeight: document.documentElement ? document.documentElement.scrollHeight : null,
          bodyScrollHeight: document.body ? document.body.scrollHeight : null
        }))
        console.log(`Capture target: ${debug.url}`)
        console.log(`Capture title: ${debug.title}`)
        console.log(`Capture height: ${debug.scrollHeight} (body: ${debug.bodyScrollHeight})`)
      } catch {
        // best-effort
      }
    }

    const wantsFullPage = hasFlag('full-page')
    const wantsBoth = hasFlag('also-full-page')

    const fullPath = deriveFullPagePath(outputPath)

    if (wantsBoth) {
      await page.screenshot({ path: outputPath, fullPage: false })
      await page.screenshot({ path: fullPath, fullPage: true })
      console.log(`Saved screenshot: ${outputPath}`)
      console.log(`Saved full-page screenshot: ${fullPath}`)
    } else {
      await page.screenshot({
        path: outputPath,
        fullPage: wantsFullPage
      })

      console.log(`Saved screenshot: ${outputPath}`)
    }

    if (slug) {
      console.log(
        `Suggested screenshotUrl: ${'`'}${'${import.meta.env.BASE_URL}'}project-screenshots/${slug}.png${'`'}`
      )

      if (wantsBoth) {
        console.log(
          `Suggested full screenshotUrl: ${'`'}${'${import.meta.env.BASE_URL}'}project-screenshots/${slug}-full.png${'`'}`
        )
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(String(err && err.message ? err.message : err))
  console.error('\nIf this fails due to missing browsers, run:')
  console.error('  npx playwright install chromium')
  process.exit(1)
})
