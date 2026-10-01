// The access token lives ONLY in memory (this variable), never in localStorage or sessionStorage:
// any injected script (XSS) can read web storage, and storage outlives the page.
// After a page reload the token is gone on purpose; AuthProvider gets a fresh one from
// the HttpOnly refresh cookie, which JavaScript cannot read at all.
// Every read/write of the token must go through this file.

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}
