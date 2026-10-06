# Blood Donation Registry — Frontend

React (Vite, JavaScript) frontend for the Blood Donation Registry.
Scope so far: project structure, shared Page Layout (Header + Footer), Login and Registration forms with Zod
validation, API connection, secure token handling, **RBAC with protected/role-based routes**, and the
**Donors list** (search, blood-group filter, pagination, Admin-only delete), a **dashboard layout** with a
role-based sidebar, **Donor details** (with donation history) and an Admin-only **Users** page.
The Spring Boot backend is not built yet. Set `VITE_USE_MOCK_API` to choose between the real API and the
in-memory mock (see below).

Research notes: [`docs/token-storage.md`](docs/token-storage.md) (where to keep the token) and
[`docs/rbac.md`](docs/rbac.md) (roles and where they are enforced).

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
npm run dev     # open http://localhost:5173
```

## Mock API vs real API

`.env.development` (loaded by `npm run dev`) has the switch:

| `VITE_USE_MOCK_API` | Behaviour                                                                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `true` (default)    | No backend needed. Demo logins: `admin@blood.org` / `Admin@123`, `staff@blood.org` / `Staff@123`, `donor@blood.org` / `Donor@123`. Registered users last until reload; a reload logs you out (no real cookie in mock mode). |
| `false`             | Calls Spring Boot. Start the backend on `http://localhost:8080`; Vite forwards `/api/*` to it. If it isn't running you'll see an error message on submit.                                                                   |

Restart `npm run dev` after changing the file.

## API contract (for the Spring Boot backend)

All paths are under `/api`. JSON in and out. Errors never need a body; the frontend shows its own safe messages.

| Endpoint                  | Request body                                       | Success                                           | Errors used by the UI                        |
| ------------------------- | -------------------------------------------------- | ------------------------------------------------- | -------------------------------------------- |
| `POST /api/auth/login`    | `{ email, password }`                              | `200 { accessToken, user }` + sets refresh cookie | `400`/`401` → "Invalid email or password"    |
| `POST /api/auth/register` | `{ fullName, email, phone, bloodGroup, password }` | `201` (body optional)                             | `409` → email taken, `400` → invalid details |
| `POST /api/auth/refresh`  | none (refresh cookie sent automatically)           | `200 { accessToken, user }` + rotates cookie      | `401` → stay logged out                      |
| `POST /api/auth/logout`   | none                                               | `204`, cookie cleared                             | ignored; the frontend logs out anyway        |

| `GET /api/donors?page=0&size=5&search=&bloodGroup=` | none (Bearer token) | `200 { content: Donor[], totalElements, totalPages }` | `401` → refresh + retry once, `403` → no permission |
| `GET /api/donors/{id}` | none (Bearer token) | `200 Donor` | `404` not found |
| `GET /api/donors/{id}/donations` | none (Bearer token) | `200 Donation[]`, newest first | `404` donor not found |
| `GET /api/users` | none (Bearer token, ADMIN only) | `200 [{ id, fullName, email, role }]` | `403` no permission |
| `DELETE /api/donors/{id}` | none (Bearer token, ADMIN only) | `204` | `403` no permission, `404` not found |

