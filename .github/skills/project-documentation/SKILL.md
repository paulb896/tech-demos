---
name: project-documentation
description: Document a software project in this repo’s portfolio data model by extracting tech stack, learnings, screenshot, and live links from a Git repository and updating src/data/projects.ts for the ProjectPage.
---

# Project Documentation (Portfolio)

## When to use this skill

Use this skill when the user asks to:

- “Document a project” / “Fill in the project details page”
- Add or enrich entries in `src/data/projects.ts`
- Extract `techUsed`, `whatILearned`, `liveUrl`, or a screenshot reference from a GitHub repo

## Goal

Produce a high-quality `Project` entry for `src/data/projects.ts` that makes the project detail page useful:

- Clear one-line description
- Links: GitHub + optional live/demo
- Screenshot (optional but preferred)
- Tech used (short, scannable)
- What I learned (concrete bullets)
- Highlights (features/usage pulled from README)

## Workflow

1) Identify the target project
- If a project already exists in `src/data/projects.ts`, note its `slug`.
- If it doesn’t exist, create a new entry with a new `slug`.

2) Scan the project repository
- Run the scanner script bundled with this skill:

  ```bash
  node .github/skills/project-documentation/scan-project-repo.cjs --repo <git-url> --json
  ```

- Prefer scanning the canonical GitHub repo URL.
- If the repo has a non-default branch, pass `--branch <name>`.

3) Convert scan output into portfolio fields

- `description`
  - Use a clean, human sentence (not HTML/badges). If scan output is noisy, rewrite it.

- `techUsed`
  - Keep to ~5–10 items.
  - Prefer product/framework names over package names (example: “React”, “Vite”, “TypeScript”, “Postgres”).

- `whatILearned`
  - Prefer 3–7 bullets.
  - Each bullet should be specific (tradeoff, design decision, performance win, operational lesson).

- `highlights`
  - Prefer 3–8 bullets.
  - Use README “Features/Usage/How it works” content.

- `liveUrl`
  - Use a real demo URL if present.
  - If none exists, omit it.

- `screenshotUrl`
  - The deployed site is on GitHub Pages; URLs should work under a base path.
  - Preferred: store images in `public/` and reference them via `import.meta.env.BASE_URL`.

  Example:

  ```ts
  screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/<slug>.png`
  ```

  If you only have a screenshot inside the scanned repo, either:
  - Copy it into this repo’s `public/project-screenshots/` (preferred), or
  - Omit `screenshotUrl`.

4) Update the portfolio data

- Edit `src/data/projects.ts`:
  - Add/update the target project entry with: `githubUrl`, `liveUrl`, `screenshotUrl`, `techUsed`, `whatILearned`.

### Optional: automatic update (preferred)

Instead of manually copy/pasting the scan output, run the updater script:

```bash
node .github/skills/project-documentation/update-project-from-repo.cjs \
  --slug <slug> \
  --repo <git-url> \
  --copy-screenshot
```

Options:

- `--copy-screenshot`: if the repo contains an image named like “screenshot/demo/screen”, copy it into `public/project-screenshots/` and set `screenshotUrl`.
- `--update-description`: overwrite the existing `description` using README-derived text (off by default).

### Optional: capture a screenshot from a public website

For work projects or repos without a screenshot asset, capture a screenshot directly from a public URL.

```bash
node .github/skills/project-documentation/capture-website-screenshot.cjs \
  --url <https://public-site.example.com> \
  --slug <slug>
```

To also capture a full-page screenshot (in addition to the viewport screenshot):

```bash
node .github/skills/project-documentation/capture-website-screenshot.cjs \
  --url <https://public-site.example.com> \
  --slug <slug> \
  --also-full-page
```

This will save `public/project-screenshots/<slug>.png` and print a `screenshotUrl` value that works on GitHub Pages.

5) Sanity check

- Run:

  ```bash
  npm run lint
  npm run build
  ```

## Expected output example

Input:

```bash
node .github/skills/project-documentation/scan-project-repo.cjs --repo https://github.com/OWNER/REPO --json
```

Output (what to apply into `src/data/projects.ts`):

```ts
{
  slug: 'my-project',
  name: 'My Project',
  description: 'One sentence describing what it does and why it matters.',
  githubUrl: 'https://github.com/OWNER/REPO',
  liveUrl: 'https://my-project.example.com',
  screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/my-project.png`,
  techUsed: ['TypeScript', 'React', 'Vite', 'Node.js'],
  whatILearned: [
    'How to structure a Vite build for GitHub Pages base paths.',
    'How to keep UI state and URL routing in sync with HashRouter.',
    'Where three.js material settings create realistic glass tradeoffs.'
  ]
}
```

## Notes / constraints

- Avoid inventing facts. If the repo doesn’t clearly state a tech or a link, omit it.
- Keep the UI simple: don’t add new pages or components for this workflow; only update `src/data/projects.ts` (and add assets under `public/` when needed).
