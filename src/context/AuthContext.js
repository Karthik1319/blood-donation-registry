import { createContext } from 'react';

// Holds the logged-in user so any component (e.g. the Header) can read it without prop drilling.
export const AuthContext = createContext(null);
