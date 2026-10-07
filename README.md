# Blood Donation Registry — Frontend

React (Vite, JavaScript) frontend for the Blood Donation Registry.
Scope so far: project structure, shared Page Layout (Header + Footer), Login and Registration forms with Zod
validation, API connection, secure token handling, **RBAC with protected/role-based routes**, and the
**Donors list** (search, blood-group filter, pagination), a **dashboard layout** with a role-based sidebar,
**Donor details** (with donation history), an Admin-only **Users** page, and **full CRUD on donors and
donations** (one Zod form per entity for add/edit, delete confirmation, success/error toasts), including the
**90-day eligibility rule** for donations.

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

| `VITE_USE_MOCK_API` | Behaviour                                                                                                                                                                                                                                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `true` (default)    | No backend needed: `src/mocks/` answers the Axios requests in the browser, so interceptors, tokens, 401 and 403 work exactly as with the real API. Demo logins: `admin@blood.org` / `Admin@123`, `staff@blood.org` / `Staff@123`, `donor@blood.org` / `Donor@123`. A reload logs you out (no real cookie in mock mode). |
| `false`             | Calls Spring Boot. Start the backend on `http://localhost:8080`; Vite forwards `/api/*` to it. If it isn't running you'll see an error message on submit.                                                                                                                                                               |

Restart `npm run dev` after changing the file.

**Token expiry in mock mode** (`src/mocks/mockConfig.js`): access tokens expire after 1 minute (the interceptor
refreshes them silently), and the session ends after 3 minutes without a refresh (idle timeout). To demo it: log in,
wait 3 minutes, click any page → you land on Login with "Your session has expired".

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
| `POST /api/donors/{id}/donations` | `{ donationDate, quantity, location }` (ADMIN, STAFF) | `201 Donation` | `422` within 90 days of another donation, `400` invalid |
| `PUT /api/donations/{id}` | `{ donationDate, quantity, location }` (ADMIN, STAFF) | `200 Donation` | `422` within 90 days, `404` not found |
| `DELETE /api/donations/{id}` | none (ADMIN only) | `204` | `403` no permission, `404` not found |
| `GET /api/users` | none (Bearer token, ADMIN only) | `200 [{ id, fullName, email, role }]` | `403` no permission |
| `POST /api/donors` | `{ name, bloodGroup, phone }` (ADMIN, STAFF) | `201 Donor` | `409` phone already used, `403` no permission |
| `PUT /api/donors/{id}` | `{ name, bloodGroup, phone }` (ADMIN, STAFF) | `200 Donor` | `409` phone already used, `404` not found |
| `DELETE /api/donors/{id}` | none (Bearer token, ADMIN only) | `204` | `403` no permission, `404` not found |

`Donor` = `{ id, name, bloodGroup, phone }`. `Donation` = `{ id, donorId, donationDate: "YYYY-MM-DD", quantity (ml, 350–450), location }`. Deleting a donor also deletes their donations. `page` starts at 0 (Spring Data style); empty filters are not sent.
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
│   │   ├── AsyncContent.jsx  Pagination.jsx  ConfirmDialog.jsx  ToastList.jsx
│   │   ├── PageHeader.jsx (title + breadcrumbs + tab title)
│   └── layout/               # PublicLayout + PublicHeader; DashboardLayout + Sidebar + Topbar; Footer
├── features/auth/            # Login/Registration forms, Zod schemas, ProtectedRoute, GuestRoute, RoleRoute
├── features/donors/          # DonorForm + donorSchema (add/edit), DonorTable, DonorFilters, DonorSummary,
│                             # useDonors (filters + page + fetch), useDonorPermissions
├── features/donations/       # DonationForm + donationSchema (add/edit), DonationTable, DonorDonations,
│                             # EligibilityStatus, useDonationPermissions
├── features/shared/          # DeleteDialog (confirm + delete + toast, for any record)
├── schemas/fieldSchemas.js   # Zod rules shared by forms (name, email, phone, blood group)
├── features/users/           # UserTable
├── pages/                    # Login, Register, Dashboard, DonorList, DonorDetails, DonorForm, Users, AccessDenied
├── services/                 # The ONLY place that talks to the API
│   ├── apiClient.js          # Axios instance + request/response interceptors (token, 401 refresh, errors)
│   ├── authService.js        # login, register, refresh, logout
│   ├── tokenStorage.js       # The ONLY place that reads/writes the access token (memory only)
│   ├── donorService.js       # donors list, details, donations, delete
│   └── userService.js        # users list (Admin)
├── mocks/                    # Fake backend for mock mode (loaded only when VITE_USE_MOCK_API=true)
│   ├── mockServer.js         # Plugs the fake backend into the Axios instance
│   ├── mockSession.js        # Fake tokens, idle timeout, withAuth (401/403 like Spring Security)
│   ├── mockDb.js             # In-memory "tables" (donors, donations) shared by the handlers
│   ├── *Handlers.js          # Fake endpoints for auth, donors, donations, users
│   └── data/                 # Fake users, donors, donations
├── hooks/                    # useForm, useAuth, useFetch, useToast, useNotifiedAction, useDebouncedValue, useDocumentTitle
├── context/                  # AuthContext + AuthProvider, ToastContext + ToastProvider
├── utils/                    # Small pure helpers (getFieldErrors, getErrorId, hasRole, hasPermission, removeEmptyValues,
│                             # formatDate, dateUtils, donationEligibility = the 90-day rule)
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