`Donor` = `{ id, name, bloodGroup, phone }`. `Donation` = `{ id, donationDate: "YYYY-MM-DD", quantity (ml), location }`. `page` starts at 0 (Spring Data style); empty filters are not sent.
`user` = `{ fullName, email, role }` where `role` is `ADMIN`, `STAFF` or `DONOR`.
Refresh cookie: `HttpOnly; Secure; SameSite=Strict; Path=/api/auth`.
Any other failure maps to: `403` no permission, `404` not found, `5xx` generic error, no response → "Unable to reach the server".

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
│   ├── config.js             # App config (API URL, mock switch, timeout) + blood groups
│   ├── api.js                # API endpoint paths + HTTP status codes
│   ├── roles.js              # Roles, permissions, which role has which permission, route roles
│   └── navigation.js         # Sidebar menu items (NAV_ITEMS) and breadcrumb steps
├── components/
│   ├── ui/                   # Reusable, presentational only (no business logic, no text)
│   │   ├── Button.jsx  Input.jsx  Select.jsx  FormField.jsx
│   │   ├── Card.jsx  Alert.jsx  PasswordChecklist.jsx  LoadingMessage.jsx
│   │   ├── AsyncContent.jsx  Pagination.jsx  ConfirmDialog.jsx
│   │   ├── PageHeader.jsx (title + breadcrumbs + tab title)
│   └── layout/               # PublicLayout + PublicHeader; DashboardLayout + Sidebar + Topbar; Footer
├── features/auth/            # Login/Registration forms, Zod schemas, ProtectedRoute, GuestRoute, RoleRoute
├── features/donors/          # useDonors, DonorFilters, DonorTable, DeleteDonorDialog, DonorSummary, DonationTable
├── features/users/           # UserTable
├── pages/                    # Login, Register, Dashboard, DonorList, DonorDetails, Users, AccessDenied
├── services/                 # The ONLY place that talks to the API
│   ├── apiClient.js          # fetch wrapper: base URL, Bearer token, timeout, safe error messages
│   ├── authApi.js            # Real calls: login, register, refresh, logout
│   ├── mockAuthApi.js        # Same functions, in-memory (VITE_USE_MOCK_API=true)
│   ├── authService.js        # Picks authApi or mockAuthApi; components import from here
│   ├── tokenStorage.js       # The ONLY place that reads/writes the access token (memory only)
│   ├── donorApi.js / mockDonorApi.js / donorService.js   # Same pattern for donors
│   ├── userApi.js / mockUserApi.js / userService.js      # Same pattern for users
│   └── mockUsers.js, mockDonors.js, mockDonations.js     # Fake data for mock mode
├── hooks/                    # useForm, useAuth, useFetch (loading/error/reload), useDebouncedValue, useDocumentTitle
├── context/                  # AuthContext + AuthProvider
├── utils/                    # Small pure helpers (getFieldErrors, getErrorId, delay, hasRole, hasPermission, buildQueryString, formatDate, selectApi)
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

## Routes, layouts and roles

| Route                    | Layout          | Who can open it                                | Guard                          |
| ------------------------ | --------------- | ---------------------------------------------- | ------------------------------ |
| `/login`, `/register`    | PublicLayout    | Logged-out users only (others go to Dashboard) | `GuestRoute`                   |
| `/` Dashboard            | DashboardLayout | Any logged-in user                             | `ProtectedRoute`               |
| `/donors`, `/donors/:id` | DashboardLayout | ADMIN, STAFF (DONOR sees the 403 page)         | `ProtectedRoute` + `RoleRoute` |
| `/users`                 | DashboardLayout | ADMIN only                                     | `ProtectedRoute` + `RoleRoute` |

**Adding a page to the menu:** add the route to `ROUTES`, its roles to `ROUTE_ROLES` (if restricted), and one line
to `NAV_ITEMS` in `constants/navigation.js`. The sidebar and the route guard both read `ROUTE_ROLES`, so they
can't disagree. The active page is highlighted with `NavLink` (bold + background + left bar + `aria-current`).

On screens under 768px the sidebar is hidden behind a ☰ button; it closes on link click, backdrop click or Esc.

Pages and menu items are controlled by **role** (`ROUTE_ROLES`, `hasRole`); actions such as the **Delete** button
by **permission** (`ROLE_PERMISSIONS`, `hasPermission`), shown to ADMIN only.
Hiding things in the UI is UX, NOT security: the API must enforce the same rules.

**Logout** calls `/auth/logout`, clears the in-memory token and user, and redirects to Login.

## How the API connection works

1. A form calls `loginUser`/`registerUser` from `services/authService.js`. Components never call `fetch`.
2. `authService.js` sends the call to `authApi.js` (real) or `mockAuthApi.js`, based on `VITE_USE_MOCK_API`.
3. `apiClient.js` sends the request with the Bearer token, a 15 s timeout and `credentials: 'include'` (for the cookie).
4. On failure it throws an `ApiError` with a user-safe message chosen by HTTP status (bad input vs not found vs
   server error vs offline). `useForm` shows that message in the form's `Alert`.
5. **Interceptor:** if a non-auth request returns 401 (expired access token), `apiClient` asks `AuthProvider` to
   refresh the token once and retries. If the refresh fails, the user is logged out and sent to Login.
6. On login, `AuthProvider` keeps the access token in memory and the user in state. On page reload it calls
   `/auth/refresh` to restore the session (see `docs/token-storage.md`).

## Next steps

- Next screens (Donors, Donations, `/donors/:id/donations`) go in `features/donors`, `features/donations`
  and `pages/`, reusing the same `ui/` components and `useForm`.
