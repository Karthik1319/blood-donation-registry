# Blood Donation Registry — Frontend

React 19 + Vite, React Router, Zod validation. JavaScript only (no TypeScript, no UI library, no Redux).

## Requirements

| Tool    | Version                                 | Check with      |
| ------- | --------------------------------------- | --------------- |
| Node.js | 22.22.2+ or 24.15+ (24 LTS recommended) | `node -v`       |
| npm     | comes with Node (10+)                   | `npm -v`        |
| Git     | any recent version                      | `git --version` |

`.npmrc` sets `engine-strict=true`, so `npm ci` stops with a clear error on an unsupported Node
version instead of failing later in a confusing way.

## Setup

The commands are the same on macOS (Terminal) and Windows (PowerShell or Git Bash).

```bash
cd frontend
npm ci                      # installs the EXACT versions from package-lock.json
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
npm run dev                 # opens on http://localhost:5173
```

Use `npm ci`, not `npm install`. `npm ci` never changes `package-lock.json`, so every machine gets
identical dependency versions. Use `npm install <package>` only when you are adding a new
dependency on purpose, and commit the updated lockfile.

## Scripts

| Command                | What it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the dev server with hot reload                 |
| `npm run build`        | Production build into `dist/`                        |
| `npm run preview`      | Serve the production build locally                   |
| `npm run lint`         | ESLint; fails on any error **or warning**            |
| `npm run lint:fix`     | Auto-fix what ESLint can                             |
| `npm run format`       | Format all files with Prettier                       |
| `npm run format:check` | Check formatting without changing files              |
| `npm test`             | Run all tests once (Vitest)                          |
| `npm run test:watch`   | Re-run tests on every save                           |
| `npm run verify`       | **Quality gate:** lint + format:check + test + build |

Run `npm run verify` before every commit. It must pass with zero errors and zero warnings.

## Environment variables

| Variable            | Used by         | Default                 | Purpose                             |
| ------------------- | --------------- | ----------------------- | ----------------------------------- |
| `VITE_API_BASE_URL` | browser code    | `/api`                  | Prefix for every API call           |
| `VITE_APP_NAME`     | browser code    | Blood Donation Registry | Name shown in the header and footer |
| `API_PROXY_TARGET`  | Vite dev server | `http://localhost:8080` | Where `/api` requests are forwarded |

Anything starting with `VITE_` is compiled into the JavaScript the browser downloads, so it is
**public**. Never put secrets in `.env`.

## Backend integration (Spring Boot, later)

The app already calls these endpoints through `src/services/authService.js`:

| Method | Path                 | Request body                                     | Success response   |
| ------ | -------------------- | ------------------------------------------------ | ------------------ |
| POST   | `/api/auth/login`    | `{ username, password }`                         | `{ token: "..." }` |
| POST   | `/api/auth/register` | `{ fullName, username, email, phone, password }` | `201` (any body)   |

Error statuses the UI understands: `400` bad input, `401` wrong credentials, `404` not found,
`409` username/email already exists, `5xx` server problem.

In development the Vite server forwards `/api/*` to `http://localhost:8080` (Spring Boot's
default port), so no CORS configuration is needed. **Until the backend exists**, submitting a
valid form shows "The service is temporarily unavailable…" — that is expected.

## Moving between machines (Mac ↔ Windows)

- **Transfer the project with Git**, not by copying the folder. Never copy `node_modules`:
  it contains operating-system-specific binaries (e.g. the Vite bundler) that do not work on
  another OS. Always run `npm ci` on each machine.
- **Line endings:** `.gitattributes` forces LF line endings, and Prettier checks for LF. Without
  this, Git on Windows converts files to CRLF and `npm run format:check` fails on every file.
- **File name casing:** macOS and Windows ignore letter case in file names, but Linux (CI servers,
  Docker) does not. An import of `@/components/ui/button` would work on your laptop and break in
  CI. Always match the exact file name.
- **Paths:** always use `/` in imports; `vite.config.js` builds paths with `fileURLToPath`, which
  works on both systems.
- **Editor:** install the VS Code extensions **ESLint**, **Prettier** and **EditorConfig**.
  `.editorconfig` keeps indentation and line endings consistent in any editor.

## Troubleshooting

| Problem                                                       | Fix                                                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `npm ci` says `Unsupported engine`                            | Install Node 24 LTS (Windows: nodejs.org installer or `nvm-windows`, then `nvm use 24`) |
| `Cannot find module @rolldown/binding-win32-...` (or similar) | `node_modules` came from another OS. Delete `node_modules`, run `npm ci`                |
| `format:check` fails on every file on Windows                 | `git config core.autocrlf false`, then `git rm --cached -r . && git reset --hard`       |
| PowerShell: "running scripts is disabled on this system"      | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`                                   |
| Corporate network: `npm ci` fails with certificate errors     | Ask IT for the company npm registry/proxy settings; do **not** disable SSL checks       |
| Port 5173 already in use                                      | `npm run dev -- --port 3000`                                                            |

## Project structure

```
src/
├── main.jsx               Entry point: mounts React, Router and global CSS
├── App.jsx                Route table; every page is nested in PageLayout
├── components/
│   ├── layout/            Header, Footer, PageLayout (shared page frame)
│   └── ui/                Reusable, presentational building blocks (no business logic)
├── features/auth/         Login/Register forms + their Zod schemas
├── pages/                 One component per route; composes Card + feature components
├── hooks/                 useZodForm (values/errors) and useFormSubmit (submit flow)
├── services/              ALL network and token-storage code lives here
├── utils/                 Small pure helper functions
├── constants/             Routes, labels, messages, limits, config, field definitions
├── styles/                tokens.css (design tokens) + base/layout/component styles
└── test/                  Test setup and helpers
```

Tests sit next to the file they test (`Input.jsx` → `Input.test.jsx`).
