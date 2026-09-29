# Frontend Guide — how every piece works

Read it in this order: **1. The big picture → 2. One request, end to end → 3. File by file →
4. Review questions.**

---

## 1. The big picture

Code is sorted into layers. Each layer only talks to the layer below it:

```
pages/            "What is on this screen?"          LoginPage = Card + LoginForm
  └ features/     "What does this feature do?"       LoginForm = schema + service + <Form>
      ├ hooks/    "How does a form behave?"          useZodForm, useFormSubmit
      ├ services/ "How do we talk to the server?"    authService → apiClient → fetch
      └ components/ui/ "How does it look?"           Form, Input, Button, Card, Alert
constants/        Every piece of text, route, limit and setting (used by all layers)
```

**Why layers?** When the backend arrives, only `services/` changes. When the design changes,
only `styles/` and `components/ui/` change. Each change stays in one place.

**Presentational vs feature components**

- `components/ui/` — only knows how to *display* things. It receives everything via props and
  has no idea what "login" is. It can be reused anywhere (the Donor form will reuse it later).
- `features/auth/` — knows the business: which schema, which API call, where to go next.

---

## 2. One request, end to end (Login)

1. `main.jsx` mounts `<App />` inside `<BrowserRouter>`.
2. The URL is `/login` → `App.jsx` renders `PageLayout` (Header + Footer) and puts
   `LoginPage` into its `<Outlet />`.
3. `LoginPage` renders a `Card` containing `LoginForm`.
4. `LoginForm` calls `useZodForm({ schema: loginSchema, initialValues, onSubmit })` and passes
   the result to `<Form fields={LOGIN_FIELDS} form={form} … />`.
