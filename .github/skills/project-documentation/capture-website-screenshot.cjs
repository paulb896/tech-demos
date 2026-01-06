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

const clickIfVisible = async (locator) => {
  try {
    if (await locator.first().isVisible({ timeout: 500 })) {
      await locator.first().click({ timeout: 1500 })
      return true
    }
  } catch {
    // best-effort
  }
  return false
}

const deriveFullPagePath = (filePath) => {
  const parsed = path.parse(filePath)
  return path.join(parsed.dir, `${parsed.name}-full${parsed.ext || '.png'}`)
}

const closePrivacyChoicesModal = async (page) => {
  // EA web properties often show a cookie/privacy modal titled "Your Privacy Choices".
  // Best-effort: find a dialog containing that text and click a close button.
  try {
    const dialog = page.getByRole('dialog').filter({ hasText: /your privacy choices/i })
    if (await dialog.first().isVisible({ timeout: 500 })) {
      const closeButton = dialog
        .first()
        .getByRole('button', { name: /close|dismiss|x/i })

      if (await clickIfVisible(closeButton)) return true

      // Fallback: aria-label close
      const ariaClose = dialog.first().locator('[aria-label*="close" i]')
      if (await clickIfVisible(ariaClose)) return true

      // Last resort: try Escape
      await page.keyboard.press('Escape')
      return true
    }
  } catch {
    // best-effort
  }

  return false
}

const dismissCommonModals = async (page) => {
  // Best-effort cookie/consent dismissal heuristics.
  // We keep this intentionally broad but safe: only click visible buttons.
  const buttonNames = [
    /accept all/i,
    /accept/i,
    /agree/i,
    /i agree/i,
    /ok/i,
    /got it/i,
    /continue/i,
    /yes/i
  ]

  // Try a few passes because some sites animate consent banners in.
  const start = Date.now()
  while (Date.now() - start < 7000) {
    let clicked = false

    // Close explicit privacy-choice dialogs if present.
    clicked = (await closePrivacyChoicesModal(page)) || clicked

    // TrustArc banner close button (commonly used on EA sites).
    clicked = (await clickIfVisible(page.locator('#truste-consent-button'))) || clicked
    clicked = (await clickIfVisible(page.locator('.truste-banner-close'))) || clicked

    // Prefer explicit accept buttons.
    for (const re of buttonNames) {
      clicked = (await clickIfVisible(page.getByRole('button', { name: re }))) || clicked
    }

    // Some banners use <a> elements styled as buttons.
    for (const re of buttonNames) {
      clicked = (await clickIfVisible(page.getByRole('link', { name: re }))) || clicked
    }

    // Common close/dismiss controls.
    clicked = (await clickIfVisible(page.getByRole('button', { name: /close|dismiss|deny/i }))) || clicked
    clicked = (await clickIfVisible(page.locator('[aria-label*="close" i]'))) || clicked
    clicked = (await clickIfVisible(page.locator('[data-testid*="close" i]'))) || clicked

    if (!clicked) {
      await page.waitForTimeout(350)
      continue
    }

    // Give layout a moment to settle after clicks.
    await page.waitForTimeout(500)
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

    await dismissCommonModals(page)

    // Wait a bit longer before capture to allow images and client-side hydration to settle.
    await page.waitForTimeout(8000)

    // Some sites can end up scrolled down (e.g., focus/anchor/footer). Force top before capture.
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(600)

    // One more pass in case a banner appeared late.
    await dismissCommonModals(page)
    await page.waitForTimeout(400)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)

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
