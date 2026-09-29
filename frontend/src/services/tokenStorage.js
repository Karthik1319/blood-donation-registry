import { STORAGE_KEYS } from '@/constants/storageKeys';

// The ONLY place that touches the auth token. sessionStorage is cleared when the tab closes,
// which limits how long a stolen token stays usable on a shared machine.
export function getToken() {
  return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function setToken(token) {
  sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function clearToken() {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}
