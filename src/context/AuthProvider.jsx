import { useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@/context/AuthContext';
import { clearSession, getStoredUser, saveSession } from '@/services/tokenStorage';

/**
 * Provides { user, login, logout } to the whole app.
 * @param {object} props
 * @param {React.ReactNode} props.children - the app.
 */
function AuthProvider({ children }) {
  // Read the saved user once at start-up so a page refresh keeps the user logged in.
  const [user, setUser] = useState(getStoredUser);

  const login = ({ token, user: loggedInUser }) => {
    saveSession(token, loggedInUser);
    setUser(loggedInUser);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