5. `Form` loops over `LOGIN_FIELDS` and renders one `Input` per field.
6. **Typing** → `handleChange` stores the value and hides that field's old error.
7. **Leaving a field (blur)** → `handleBlur` validates the whole form with Zod and shows the
   error for *that field only* (so the user isn't shouted at for fields not reached yet).
8. **Submit** → `useFormSubmit.handleSubmit`:
   - `event.preventDefault()` stops the browser reloading the page.
   - If already submitting → ignore (double-submit protection).
   - `schema.safeParse(values)` → invalid? show all errors, focus the first bad field, stop.
   - Valid? set `isSubmitting = true` (button disabled + "Signing in…"), call `onSubmit`.
9. `onSubmit` calls `authService.login()` → `apiClient.request()` → `fetch('/api/auth/login')`.
10. In development Vite forwards `/api/...` to Spring Boot on `localhost:8080`.
11. **Success** → token saved through `tokenStorage`, navigate to Home.
    **Failure** → `apiClient` throws an `ApiError` with a *safe* message; the hook catches it
    and `Form` shows it in an `Alert`.

---

## 3. File by file

### Configuration (the `frontend/` folder)

| File                | One-sentence purpose                                                                   |
| ------------------- | -------------------------------------------------------------------------------------- |
| `package.json`      | Lists dependencies, scripts, and the supported Node version (`engines`).               |
| `package-lock.json` | Freezes the exact version of every dependency so all machines install the same code.  |
| `.nvmrc`            | Tells nvm which Node version to use (`nvm use`).                                       |
| `.npmrc`            | `engine-strict=true`: refuse to install on an unsupported Node version.               |
| `vite.config.js`    | Dev server + build: React plugin, `@/` alias, `/api` proxy, test environment.         |
| `jsconfig.json`     | Teaches VS Code the `@/` alias so Ctrl+click and autocomplete work.                    |
| `eslint.config.js`  | Code-quality rules: React, hooks, accessibility, no console, max 100/30 lines.        |
| `.prettierrc.json`  | Formatting rules (quotes, semicolons, width, LF line endings).                         |
| `.env.example`      | Template of environment variables; copy to `.env`. `.env` is git-ignored.              |
| `index.html`        | The single HTML page; React renders everything inside `<div id="root">`.               |
| `../.gitattributes` | Forces LF line endings in Git so Windows doesn't break `format:check`.                 |
| `../.editorconfig`  | Makes every editor use the same indentation and line endings.                          |

**Why these tools?**

- **Vite** — dev server that starts instantly and a fast production bundler. The React team's
  recommended starting point now that Create React App is deprecated.
- **React Router** — maps URLs to page components.
- **Zod** — declares validation rules once as a *schema* and returns clear messages per field.
- **PropTypes** — checks component props at runtime in development (our replacement for
  TypeScript types). Wrong prop → warning in the browser console.
- **Vitest + Testing Library** — tests that interact with components the way a user does.
- **ESLint 9** (not 10) — `eslint-plugin-jsx-a11y` (accessibility rules) does not support
  ESLint 10 yet. Forcing it with `--legacy-peer-deps` would hide a real incompatibility.

### `src/main.jsx` and `src/App.jsx`

- `main.jsx` — finds `#root`, renders `<App />` inside:
  - `StrictMode`: in development, runs extra checks and renders twice to expose bugs.
  - `BrowserRouter`: gives the whole app access to the URL.
  - Imports the four CSS files once, globally.
- `App.jsx` — the route table. The outer `<Route element={<PageLayout />}>` has no path; it is a
  *layout route*, so every child page is wrapped in Header + Footer. `path="*"` catches any
  unknown URL → `NotFoundPage`.

### `src/constants/` — no magic strings or numbers

| File             | Holds                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| `routes.js`      | URL paths (`ROUTES.LOGIN`). Change a URL in one place.                               |
| `labels.js`      | All visible UI text + field hints. Ready for translation later.                      |
| `messages.js`    | Validation messages, API error messages, success messages.                           |
| `validation.js`  | Limits (min/max lengths) and regex patterns used by the schemas.                     |
| `config.js`      | App name, API base URL, timeout, endpoint paths, HTTP status codes.                  |
| `storageKeys.js` | Browser storage key names.                                                           |
| `forms.js`       | Field definitions (name, label, type, autocomplete) + initial values for each form.  |

- **`Object.freeze`** — makes the object read-only, so no code can change a constant by accident.
- **Messages are built from `LIMITS`** (`` `must be ${LIMITS.PASSWORD_MIN}…` ``), so changing a
  limit updates the rule *and* the message together.
- **`forms.js` field arrays** — the form is *data*; `Form` loops over it. That's how we avoid
  writing `<Input …/>` six times (the "no duplicated JSX" rule).

### `src/features/auth/schemas/` — the validation rules

`loginSchema.js`

- `z.string().trim().min(1, { error })` — "required, ignoring surrounding spaces".
- **Why only "required" on login?** Checking password strength at login reveals the password
  rules to attackers, and older accounts might have been created under different rules. The
  server decides whether the credentials are right.
- Password is **not** trimmed — spaces can be a legitimate part of a password.

`registerSchema.js`

- Rules are chained; Zod checks them in order and we show the **first** failure per field.
  An empty password shows "Password is required.", not six messages at once.
- `.min(1)` before `.min(LIMITS…)` — so an empty field says "required", not "must be 2–50 characters".
- `email: ….pipe(z.email())` — first trim and check length, then *pipe* the result into the
  email-format check.
- **Confirm password** uses `.refine()` on the whole object because it compares two fields.
  `path: ['confirmPassword']` attaches the error to that field.
- **`when:`** — by default Zod skips object-level checks until every field is valid. That would
  hide "Passwords do not match" while the phone is still empty. `when` says: run this check as
  soon as the two password fields themselves are valid.
- Every rule here must be **repeated on the Spring Boot side**. Frontend validation is only for
  fast feedback; anyone can bypass the browser and call the API directly.

### `src/hooks/` — reusable form behaviour

`useZodForm.js` — *Holds form values and per-field errors, and validates with Zod on blur.*

- `values` state: `{ username: '', password: '' }`. Each input is **controlled**: its value comes
  from state and every keystroke updates state.
- `handleChange` uses `event.target.name` so **one** handler serves every field.
- `setValues((previous) => ({ ...previous, [name]: value }))` — the functional form always uses
  the latest state; the spread creates a **new** object (state is never mutated).
- Returns everything a form needs, plus the submit parts from `useFormSubmit`.

`useFormSubmit.js` — *Validates everything on submit, then runs the API call while tracking
loading and server errors.*

- `if (isSubmitting) return;` + disabled button = double-submit protection.
- `focusFirstInvalidField` — moves focus to the first invalid field so keyboard and
  screen-reader users land on the problem. Uses `form.elements.namedItem(name)`, so no ids
  or refs are needed.
- `try / catch / finally` — `finally` re-enables the button whether the call succeeded or failed.
- Errors go through `getErrorMessage`, so a raw technical error can never reach the screen.

**Why two hooks?** Your standard limits functions to 30 lines. The split also gives each hook
one clear job.

### `src/components/ui/` — reusable building blocks

All have JSDoc, PropTypes, default values, and **no hardcoded text or colors**.

| Component      | One sentence                                                                          |
| -------------- | ------------------------------------------------------------------------------------- |
| `Button`       | A native `<button>` with variants and a loading state that disables it.               |
| `Input`        | A labelled input whose hint and error are linked for screen readers.                  |
| `FieldLabel`   | The `<label>` with an optional required marker.                                        |
| `FieldMessage` | Hint or error text under a field; renders nothing when empty.                         |
| `Card`         | A titled panel exposed as a labelled `<section>`.                                      |
| `Alert`        | Form-level success/error message, announced to screen readers.                        |
| `Form`         | Renders fields from a definition array + error alert + submit button.                 |
| `PromptLink`   | "Question? Link" line, e.g. "Don't have an account? Register".                         |

Accessibility details you should be able to point at:

- `htmlFor` on the label = `id` on the input → clicking the label focuses the input, and screen
  readers read the label.
- `aria-invalid` tells assistive tech the value is wrong.
- `aria-describedby` points at the hint and error ids, so they're read along with the label.
- `role="alert"` on errors → announced immediately. Success uses `role="status"` (polite).
- The `*` is `aria-hidden` because the native `required` attribute already announces "required".
- The Alert shows the word "Error:" / "Success:" — color is never the only signal.
- `noValidate` on `<form>` disables the browser's own popups so Zod is the single source of messages.
- `aria-busy` on the loading button.
- `Card` uses `useId()` to generate a unique id for `aria-labelledby`.
- `{...rest}` in `Input` passes remaining props (name, value, onChange, type…) to the `<input>`.

### `src/components/layout/`

- `PageLayout` — Header, `<main>`, Footer. `<Outlet />` is where React Router places the current
  page. `id="main-content"` + `tabIndex={-1}` make it the target of the skip link.
- `Header` — **skip link** (first Tab press shows "Skip to main content", so keyboard users can
  jump past the nav); app name linking home; nav built from a `NAV_ITEMS` array. `NavLink`
  adds an `active` class to the current page; the CSS underlines it (not just a color change).
- `Footer` — tagline and © current year.

### `src/pages/`

Pages are thin: they arrange a `Card` and a feature component. `LoginPage` also reads
`location.state.isRegistered` (set by `RegisterForm` after success) to show the green
"Registration successful" alert. `HomePage` is a placeholder for future donor screens;
`NotFoundPage` handles unknown URLs.

### `src/services/` — the only place that talks to the outside world

- `apiClient.js` — one `request(path, { method, body })` function used for **all** API calls:
  - Adds JSON headers and `Authorization: Bearer <token>` if logged in.
  - `AbortSignal.timeout(15000)` — gives up after 15 s instead of spinning forever.
  - `fetch` throws only when there's **no response** (server down, offline, timeout)
    → `ApiError(0, NETWORK)`.
  - A response with status ≥ 400 → `ApiError(status, safe message for that status)`.
  - This is how we **distinguish bad input (400) vs not-found (404) vs server error (5xx)** —
    a core project requirement.
  - The server's own error text is never shown: it could contain internals or stack traces.
- `ApiError.js` — an `Error` that also carries the HTTP `status`.
- `authService.js` — `login()` and `register()`. `withMessageFor(401, …)` swaps in the generic
  "Invalid username or password" (never reveal *which* one was wrong: that helps attackers
  guess usernames). `register()` does **not** send `confirmPassword` — it's a UI-only check.
- `tokenStorage.js` — the **only** code allowed to read/write the token. Uses `sessionStorage`
  (cleared when the tab closes). Later we can switch to HttpOnly cookies by changing one file.

### `src/utils/`

- `getFieldErrors(zodError)` → `{ fieldName: 'first message' }`, using `z.flattenError`.
- `getErrorMessage(error)` → the safe message if it's an `ApiError`, otherwise a generic one.

### `src/styles/`

- `tokens.css` — **the only place** colors, spacing, fonts, radius and shadows are defined, as
  CSS variables (`--color-primary`). Rebranding = edit one file.
- `base.css` — reset (`box-sizing`), body font, visible `:focus-visible` outline.
- `layout.css` / `components.css` — class-based styles (`.field__input--invalid`, a BEM-style
  naming: block `__element` `--modifier`). No inline styles anywhere.

### Tests (`*.test.js(x)`, 38 tests)

| File                      | Proves                                                                      |
| ------------------------- | --------------------------------------------------------------------------- |
| `loginSchema.test.js`     | Required fields, whitespace-only rejected, username trimmed.                |
| `registerSchema.test.js`  | Each rule with a failing example; mismatch shown even with other errors.    |
| `Input.test.jsx`          | Label linked, error announced, `aria-invalid` and description set.          |
| `LoginForm.test.jsx`      | Empty submit → errors + focus; 401 → generic message; button disabled.       |
| `RegisterForm.test.jsx`   | All fields labelled; validates on blur; error clears on typing.              |
| `apiClient.test.js`       | 400/404/500/502 → right message; network failure separate; Bearer header.   |

`vi.stubGlobal('fetch', …)` replaces the real `fetch` with a fake, so tests never need a
running backend.

---

## 4. Questions a reviewer is likely to ask

**Why not validate with HTML attributes (`required`, `pattern`)?**
Browser messages differ per browser and language, and can't be styled or tested. Zod gives one
set of clear messages, and the same kind of schema can later validate API responses.

**Why validate on the frontend at all if the backend validates?**
Instant feedback for the user and fewer pointless requests. It is not security; the API is.

**Why `safeParse` and not `parse`?**
`parse` *throws* on invalid data; `safeParse` returns `{ success, data | error }`, which is
easier to handle without try/catch.

**Why is the token in `sessionStorage` and not `localStorage`?**
It disappears when the tab closes, which limits the damage on a shared computer. All access
goes through `tokenStorage.js`, so switching to HttpOnly cookies later is one-file change.

**What happens if I click "Sign in" twice fast?**
The first click sets `isSubmitting`; the button becomes disabled, and the handler also returns
early if a request is already running.

**Why are error messages generic on login?**
"User not found" vs "wrong password" would let an attacker discover valid usernames.

**How will the Donor/Donation forms reuse this?**
Add a `donorSchema`, a `DONOR_FIELDS` array, and a `DonorForm` that calls `useZodForm` and
renders `<Form>`. Only a blood-group `<Select>` component is new.

**How does it connect to Spring Boot?**
Vite proxies `/api` → `localhost:8080`. Spring needs `POST /api/auth/login` returning
`{ token }` and `POST /api/auth/register`, with the status codes listed in the frontend README.

**Why `@/` imports?**
`@/components/ui/Button` works from any folder depth; `../../../components/ui/Button` breaks
when files move.

**Why `Object.freeze` on constants?**
Prevents accidental changes at runtime (`ROUTES.LOGIN = 'x'` silently does nothing).

**What does `key={field.name}` do?**
Gives React a stable identity for each list item so it updates the right input. Never use the
array index for lists that can change.

**What does `StrictMode` do?**
Development-only checks; it renders components twice to reveal side effects. No effect in production.

---

## Try it yourself (best way to learn before the review)

1. `npm run dev`, press **Tab** from the top of the page: the skip link appears first.
2. Submit the empty Register form: all errors show and focus jumps to Full name.
3. Type a bad phone, press Tab: the error appears; start typing again: it disappears.
4. Change `PASSWORD_MIN` in `constants/validation.js` to 10: both the rule and the hint text change.
5. Change `--color-primary` in `styles/tokens.css`: the whole app recolors.
6. Break a rule on purpose (add `console.log` somewhere) and run `npm run lint` to see it fail.
