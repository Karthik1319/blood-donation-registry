# Session and token security

## The approach

**Access token in memory (a JavaScript variable) + refresh token in an `HttpOnly; Secure; SameSite=Strict` cookie.**
Nothing is kept in `localStorage` or `sessionStorage`.

| Token             | Used for                                            | Lifetime                                         | Where it lives                                                       |
| ----------------- | --------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| **Access token**  | Sent as `Authorization: Bearer …` on every API call | 15 minutes                                       | A variable in `src/services/tokenStorage.js` (memory only)           |
| **Refresh token** | Only to get a new access token                      | 30 minutes since last use; replaced on every use | HttpOnly cookie set by the backend; the database keeps only its hash |

## Why not localStorage?

| Option            | Can an injected script (XSS) steal it?                         | Survives reload? | Used for      |
| ----------------- | -------------------------------------------------------------- | ---------------- | ------------- |
| `localStorage`    | **Yes**, at any time, with one line of code                    | Yes, forever     | Nothing       |
| `sessionStorage`  | **Yes**, while the tab is open                                 | Same tab only    | Nothing       |
| Memory (variable) | Only by using it while the page is open, not by copying it out | No               | Access token  |
| `HttpOnly` cookie | **No**: JavaScript can't read it at all                        | Yes              | Refresh token |

XSS is the most common front-end attack. A token in web storage can be copied out and used from the attacker's own
machine; the long-lived refresh token in an HttpOnly cookie can't be read by scripts at all, and the access token
dies with the page and expires within minutes.

The cookie's other flags: `Secure` (HTTPS only), `SameSite=Strict` (other sites can't make the browser send it:
CSRF protection) and `Path=/api/auth` (sent only to refresh and logout, not with every request).

## The flow

1. **Login:** `POST /api/auth/login` returns `{ accessToken, user }` and sets the refresh cookie. The access token
   goes into memory, the user into React state.
2. **Every API call:** the Axios request interceptor adds `Authorization: Bearer <accessToken>`.
3. **Expired access token:** the API answers 401; the response interceptor calls `/api/auth/refresh` once and
   retries the request. The user notices nothing.
4. **Page reload:** memory is empty, so the app calls `/api/auth/refresh` at start-up; the browser sends the cookie
   automatically.
5. **Session over:** if the refresh fails (idle too long, logged out, disabled), the user lands on Login with
   "Your session has expired".
6. **Logout:** `POST /api/auth/logout` revokes the refresh token on the server and clears the cookie.

## What the backend does

- **Rotation:** every refresh marks the old refresh token as used and issues a new one, so each value works once.
- **Theft detection:** if an already-used refresh token is presented again, someone has a copy, so all of that
  user's sessions are revoked.
- **Hashed storage:** only the SHA-256 hash of each refresh token is stored, so a database leak gives no usable
  tokens.
- **Signed access tokens:** JWTs signed with a server-only secret (at least 32 characters; the app refuses to start
  without one).
- **Per-request account check:** every request looks the user up, so disabling an account or changing a role takes
  effect on the next request (see `rbac.md`).
- **Passwords:** BCrypt; the same answer and the same timing for an unknown email and a wrong password.

## Not covered yet

- **Login rate-limiting / lockout** after repeated failed attempts.
- **Maximum session length:** an active user stays logged in indefinitely; banking apps usually cap this (e.g.
  8 hours).
- **Idle warning on screen:** an idle page keeps showing data until the next click triggers the logout.
- **A copied access token** of a normally logged-out user keeps working until it expires (up to 15 minutes).
  Putting a session id in the token and checking it per request would close this.
- **Content-Security-Policy header** when deployed. No browser storage is fully safe while a malicious script runs
  on the page; CSP, avoiding `dangerouslySetInnerHTML`/`eval`, and short token lifetimes limit the damage.

References: OWASP HTML5 Security Cheat Sheet (Local Storage), OWASP JWT Cheat Sheet, OAuth 2.0 for Browser-Based
Apps (IETF draft).
