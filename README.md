# SiteForge

> Build & deploy websites instantly using AI — full SaaS with payments.

[![CI](https://github.com/adithya-naik/SiteForge/actions/workflows/ci.yml/badge.svg)](https://github.com/adithya-naik/SiteForge/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Table of Contents

- [SiteForge](#siteforge)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
    - [`server/.env`](#serverenv)
    - [`client/.env`](#clientenv)
  - [Getting Started](#getting-started)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Backend Setup](#2-backend-setup)
    - [3. Firebase Setup](#3-firebase-setup)
    - [4. OpenRouter Setup](#4-openrouter-setup)
    - [5. Stripe Setup](#5-stripe-setup)
      - [5a. Get your API keys](#5a-get-your-api-keys)
      - [5b. Set up a webhook (local development)](#5b-set-up-a-webhook-local-development)
      - [5c. For production](#5c-for-production)
    - [6. Frontend Setup](#6-frontend-setup)
  - [Available Scripts](#available-scripts)
    - [Backend (`server/`)](#backend-server)
    - [Frontend (`client/`)](#frontend-client)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Code Style \& Linting](#code-style--linting)
  - [Contributing](#contributing)
    - [Step 1 — Fork and clone](#step-1--fork-and-clone)
    - [Step 2 — Create a branch](#step-2--create-a-branch)
    - [Step 3 — Install dependencies](#step-3--install-dependencies)
    - [Step 4 — Make changes, lint, and commit](#step-4--make-changes-lint-and-commit)
    - [Step 5 — Sync and push](#step-5--sync-and-push)
  - [Contributors](#contributors)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

---

## Overview

SiteForge is a production-grade AI Website Builder SaaS built on the MERN stack. Users describe their idea, the AI generates a complete website, and they can deploy it with a single click. The platform includes a credit-based system, Stripe payments, Google OAuth via Firebase, and smooth UI animations — all deployed on Render.

---

## Features

- **AI Website Generation** — Describe your idea and get a fully generated website instantly via OpenRouter
- **One-Click Deployment** — Deploy generated websites without leaving the app
- **Credit-Based System** — Users spend credits to generate and deploy websites
- **Stripe Payments** — Secure credit purchases via Stripe Checkout and Webhooks
- **Google Auth** — Firebase-powered Google Sign-In with protected routes
- **Premium Animations** — Smooth UI with Framer Motion
- **Redux State Management** — Global auth and user state with Redux Toolkit
- **CI/CD Pipeline** — Automated lint, build, and code review on every push and PR

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                │
│                                                             │
│   Home ──► Generate ──► Editor ──► Dashboard               │
│                │                       │                    │
│          Firebase Auth           Redux Store                │
│         (Google OAuth)         (user, credits)              │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (Axios)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVER (Node.js + Express)                 │
│                                                             │
│  /api/auth  ──► Auth Controller  ──► JWT Middleware         │
│  /api/user  ──► User Controller                             │
│  /api/website ► Website Controller ──► OpenRouter API       │
│                                    ──► Deploy Logic         │
│                                                             │
│  Stripe Webhooks ──► Credit Updates                         │
└───────────────┬─────────────────────────────────────────────┘
                │ Mongoose ODM
                ▼
┌─────────────────────────┐
│   MongoDB (Atlas / Local) │
│   users | websites       │
└─────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State Management | Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | Firebase (Google OAuth) + JWT |
| AI | OpenRouter API |
| Payments | Stripe (Checkout + Webhooks) |
| Linting | ESLint (client + server) |
| CI/CD | GitHub Actions, CodeRabbit, SonarCloud |

---

## Project Structure

```
SiteForge/
├─ .github/
│  ├─ workflows/
│  │  ├─ auto-assign.yml
│  │  ├─ ci.yml
│  │  ├─ greetings.yml
│  │  ├─ label.yml
│  │  ├─ sonarcloud.yml
│  │  └─ summary.yml
│  ├─ auto_assign.yml
│  ├─ dependabot.yml
│  ├─ labeler.yml
│  └─ pull_request_template.md
├─ client/
│  ├─ public/
│  ├─ src/
│  │  ├─ assets/
│  │  ├─ components/
│  │  │  └─ LoginModal.jsx
│  │  ├─ hooks/
│  │  │  └─ useGetCurrentUser.jsx
│  │  ├─ pages/
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ Editor.jsx
│  │  │  ├─ Generate.jsx
│  │  │  └─ Home.jsx
│  │  ├─ redux/
│  │  │  ├─ store.js
│  │  │  └─ userSlice.js
│  │  ├─ firebase.js
│  │  └─ App.jsx
│  ├─ .env
│  ├─ eslint.config.js
│  └─ package.json
├─ server/
│  ├─ config/
│  │  ├─ db.js
│  │  └─ openRouter.js
│  ├─ controllers/
│  │  ├─ auth.controller.js
│  │  ├─ user.controller.js
│  │  └─ website.controller.js
│  ├─ middlewares/
│  │  └─ isAuth.js
│  ├─ models/
│  │  ├─ user.model.js
│  │  └─ website.model.js
│  ├─ routes/
│  ├─ utils/
│  │  └─ extractJson.js
│  ├─ .env
│  ├─ index.js
│  └─ package.json
├─ CODE_OF_CONDUCT.md
├─ LICENSE
└─ README.md
```

---

## Prerequisites

Make sure the following are installed before you begin:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- [Git](https://git-scm.com/)

```bash
node -v    # v18+
npm -v     # v9+
git --version
```

You will also need accounts on the following platforms (all free tiers work):

- [Firebase](https://firebase.google.com/) — for Google Auth
- [OpenRouter](https://openrouter.ai/) — for AI website generation
- [Stripe](https://stripe.com/) — for credit purchases

---

## Environment Variables

### `server/.env`

```dotenv
PORT=
MONGO_URL=
JWTSECRET=
OPEN_ROUTER_API_KEY=
```

### `client/.env`

```dotenv
VITE_FIREBASE_API_KEY=
```

> **Never commit `.env` files.** Both are already listed in `.gitignore`.

> **Note:** Stripe environment variables will be added here once Stripe integration is configured. See the [Stripe Setup](#5-stripe-setup) section for what to expect.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/adithya-naik/SiteForge.git
cd SiteForge
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create `server/.env` and fill in the values (see [Environment Variables](#environment-variables)).

**MongoDB — choose one:**

- **Local:** Start MongoDB (`mongod`) and set `MONGO_URL=mongodb://localhost:27017/siteforge`
- **Atlas:** Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), whitelist your IP, and copy the connection string into `MONGO_URL`

Start the dev server:

```bash
npm run dev
# Server running at http://localhost:5000
```

---

### 3. Firebase Setup

Firebase is used for **Google Sign-In** on the frontend.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Give it a name (e.g. `siteforge`) and complete the setup wizard.
3. In the left sidebar, go to **Build → Authentication → Sign-in method**.
4. Enable **Google** as a provider and save.
5. Go to **Project Settings** (gear icon) → **General** → scroll to **Your apps**.
6. Click **Add app → Web**, register the app, and copy the `firebaseConfig` object.
7. Add each value from `firebaseConfig` to `client/.env` using the `VITE_FIREBASE_` prefix as shown above.

The `client/src/firebase.js` file already reads these variables — no code changes needed.

---

### 4. OpenRouter Setup

OpenRouter provides access to many AI models (GPT-4, Claude, Gemini, etc.) through a single API key.

1. Sign up at [openrouter.ai](https://openrouter.ai/).
2. Go to **Keys** and create a new API key.
3. Add the key to `server/.env` as `OPEN_ROUTER_API_KEY`.
4. In `server/config/openRouter.js`, you can swap the model string to change which AI model powers the generator (e.g. `openai/gpt-4o`, `anthropic/claude-3-5-sonnet`).

Free-tier credits are available on sign-up, which is enough for development.

---

### 5. Stripe Setup

Stripe handles credit purchases. You need both a **secret key** and a **webhook secret**.

#### 5a. Get your API keys

1. Sign up or log in at [dashboard.stripe.com](https://dashboard.stripe.com/).
2. Go to **Developers → API keys**.
3. Copy the **Secret key** (`sk_test_...`) and add it to `server/.env` as `STRIPE_SECRET_KEY`.

#### 5b. Set up a webhook (local development)

Stripe needs to reach your local server to confirm payments. Use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Log in
stripe login

# Forward webhook events to your local server
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Copy the **webhook signing secret** printed in the terminal (`whsec_...`) and add it to `server/.env` as `STRIPE_WEBHOOK_SECRET`.

#### 5c. For production

Create a webhook endpoint in the Stripe Dashboard under **Developers → Webhooks**, pointing to `https://your-domain.com/api/stripe/webhook`, and select the `checkout.session.completed` event.

---

### 6. Frontend Setup

```bash
cd ../client
npm install
```

Create `client/.env` and fill in the Firebase and backend values (see [Environment Variables](#environment-variables)).

Start the Vite dev server:

```bash
npm run dev
# Frontend running at http://localhost:5173
```

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

1. **Checkout** — checks out the repository
2. **Setup Node.js 18** — installs the correct runtime
3. **Cache dependencies** — caches `client/node_modules` and `server/node_modules` separately
4. **Install** — runs `npm install` in both `client` and `server`
5. **Lint** — runs `npm run lint` in both directories
6. **Build** — runs `npm run build` in `client`
7. **CodeRabbit** — automatically reviews pull requests (uses `GITHUB_TOKEN`, no setup needed)
8. **SonarCloud** — static code analysis on every push

**Test locally with `act`:**

```bash
# Install act: https://github.com/nektos/act
act -j build
```

---

## Code Style & Linting

ESLint is configured independently in both workspaces.

- **Backend** — `server/eslint.config.js` uses Node.js/CommonJS environment rules
- **Frontend** — `client/eslint.config.js` uses the React plugin with `react/react-in-jsx-scope` disabled (React 17+ JSX transform no longer requires React in scope)

Run linting across both workspaces:

```bash
cd server && npm run lint && cd ../client && npm run lint
```

Auto-fix safe issues:

```bash
npm run lint:fix   # Run inside client/ or server/
```

---

## Contributing

Thank you for considering a contribution to SiteForge!

### Step 1 — Fork and clone

```bash
git clone https://github.com/<your-username>/SiteForge.git
cd SiteForge
git remote add upstream https://github.com/adithya-naik/SiteForge.git
git fetch upstream
```

### Step 2 — Create a branch

```bash
git checkout -b feat/your-feature-name
```

Branch naming:

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

### Step 4 — Make changes, lint, and commit

```bash
# Lint before committing
cd server && npm run lint
cd ../client && npm run lint

# Commit with Conventional Commits format
git add .
git commit -m "feat: add user authentication with JWT"
```

### Step 5 — Sync and push

```bash
git fetch upstream
git rebase upstream/main
git push origin feat/your-feature-name
```

Then open a pull request on GitHub. CI will run automatically and CodeRabbit will post a review.

**Contribution guidelines:**
- Do not commit `node_modules`, `.env` files, or build artifacts
- Keep PRs small and focused — one feature or fix per PR
- If unsure about a large change, open an issue first to discuss

---

## Contributors

Thanks to everyone who has contributed to SiteForge!

[![Contributors](https://contrib.rocks/image?repo=adithya-naik/SiteForge)](https://github.com/adithya-naik/SiteForge/graphs/contributors)

---

## Troubleshooting

**`npm install` fails with peer dependency errors**

```bash
npm install --legacy-peer-deps
```

**ESLint error: `'React' must be in scope when using JSX`**

Ensure `react/react-in-jsx-scope: off` is set in `client/eslint.config.js`. This is already the default in this repo.

**MongoDB connection refused**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
```

Or switch to MongoDB Atlas and update `MONGO_URL` in `server/.env`.

**Firebase: `auth/unauthorized-domain` error**

Go to **Firebase Console → Authentication → Settings → Authorized domains** and add `localhost`.

**Stripe webhook signature verification failed**

Make sure `STRIPE_WEBHOOK_SECRET` matches the secret shown when you ran `stripe listen`. Restart the server after updating `.env`.

**OpenRouter: 401 Unauthorized**

Double-check that `OPEN_ROUTER_API_KEY` is set correctly in `server/.env` and that the key has not expired or been revoked.

**Port already in use**

```bash
lsof -i :5000     # Find the process
kill -9 <PID>     # Kill it
```

**CI workflow fails on GitHub Actions**

Check the **Actions** tab for detailed logs. Common causes: missing lint/build scripts in `package.json`, uncommitted `eslint.config.js` changes, or Node version mismatch (workflow uses Node 18).

---

## License

This project is licensed under the [MIT License](LICENSE).