# Where to store the login token (banking standard)

## Short answer

**Access token in memory (a JavaScript variable) + refresh token in an `HttpOnly; Secure; SameSite=Strict` cookie.**
Never `localStorage`. Never `sessionStorage`.

This is what the project now does (`src/services/tokenStorage.js`).

## The two tokens

| Token             | What it is for                                      | Lifetime (suggested)                        | Where it lives                                       |
| ----------------- | --------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| **Access token**  | Sent as `Authorization: Bearer …` on every API call | 5–15 minutes                                | JS variable in `tokenStorage.js` (memory only)       |
| **Refresh token** | Used only to get a new access token                 | 30 min idle / 8 h max, rotated on every use | HttpOnly cookie set by Spring Boot; JS can't read it |

## Comparing the options

| Option               | Can an XSS script steal it?                                                      | Survives reload? | Shared across tabs? | Verdict for banking  |
| -------------------- | -------------------------------------------------------------------------------- | ---------------- | ------------------- | -------------------- |
| `localStorage`       | **Yes**, any time                                                                | Yes, forever     | Yes                 | ❌ Never             |
| `sessionStorage`     | **Yes**, while the tab is open                                                   | Yes (same tab)   | No                  | ❌ Not acceptable    |
| Memory (JS variable) | Only while the page is open and only by calling the API, not by copying it later | No               | No                  | ✅ For access token  |
| `HttpOnly` cookie    | **No**, JavaScript cannot read it                                                | Yes              | Yes                 | ✅ For refresh token |

**Why web storage fails:** XSS (an injected script) is the most common front-end attack. Anything in
`localStorage`/`sessionStorage` can be read with one line (`localStorage.getItem(...)`) and sent to the attacker,
who can then use the token from their own machine until it expires.

**Why memory + HttpOnly cookie works:**

- The long-lived token (refresh) is in a cookie JavaScript can never read, so XSS can't copy it.
- The short-lived token (access) disappears when the page closes and expires within minutes.
- `SameSite=Strict` stops other websites from making the browser send the cookie (CSRF protection).
- `Secure` means the cookie is only sent over HTTPS.

## How the flow works in this app

1. **Login** – `POST /api/auth/login` → server returns `{ accessToken, user }` in the body **and** sets the refresh
   cookie. The frontend keeps `accessToken` in memory and `user` in React state.
2. **API calls** – `apiClient.js` adds `Authorization: Bearer <accessToken>`.
3. **Page reload** – memory is empty, so `AuthProvider` calls `POST /api/auth/refresh`. The browser sends the cookie
   automatically; the server returns a new access token and **rotates** the refresh token (old one becomes invalid).
4. **Logout** – `POST /api/auth/logout` → server revokes the refresh token and clears the cookie; frontend clears memory.

## What the Spring Boot backend must do (future)

- Set the cookie: `HttpOnly; Secure; SameSite=Strict; Path=/api/auth`.
- Rotate refresh tokens and store them hashed, so a reused (stolen) token can be detected and every session revoked.
- Keep access tokens short (≤ 15 min) and sign them (e.g. JWT with a server-only key).
- Hash passwords with BCrypt; rate-limit / lock out repeated failed logins.
- Re-check role and ownership on **every** request (see `rbac.md`).

## Expired or invalid tokens (built)

The Axios response interceptor in `src/services/apiClient.js` handles this in one place: a 401 from a normal
request triggers one `/auth/refresh` and a retry. If the refresh also fails (session over, token revoked),
the user is logged out and the Login page says "Your session has expired". In mock mode the fake backend makes
access tokens expire after 1 minute and ends idle sessions after 3 minutes, so both paths can be demonstrated.

## Limits to be honest about

No browser storage is 100 % safe against XSS: while a malicious script runs on the page it can still _use_ the
session. That is why the other standards matter too: no `dangerouslySetInnerHTML`, no `eval`, a strict
Content-Security-Policy header, and short token lifetimes.

References: OWASP HTML5 Security Cheat Sheet (Local Storage), OWASP JWT Cheat Sheet, OAuth 2.0 for Browser-Based
Apps (IETF draft).
