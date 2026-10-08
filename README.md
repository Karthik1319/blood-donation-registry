# Blood Donation Registry

A web app for a blood bank to keep a register of **donors** and their **blood donations**. Staff record donors and
donations; the app enforces the medical rule that a donor must wait **at least 90 days between donations**, and
shows each donor's eligibility. Access is role-based: Admin, Staff and Donor accounts see and can do different things.

Full stack: a **React** frontend (Vite, JavaScript) in this folder, and a **Spring Boot** API with **PostgreSQL** in
[`backend/`](backend/README.md).

## Features

- Login and registration with live Zod validation (password rules turn green as they are met)
- Secure session: access token in memory only, refresh token in an HttpOnly cookie, silent refresh on expiry
- Role-based access: protected routes, role-based sidebar, 403 page, buttons shown per permission
- Admin user management: change roles, disable/enable accounts (takes effect on the user's next request)
- Donors: list with search, blood-group filter and pagination; details; add/edit (one form); delete with confirmation
- Donations: history per donor; add/edit (one form); delete; **90-day eligibility rule** with a live status banner
- Success/error toasts for every create, update and delete; loading, error and empty states on every page
- Responsive: the sidebar becomes a menu and tables become cards on phones
- Unit and integration tests for validation, business rules, API layer, permissions and pages (`npm test`)

## Getting started

Works the same on macOS and Linux (and Windows with Docker). You need **Node.js 20+**, **Java 21**, **Docker with
Compose** and **Git**.

```bash
git clone https://github.com/Karthik1319/blood-donation-registry1.git
cd blood-donation-registry1

# 1. Backend (first time: create backend/.env, see backend/README.md)
cd backend
cp .env.example .env               # then set DB_PASSWORD and JWT_SECRET (openssl rand -base64 48)
docker compose up -d               # PostgreSQL
./mvnw spring-boot:run             # API on http://localhost:8080 (leave running)

# 2. Frontend, in a second terminal
cd blood-donation-registry1
npm ci
npm run dev                        # open http://localhost:5173
```

## Test login credentials

Created by the backend's demo data (`DEMO_DATA=true` in `backend/.env`):

| Role  | Email             | Password    | Can do                                                        |
| ----- | ----------------- | ----------- | ------------------------------------------------------------- |
| Admin | `admin@blood.org` | `Admin@123` | Everything, including delete and the Users page               |
| Staff | `staff@blood.org` | `Staff@123` | View, add and edit donors and donations (no delete, no Users) |
| Donor | `donor@blood.org` | `Donor@123` | Dashboard only (the Donors page shows 403)                    |

New accounts from the Register page are always **Donor**. With the real backend, data is kept in PostgreSQL and a
page reload keeps you logged in.

## Environment variables

Frontend: `.env.development` (used by `npm run dev`). Backend
variables are listed in [`backend/README.md`](backend/README.md#environment-variables-backendenv-never-committed). `VITE_` variables are bundled into the browser and are
**public**: never put secrets in them.

| Variable            | Default | Meaning                                                                      |
| ------------------- | ------- | ---------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | `/api`  | Where API calls go. In development Vite forwards `/api` to `localhost:8080`. |

Restart `npm run dev` after changing them.

## Scripts

| Command                  | What it does                                                    |
| ------------------------ | --------------------------------------------------------------- |
| `npm run dev`            | Start the frontend against the real backend                     |
| `./mvnw test` (backend/) | Backend tests (real PostgreSQL via Testcontainers)              |
| `npm run check`          | **Quality gate**: lint, format check, tests and build in one go |
| `npm run lint`           | ESLint; fails on any error or warning                           |
| `npm run format:check`   | Prettier formatting check (`npm run format` fixes it)           |
| `npm test`               | Run all tests once (`npm run test:watch` while coding)          |
| `npm run build`          | Production build into `dist/`                                   |

## Roles, routes and permissions

| Page                       | Route                                               | Who can open it              |
| -------------------------- | --------------------------------------------------- | ---------------------------- |
| Login, Register            | `/login`, `/register`                               | Logged-out users only        |
| Dashboard                  | `/`                                                 | Any logged-in user           |
| Donors list, donor details | `/donors`, `/donors/:id`                            | Admin, Staff                 |
| Add/Edit donor             | `/donors/new`, `/donors/:id/edit`                   | Admin, Staff                 |
| Add/Edit donation          | `/donors/:id/donations/new`, `.../:donationId/edit` | Admin, Staff                 |
| Users                      | `/users`                                            | Admin                        |
| Unknown address            | anything else                                       | Shows "404 - Page not found" |

Inside pages, **actions** are controlled by permissions (`ROLE_PERMISSIONS` in `src/constants/roles.js`):

| Action              | Admin | Staff | Donor |
| ------------------- | :---: | :---: | :---: |
| Add / edit donor    |   ✓   |   ✓   |       |
| Delete donor        |   ✓   |       |       |
| Add / edit donation |   ✓   |   ✓   |       |
| Delete donation     |   ✓   |       |       |

Hiding pages and buttons is for user experience only. The Spring Boot API checks the same rules on every request
(`backend/.../config/SecurityConfig.java`): a forbidden call gets **403**.

## The 90-day eligibility rule

A donor must wait at least 90 days between donations. The rule is written once, in
`src/utils/donationEligibility.js`, and used in three places:

1. **Donor details:** a banner shows "✓ Eligible to donate today" or "✗ Not eligible until &lt;date&gt;".
2. **Donation form:** a date less than 90 days from _any_ other donation of that donor shows a live error and the
   form won't submit. Back-filled (older) dates are checked against later donations too, and an edited donation is
   not compared with itself.
3. **Server:** `DonationEligibility.java` rejects the same cases with **422**, shown as an error toast. The server
   has the final say, and locks the donor's row while saving so two parallel saves can't both pass.

## Testing the session timeout quickly

Start the backend with short lifetimes, log in, then wait:

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--app.security.access-token-ttl=1m --app.security.refresh-token-ttl=3m"
```

After 1 minute the next click still works (the token is refreshed silently); after 3 minutes without a click the
next one lands on Login with "Your session has expired".

## API contract

All paths are under `/api`, JSON in and out, Bearer token on every non-auth call. Error responses need no body: the
frontend shows its own safe message for each status.

| Endpoint                                      | Request body                                        | Success                                               | Errors the UI handles                      |
| --------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------ |
| `POST /api/auth/login`                        | `{ email, password }`                               | `200 { accessToken, user }` + sets refresh cookie     | `400`/`401` → "Invalid email or password"  |
| `POST /api/auth/register`                     | `{ fullName, email, phone, bloodGroup, password }`  | `201`                                                 | `409` email taken, `400` invalid           |
| `POST /api/auth/refresh`                      | none (cookie sent automatically)                    | `200 { accessToken, user }` + rotates cookie          | `401` → logged out                         |
| `POST /api/auth/logout`                       | none                                                | `204`, cookie cleared                                 | ignored; the frontend logs out anyway      |
| `GET /api/donors?page&size&search&bloodGroup` | none                                                | `200 { content: Donor[], totalElements, totalPages }` | `401` → refresh + retry once               |
| `GET /api/donors/{id}`                        | none                                                | `200 Donor`                                           | `404`                                      |
| `POST /api/donors`                            | `{ name, bloodGroup, phone }`                       | `201 Donor`                                           | `409` phone already used, `403`            |
| `PUT /api/donors/{id}`                        | `{ name, bloodGroup, phone }`                       | `200 Donor`                                           | `409`, `404`, `403`                        |
| `DELETE /api/donors/{id}`                     | none (Admin only)                                   | `204`; the donor's donations are deleted too          | `403`, `404`                               |
| `GET /api/donors/{id}/donations`              | none                                                | `200 Donation[]`, newest first                        | `404` donor not found                      |
| `POST /api/donors/{id}/donations`             | `{ donationDate, quantity, location }`              | `201 Donation`                                        | `422` within 90 days, `400` invalid, `403` |
| `PUT /api/donations/{id}`                     | `{ donationDate, quantity, location }`              | `200 Donation`                                        | `422` within 90 days, `404`, `403`         |
| `DELETE /api/donations/{id}`                  | none (Admin only)                                   | `204`                                                 | `403`, `404`                               |
| `GET /api/users`                              | none (Admin only)                                   | `200 [{ id, fullName, email, role, enabled }]`        | `403`                                      |
| `PATCH /api/users/{id}`                       | `{ role?, enabled? }` (Admin only, not own account) | `200` updated user; the user's sessions end           | `400` own account / empty, `404`, `403`    |

- `Donor` = `{ id, name, bloodGroup, phone }`
- `Donation` = `{ id, donorId, donationDate: "YYYY-MM-DD", quantity (ml, 350–450), location }`
- `user` = `{ id, fullName, email, role, enabled }`, where role is `ADMIN`, `STAFF` or `DONOR`
- `page` starts at 0 (Spring Data style); empty filters are not sent
- Refresh cookie: `HttpOnly; Secure; SameSite=Strict; Path=/api/auth`
- Any other status: `5xx` → "Something went wrong"; no response or timeout → "Unable to reach the server"

## Folder structure

```
backend/                     # Spring Boot API: see backend/README.md
src/
├── main.jsx                 # Entry point
├── App.jsx                  # All routes and their guards
├── constants/               # Every fixed value: routes, labels, messages, limits, roles, API paths, config
├── components/
│   ├── ui/                  # Reusable presentational pieces: Button, Input, Select, Card, Alert, PageHeader,
│   │                        # AsyncContent, Pagination, ConfirmDialog, FormActions, ToastList, ...
│   └── layout/              # PublicLayout, DashboardLayout, Sidebar, Topbar, Footer, PageErrorBoundary
├── features/
│   ├── auth/                # Login/Registration forms + schemas, ProtectedRoute, GuestRoute, RoleRoute
│   ├── donors/              # DonorForm + schema, DonorTable, DonorFilters, DonorSummary, useDonors
│   ├── donations/           # DonationForm + schema, DonationTable, DonorDonations, EligibilityStatus
│   ├── users/               # UserTable
│   └── shared/              # DeleteDialog, RowActions (used by donors and donations)
├── pages/                   # One component per route
├── services/                # The ONLY place that talks to the API: apiClient (Axios + interceptors),
│                            # authService, donorService, donationService, userService, tokenStorage
├── hooks/                   # useForm, useFetch, useAuth, useToast, useNotifiedAction, useCrudPermissions, ...
├── context/                 # AuthProvider (logged-in user), ToastProvider (notifications)
├── schemas/                 # Zod field rules shared by several forms
├── utils/                   # Pure helpers: dates, the 90-day rule, permissions, error messages, ...
└── styles/                  # tokens.css (design tokens) + global.css
```

## Known limitations

- **Donor records aren't linked to login accounts yet.** Staff-added donors can't log in, and self-registered DONOR
  accounts can't see their donation history. Linking safely needs identity verification, because donation history
  is medical data. The planned design is in [`docs/rbac.md`](docs/rbac.md#known-limitation-donor-records-are-not-linked-to-login-accounts).

## Further reading

- [`backend/README.md`](backend/README.md): backend setup, security and business rules
- [`docs/walkthrough.md`](docs/walkthrough.md): review guide (structure, auth flow, RBAC, one feature end to end)
- [`docs/token-storage.md`](docs/token-storage.md): why the token is kept in memory plus an HttpOnly cookie
- [`docs/rbac.md`](docs/rbac.md): roles, permissions and where each rule is enforced

## Moving the project to another machine (e.g. Mac → Windows)

- Clone with Git and run `npm ci`. Never copy `node_modules`: it contains OS-specific files.
- On Windows, run `git config --global core.autocrlf false` **before** cloning. `.gitattributes`, `.editorconfig`
  and Prettier keep line endings as LF so `npm run format:check` passes on both systems.
- ESLint is pinned to v9 because `eslint-plugin-react` doesn't support v10 yet, so no `--force` is needed.

## Troubleshooting

| Problem                                               | Fix                                                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `Cannot find module @rollup/rollup-win32-x64-msvc`    | Delete `node_modules` and `package-lock.json`, then run `npm install`                    |
| `format:check` fails on Windows only                  | Line endings: set `core.autocrlf false` and clone again                                  |
| Every request fails with "Unable to reach the server" | Spring Boot isn't running: start it with `./mvnw spring-boot:run` in `backend/`          |
| Backend won't start: "JWT_SECRET must be set"         | Create `backend/.env` from `.env.example` and set `JWT_SECRET`                           |
| Backend can't connect to the database                 | Start PostgreSQL: `docker compose up -d` in `backend/`                                   |
| Port 5432 already in use                              | Another PostgreSQL is running; stop it or change the port in `compose.yaml` and `DB_URL` |
