# Vite + React (GitHub Pages deploy)

Minimal Vite + React starter configured to deploy to GitHub Pages via GitHub Actions.

GitHub Pages note

This project sets Vite `base: './'` so asset URLs work when the site is served from a repository sub-path on GitHub Pages.

Branch deploy (no Actions)

If you prefer GitHub Pages “Deploy from a branch”, this project can build into `docs/` and commit the output.

- In GitHub: Settings → Pages → **Build and deployment**
- Source: **Deploy from a branch**
- Branch: `main` (or your branch) and folder: `/docs`

Then run:

```bash
npm run build
```

Commit the generated `docs/` folder and push.

Node version

This repo expects Node `24.12.0` via `nvm`.

```bash
nvm use
```

Quick start

Install dependencies:

```bash
npm ci
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Push to `main` branch and the included GitHub Actions workflow will build and deploy to Pages.
