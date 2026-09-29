import { STORAGE_KEYS } from '@/constants/storageKeys';

// sessionStorage (not localStorage) so the login is forgotten when the browser tab closes.
// Every read/write of the token must go through this file, so we can change storage in one place.

export function saveSession(token, user) {
  sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  sessionStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
}

export function getToken() {
  return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function getStoredUser() {
  const storedUser = sessionStorage.getItem(STORAGE_KEYS.AUTH_USER);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_USER);
}
