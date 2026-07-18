# PCOS Tracker

Professional Angular-based PCOS tracker for daily symptoms, glossary management, and appointment preparation.

## Features

- Dashboard summary with responsive navbar and professional card-based UI
- Daily tracker with reactive form for medication, cycle, symptoms, mood, and sleep
- Glossary view with search filter and note capture
- Appointment planner with dynamic question and lab-result form arrays
- Data service that supports:
  - `json-server` API on `http://localhost:3000` (localhost mode)
  - Static `db.json` + in-memory updates on GitHub Pages

## Local development

```bash
npm install
npm run start:local-api
npm start
```

- App runs at `http://localhost:4200`
- API runs at `http://localhost:3000`

## JSON database

- File: `/home/runner/work/Tracker/Tracker/public/db.json`
- Contains starter data for:
  - `logs`
  - `terms`
  - `appointments`

## GitHub Pages deployment

This repository includes `.github/workflows/deploy-pages.yml`.

1. In GitHub repo settings, enable **Pages** and set source to **GitHub Actions**.
2. Push to `main`.
3. Workflow builds with:

```bash
npm run build:gh-pages
```

4. App is published with hash-based routing and SPA fallback (`404.html`) to avoid refresh routing issues.

## Run tests/build

```bash
npm test -- --watch=false
npm run build
```
