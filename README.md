# Blood Donation Registry — Frontend

React (Vite, JavaScript) frontend for the Blood Donation Registry.
Phase 1 scope: **project structure, shared Page Layout (Header + Footer), Login page and Registration form with Zod validation.**
There is no backend yet: login/registration use a mock service (`src/services/authService.js`) that will later call the Spring Boot API.

## Tech stack

| Tool                     | Why                                               |
| ------------------------ | ------------------------------------------------- |
| React 19 + Vite          | UI library + fast dev server/build                |
| React Router             | Page navigation (`/login`, `/register`, `/`)      |
| Zod                      | Form validation schemas                           |
| PropTypes                | Documents and checks props of reusable components |
| ESLint + Prettier        | Code quality and consistent formatting            |
| Vitest + Testing Library | Unit tests                                        |

## Setup (macOS or Windows)

1. Install **Node.js 24 LTS** (see `.nvmrc`; Node 20+ works) from https://nodejs.org.
2. In the project folder:

```bash
npm ci          # installs the exact versions from package-lock.json
cp .env.example .env    # Windows (cmd): copy .env.example .env   (optional for now)
npm run dev     # open http://localhost:5173
```

**Demo login:** `admin@blood.org` / `Admin@123` (or register a new user — it is kept in memory until page reload).

## Scripts (quality gate — all must pass before a commit)

| Command                | What it does                          |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the dev server                  |
| `npm run lint`         | ESLint, fails on any error or warning |
| `npm run format:check` | Checks Prettier formatting            |
| `npm run format`       | Fixes formatting                      |
| `npm test`             | Runs unit tests once                  |
| `npm run build`        | Production build into `dist/`         |

## Moving the project to another machine (e.g. Mac → Dell/Windows)

- Copy/clone the project **without** `node_modules` and `dist`, then run `npm ci`.
  `node_modules` contains OS-specific binaries, so it must always be installed on the machine itself.
- Line endings: `.gitattributes`, `.editorconfig` and Prettier's `endOfLine: "lf"` keep files in LF on Windows,
  so `format:check` does not fail. If Git on Windows still converts them, run `git config core.autocrlf false`
  and re-clone.
- If `npm run build` fails with `Cannot find module @rollup/rollup-win32-x64-msvc` (known npm issue with lock files
  created on another OS): delete `node_modules` and `package-lock.json`, then run `npm install`.
- ESLint is pinned to v9 because `eslint-plugin-react` does not support v10 yet — no `--force` or
  `--legacy-peer-deps` needed.

## Folder structure

```
src/
├── main.jsx                  # Entry point: renders <App /> and loads global CSS
├── App.jsx                   # Routes; every page is wrapped in PageLayout
├── constants/                # Fixed values — no magic strings in components
│   ├── routes.js             # URL paths
│   ├── labels.js             # UI text (titles, field labels, buttons)
│   ├── messages.js           # Validation + server messages
│   ├── limits.js             # Numeric limits (name length, password length…)
│   ├── validation.js         # Regex patterns + PASSWORD_RULES
│   ├── config.js             # App config (API URL, mock delay) + blood groups
│   └── storageKeys.js        # sessionStorage keys
├── components/
│   ├── ui/                   # Reusable, presentational only (no business logic, no text)
│   │   ├── Button.jsx  Input.jsx  Select.jsx  FormField.jsx
│   │   ├── Card.jsx  Alert.jsx  PasswordChecklist.jsx
│   └── layout/               # Header, Footer, PageLayout
├── features/auth/            # Feature components + Zod schemas for login/registration
├── pages/                    # One component per route: LoginPage, RegisterPage, HomePage
├── services/                 # The ONLY place that talks to the API (mock for now)
│   ├── authService.js        # loginUser / registerUser
│   ├── tokenStorage.js       # The ONLY place that reads/writes the token
│   └── mockUsers.js          # Fake users; deleted when the backend is connected
├── hooks/                    # useForm (form state + validation), useAuth (logged-in user)
├── context/                  # AuthContext + AuthProvider
├── utils/                    # Small pure helpers (getFieldErrors, getErrorId, delay)
├── styles/                   # tokens.css (design tokens) + global.css (classes)
└── test/setup.js             # Test setup (jest-dom matchers, cleanup)
```

## How validation works

1. Each form has a **Zod schema** (`loginSchema.js`, `registrationSchema.js`) describing every rule and its message.
2. `useForm(schema, initialValues)` stores the values and, on every render, runs `getFieldErrors(schema, values)`.
3. A field's error is shown **as soon as the user types in it or leaves it** (live validation), and for all fields
   after pressing Submit. The message disappears the moment the rule is satisfied.
4. Password rules live once in `PASSWORD_RULES`. The schema uses them to decide validity and `PasswordChecklist`
   uses them to show each rule **red with ✗ until met, then green with ✓**.
5. Confirm password uses `.refine()` on the whole object because it compares two fields.

Client-side validation is for user experience only; the Spring Boot API must validate everything again.

## Connecting the backend later

- Replace the function bodies in `src/services/authService.js` with `fetch` calls to
  `${APP_CONFIG.API_BASE_URL}/auth/login` and `/auth/register`. Components do not change.
- Delete `src/services/mockUsers.js` and `MOCK_DELAY_MS`.
- Next screens (Donors, Donations, `/donors/:id/donations`) go in `features/donors`, `features/donations`
  and `pages/`, reusing the same `ui/` components and `useForm`.
