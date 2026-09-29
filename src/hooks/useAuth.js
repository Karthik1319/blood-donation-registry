import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/** Returns { user, login, logout } from the AuthProvider. */
export function useAuth() {
  return useContext(AuthContext);
}
