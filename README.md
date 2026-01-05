# Vite + React (GitHub Pages deploy)

Minimal Vite + React starter configured to deploy to GitHub Pages via GitHub Actions.

GitHub Pages note

This project sets Vite `base: './'` so asset URLs work when the site is served from a repository sub-path on GitHub Pages.

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