## The 90-day eligibility rule (project edge case)

A donor must wait at least 90 days between donations (`LIMITS.MIN_DAYS_BETWEEN_DONATIONS`). The rule lives once,
in `src/utils/donationEligibility.js` (pure functions, unit-tested), and is used in three places:

1. **Donor details page:** a banner shows "✓ Eligible to donate today" or "✗ Not eligible until <date>".
2. **Donation form (Zod):** a date less than 90 days from _any_ other donation of that donor shows a live red
   error and the form won't submit. Both directions are checked, so back-filling an old donation is allowed only
   if it is far enough from every other one; when editing, the donation isn't compared with itself.
3. **Server (fake backend now, Spring Boot later):** rejects the same cases with **422**, shown as an error
   toast. The UI check is for fast feedback; the server is the real gate.

## Routes, layouts and roles

| Route                                               | Layout          | Who can open it                                | Guard                          |
| --------------------------------------------------- | --------------- | ---------------------------------------------- | ------------------------------ |
| `/login`, `/register`                               | PublicLayout    | Logged-out users only (others go to Dashboard) | `GuestRoute`                   |
| `/` Dashboard                                       | DashboardLayout | Any logged-in user                             | `ProtectedRoute`               |
| `/donors`, `/donors/:id`                            | DashboardLayout | ADMIN, STAFF (DONOR sees the 403 page)         | `ProtectedRoute` + `RoleRoute` |
| `/donors/new`, `/donors/:id/edit`                   | DashboardLayout | ADMIN, STAFF (same `DonorFormPage`)            | `ProtectedRoute` + `RoleRoute` |
| `/donors/:id/donations/new`, `.../:donationId/edit` | DashboardLayout | ADMIN, STAFF (same `DonationFormPage`)         | `ProtectedRoute` + `RoleRoute` |
| `/users`                                            | DashboardLayout | ADMIN only                                     | `ProtectedRoute` + `RoleRoute` |

**Adding a page to the menu:** add the route to `ROUTES`, its roles to `ROUTE_ROLES` (if restricted), and one line
to `NAV_ITEMS` in `constants/navigation.js`. The sidebar and the route guard both read `ROUTE_ROLES`, so they
can't disagree. The active page is highlighted with `NavLink` (bold + background + left bar + `aria-current`).

On screens under 768px the sidebar is hidden behind a ☰ button; it closes on link click, backdrop click or Esc.

**Donor actions:** Add and Edit for ADMIN and STAFF, Delete for ADMIN only (`useDonorPermissions`). The fake
backend enforces the same rules, so a forbidden call gets 403 even if someone bypasses the UI.
Every create, update and delete shows a **toast** (success, or the API's error) via `useNotifiedAction`.

Pages and menu items are controlled by **role** (`ROUTE_ROLES`, `hasRole`); actions such as the **Delete** button
by **permission** (`ROLE_PERMISSIONS`, `hasPermission`), shown to ADMIN only.
Hiding things in the UI is UX, NOT security: the API must enforce the same rules.

**Logout** calls `/auth/logout`, clears the in-memory token and user, and redirects to Login.

## How the API connection works

1. A component calls a service function, e.g. `loginUser` from `services/authService.js`. Components never call
   Axios directly.
2. The service calls `apiRequest`, which uses the single Axios instance in `services/apiClient.js`
   (base URL `/api`, 15 s timeout, `withCredentials` for the refresh cookie).
3. **Request interceptor:** adds `Authorization: Bearer <accessToken>` to every outgoing request.
4. **Response interceptor:** in one place,
   - on **401** from a normal request (expired/invalid token), asks `AuthProvider` to refresh the token once and
     **retries** the request. If the refresh fails, the user is logged out and the Login page shows
     "Your session has expired". Auth calls (`/auth/*`) never trigger this, and a request is retried only once;
   - turns every failure into an `ApiError` with a user-safe message by status (bad input 400, session 401,
     no permission 403, not found 404, server error 5xx, offline/timeout).
5. On login, `AuthProvider` keeps the access token in memory and the user in state. On page reload it calls
   `/auth/refresh` to restore the session (see `docs/token-storage.md`).

## Next steps

- Build the Spring Boot backend following the API contract above, then set `VITE_USE_MOCK_API=false`.
- Optional: a Donations page listing all donations across donors (with date-range filter).
