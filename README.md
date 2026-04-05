# SiteForge

> A full-stack MERN application with automated linting, CI/CD via GitHub Actions, and AI-assisted code review through CodeRabbit.

[![CI](https://github.com/adithya-naik/SiteForge/actions/workflows/ci.yml/badge.svg)](https://github.com/adithya-naik/SiteForge/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [CI/CD Pipeline](#cicd-pipeline)
- [Code Style & Linting](#code-style--linting)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

SiteForge is a full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It follows a monorepo-style structure with separate `client` and `server` directories, each independently configured for linting and builds. The repository ships with a GitHub Actions CI pipeline that automatically lints, builds, and reviews every push and pull request.

---

## Project Structure

```
SiteForge/
├── client/                   # React frontend (Vite + React 18)
│   ├── src/
│   ├── public/
│   ├── eslint.config.js
│   └── package.json
├── server/                   # Node.js + Express backend
│   ├── src/
│   ├── eslint.config.js
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI workflow
├── .gitignore
├── package.json              # Root-level scripts (optional)
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Linting | ESLint (client + server) |
| CI/CD | GitHub Actions |
| Code Review | CodeRabbit |

---

## Features

**Backend**
- RESTful API with Node.js and Express
- ESLint configured for Node/CommonJS environment
- Clean separation of routes, controllers, and middleware

**Frontend**
- React 18 with Vite for fast HMR development builds
- ESLint with the `react` plugin; `react/react-in-jsx-scope` disabled (React 17+ new JSX transform)
- Component-based architecture ready for scaling

**CI/CD Pipeline**
- Triggers on every `push` and `pull_request`
- Node modules cached separately for `client` and `server` to speed up runs
- Steps: checkout → cache → install → lint → build → CodeRabbit review

**Automated Code Review**
- CodeRabbit reviews every pull request automatically
- Uses `GITHUB_TOKEN` — no additional secrets required

---

## Prerequisites

Make sure you have the following installed before cloning:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) (local or via [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Git](https://git-scm.com/)

To verify:

```bash
node -v    # Should be v18+
npm -v     # Should be v9+
git --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/SiteForge.git
cd SiteForge
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/siteforge
```

Start the development server:

```bash
npm run dev
```

The backend will be running at `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## Available Scripts

### Backend (`server/`)

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (hot reload) |
| `npm start` | Start server in production mode |
| `npm run lint` | Run ESLint on all server files |
| `npm run lint:fix` | Auto-fix ESLint issues |

### Frontend (`client/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all client files |
| `npm run lint:fix` | Auto-fix ESLint issues |

---

## CI/CD Pipeline

The GitHub Actions workflow at `.github/workflows/ci.yml` runs on every `push` and `pull_request`.

**Pipeline steps:**

1. **Checkout** — checks out the repository code
2. **Setup Node.js** — installs Node.js 18
3. **Cache dependencies** — caches `client/node_modules` and `server/node_modules` separately using `actions/cache@v3`
4. **Install dependencies** — runs `npm install` in both `client` and `server`
5. **Lint** — runs `npm run lint` in both directories
6. **Build** — runs `npm run build` in `client`
7. **CodeRabbit review** — automatically reviews pull requests

**CodeRabbit step (from `ci.yml`):**

```yaml
- name: Run CodeRabbit
  uses: coderabbitio/code-review-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

`GITHUB_TOKEN` is automatically provided by GitHub Actions — no manual configuration needed.

**Testing the workflow locally with `act`:**

```bash
# Install act: https://github.com/nektos/act
act -j build
```

---

## Code Style & Linting

ESLint is configured independently in both `client` and `server`.

- **Backend**: `server/eslint.config.js` — Node.js environment rules
- **Frontend**: `client/eslint.config.js` — React plugin with JSX rules

Key configuration note: `react/react-in-jsx-scope` is **disabled** because React 17+ no longer requires React to be in scope when using JSX.

Run linting across both workspaces from the root:

```bash
cd server && npm run lint && cd ../client && npm run lint
```

Auto-fix fixable issues:

```bash
npm run lint:fix   # Run inside client/ or server/
```

---

## Contributing

Thank you for considering a contribution to SiteForge! This section walks you through everything you need to get up and running as a contributor.

### Step 1 — Fork and clone

1. Click **Fork** on the top-right of this repository's GitHub page.
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/SiteForge.git
cd SiteForge
```

3. Add the upstream remote so you can pull in future changes:

```bash
git remote add upstream https://github.com/<original-username>/SiteForge.git
git fetch upstream
```

### Step 2 — Create a branch

Always work on a new branch. Never commit directly to `main`.

```bash
git checkout -b feat/your-feature-name
# or for bug fixes:
git checkout -b fix/your-bug-description
```

Branch naming conventions:

| Prefix | When to use |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code refactor, no behavior change |
| `chore/` | Tooling, dependencies, CI |

### Step 3 — Install dependencies

```bash
cd server && npm install && cd ../client && npm install
```

### Step 4 — Make your changes

- Keep changes focused. One feature or fix per pull request.
- Follow existing code style — ESLint will catch most issues.
- Add or update comments where the logic is non-obvious.
- If you're adding a new API endpoint, update or add relevant documentation.

### Step 5 — Lint before committing

```bash
cd server && npm run lint
cd ../client && npm run lint
```

Fix any lint errors before pushing. You can run `npm run lint:fix` to auto-fix safe issues.

### Step 6 — Commit your changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add user authentication with JWT"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) format where possible:

```
<type>: <short description>

[optional body]

[optional footer]
```

### Step 7 — Sync with upstream (avoid merge conflicts)

Before pushing, pull in any upstream changes:

```bash
git fetch upstream
git rebase upstream/main
```

### Step 8 — Push and open a pull request

```bash
git push origin feat/your-feature-name
```

Then open a pull request on GitHub:

1. Go to your fork on GitHub.
2. Click **Compare & pull request**.
3. Fill in the PR template — describe what changed and why.
4. Request a review if needed.

**What happens next:**

- GitHub Actions CI will run automatically (lint + build).
- CodeRabbit will post an automated code review on your PR.
- A maintainer will review and either merge or leave feedback.

### Contribution guidelines

- Do not commit `node_modules`, `.env` files, or build artifacts.
- Keep PRs small and reviewable. Large PRs are harder to merge.
- Be respectful and constructive in code review discussions.
- If you're fixing a bug, consider adding a note describing how to reproduce it.
- If you're unsure about a large change, open an issue first to discuss the approach.

---

## Troubleshooting

**`npm install` fails with peer dependency errors**

```bash
npm install --legacy-peer-deps
```

**ESLint error: `'React' must be in scope when using JSX`**

This is already handled — ensure `react/react-in-jsx-scope: off` is set in `client/eslint.config.js`.

**MongoDB connection refused**

Make sure MongoDB is running:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
```

Or use MongoDB Atlas and update `MONGO_URI` in your `.env`.

**Port already in use**

```bash
# Find the process using the port (e.g., 5000)
lsof -i :5000

# Kill it
kill -9 <PID>
```

**CI workflow fails on GitHub Actions**

Check the Actions tab on GitHub for detailed logs. Common causes:
- Missing `npm run lint` or `npm run build` scripts in `package.json`
- Uncommitted `eslint.config.js` changes
- Node version mismatch (workflow uses Node 18)

---

## License

This project is licensed under the [MIT License](LICENSE).