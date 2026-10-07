# Review walkthrough

A guide for presenting the project: folder structure, authentication flow, RBAC, and one feature end to end.
Each section ends with the files to open while explaining it.

## 1. Folder structure in one minute

The code is organised in layers. Each layer only uses the layers below it:

```
pages/            One component per route. Puts features together on a page.
  ↓
features/         Feature components that know the business (donors, donations, auth).
  ↓
components/ui/    Plain reusable pieces (Button, Input, Card...). No business logic, no fixed text.
hooks/            Reusable logic (forms, fetching, toasts, permissions).
  ↓
services/         The ONLY place that talks to the API. Components never call Axios.
  ↓
constants/        Every fixed value: routes, labels, messages, roles, limits.
```

**Rules that hold everywhere:** no text or numbers written directly in components (all in `constants/`); styling
only through CSS variables (`styles/tokens.css`); every API call has loading, error and empty states.

**Open:** `src/` tree, `src/constants/labels.js`, `src/components/ui/Button.jsx` (JSDoc + PropTypes).

## 2. Authentication flow

```mermaid
sequenceDiagram
  actor User
  participant Form as LoginForm
  participant Auth as AuthProvider
  participant API as apiClient (Axios)
  participant Server as Backend
  User->>Form: email + password
  Form->>Form: Zod validation (loginSchema)
  Form->>API: authService.loginUser()
  API->>Server: POST /api/auth/login
  Server-->>API: { accessToken, user } + HttpOnly refresh cookie
  API-->>Auth: login(session)
  Auth->>Auth: token → memory (tokenStorage), user → React state
  Auth-->>User: redirect to Dashboard
```

Points to explain:

- **Where the token lives:** the access token only in a JavaScript variable (`tokenStorage.js`), never in
  localStorage or sessionStorage, because an injected script can read those. The refresh token is in an HttpOnly
  cookie that JavaScript can't read at all. Details: `docs/token-storage.md`.
- **Every request:** the Axios **request interceptor** adds `Authorization: Bearer <token>`.
- **Token expired:** the server answers 401. The **response interceptor** asks `AuthProvider` to call
  `/auth/refresh` once, then repeats the original request. The user notices nothing.
- **Session over:** if the refresh also fails, the user is logged out and the Login page says
  "Your session has expired". Demo: log in, wait 3 minutes, click Donors.
- **Page reload:** memory is empty, so `AuthProvider` calls `/auth/refresh` at start-up while the guards show
  "Loading...".
- **Logout:** `/auth/logout` (server revokes the cookie), token and user cleared, redirect to Login.
- **Login errors are generic** ("Invalid email or password") so nobody can find out which emails exist.

**Open:** `services/apiClient.js` (both interceptors), `context/AuthProvider.jsx`, `services/tokenStorage.js`.

## 3. RBAC (role-based access control)

Three roles: **Admin**, **Staff**, **Donor**. Rules are enforced in three layers:

| Layer          | What it controls                      | Where                                                                 |
| -------------- | ------------------------------------- | --------------------------------------------------------------------- |
| Pages and menu | Who can open a page / see a menu item | `ROUTE_ROLES` → `RoleRoute` (403 page) and `Sidebar` (`hasRole`)      |
| Buttons        | Who sees Add / Edit / Delete          | `ROLE_PERMISSIONS` → `useCrudPermissions` (`hasPermission`)           |
| **Server**     | **What is actually allowed**          | Spring Boot `SecurityConfig`: token + role on every request (401/403) |

- The sidebar and the route guard read the **same** `ROUTE_ROLES` list, so a menu item and its page can never
  disagree.
- Hiding a button is UX, not security. Every place that hides something says so in a comment. The backend proves
  the server is the real gate: a Staff user calling delete directly gets **403**.
- New registrations are always **Donor**: the frontend never sends a role, and the backend ignores one if sent.

Demo: log in as Admin (sees Users, Delete), Staff (no Users, no Delete), Donor (Dashboard only; typing `/donors`
shows the 403 page).

**Open:** `constants/roles.js`, `features/auth/RoleRoute.jsx`, `components/layout/Sidebar.jsx`,
`hooks/useCrudPermissions.js`, backend `config/SecurityConfig.java`.

## 4. One feature end to end: "Add donation"

```mermaid
sequenceDiagram
  actor Staff
  participant Form as DonationForm
  participant Page as DonationFormPage
  participant Service as donationService
  participant API as apiClient (Axios)
  participant Server as Backend
  Staff->>Form: date, quantity, location
  Form->>Form: Zod (createDonationSchema) incl. 90-day rule
  Form->>Page: onSubmit(values)
  Page->>Service: createDonation(donorId, values) via useNotifiedAction
  Service->>API: apiRequest POST /donors/:id/donations
  API->>Server: request + Bearer token
  alt allowed
    Server-->>API: 201 donation
    API-->>Page: data
    Page-->>Staff: green toast + back to donor page (list reloads)
  else within 90 days
    Server-->>API: 422
    API-->>Page: ApiError("Not eligible: ...")
    Page-->>Staff: red toast, form stays open
  end
```

Step by step:

1. **UI:** `DonationForm` uses `useForm` with a Zod schema built from the donor's other donations, so a too-early
   date shows a red message under the field while typing. The submit button is disabled while saving (no double
   submit).
2. **Page:** `DonationFormPage.saveDonation` calls `createDonation` (or `updateDonation` in edit mode: the same page
   and form serve both) inside `useNotifiedAction`, which shows the success or error toast.
3. **Service:** `donationService.createDonation` calls `apiRequest`. It also maps **422** to the friendly
   "Not eligible" message.
4. **API layer:** `apiClient` adds the Bearer token, refreshes on 401, and turns any failure into an `ApiError` with
   a safe message. Raw errors and stack traces never reach the screen (`getErrorMessage`).
5. **Server:** Spring Boot checks the token and role (`SecurityConfig`), validates the body (`DonationRequest`),
   locks the donor's row and applies the 90-day rule again (`DonationService` + `DonationEligibility`), saves to
   PostgreSQL and answers 201, 400, 403 or 422.
6. **Back in the UI:** on success the user returns to the donor page, which loads the list again, so the new
   donation and the updated eligibility banner appear.

**Open:** `features/donations/DonationForm.jsx`, `features/donations/donationSchema.js`,
`utils/donationEligibility.js`, `pages/DonationFormPage.jsx`, `hooks/useNotifiedAction.js`,
`services/donationService.js`, `services/apiClient.js`, then backend `DonationController` → `DonationService` →
`DonationEligibility`.

## 5. Questions a reviewer may ask

**Why not localStorage for the token?** Any injected script can read it and send it away. Memory + HttpOnly cookie
keeps the long-lived token out of JavaScript entirely.

**How was the frontend built before the backend existed?** Against a temporary fake backend that answered the same
HTTP requests (tokens, 401/403, 422), following the API contract in the README. Once Spring Boot implemented that
contract, the fake was deleted and the frontend needed no code changes.

**Where is the 90-day rule?** Once, in `utils/donationEligibility.js` (unit-tested), used by the form, the banner
and the server. Exactly 90 days is allowed, 89 is not, and back-filled dates are checked too.

**How do you avoid duplicate code?** One form per entity for add and edit; shared field rules
(`schemas/fieldSchemas.js`); one `DeleteDialog`, `RowActions`, `FormActions` and `useCrudPermissions` for donors
and donations; one `useFetch` for loading/error/retry.

**What happens if a component crashes?** `PageErrorBoundary` shows "Something went wrong" with Try again inside the
layout, never a blank page or a stack trace.

**React 19 ignores PropTypes at runtime. Why keep them?** They document every component's props and ESLint
requires them; the project standard asks for JSDoc + PropTypes.

**How would you add a new page?** Add the route to `ROUTES`, its roles to `ROUTE_ROLES`, one line to `NAV_ITEMS`,
and the `<Route>` in `App.jsx`. The sidebar, guard and highlight work automatically.
