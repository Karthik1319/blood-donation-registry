import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@/context/AuthContext';
import { logoutUser, refreshSession } from '@/services/authService';
import { clearAccessToken, setAccessToken } from '@/services/tokenStorage';

/**
 * Provides { user, isRestoring, login, logout } to the whole app.
 * @param {object} props
 * @param {React.ReactNode} props.children - the app.
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true until we know whether the refresh cookie still holds a valid session.
  const [isRestoring, setIsRestoring] = useState(true);

  // On page load the in-memory token is empty, so ask the server for a new one.
  useEffect(() => {
    let isActive = true;
    refreshSession()
      .then((session) => {
        if (isActive) {
          setAccessToken(session.accessToken);
          setUser(session.user);
        }
      })
      .catch(clearAccessToken)
      .finally(() => {
        if (isActive) {
          setIsRestoring(false);
        }
      });
    return () => {
      isActive = false;
    };
  }, []);

  const login = (session) => {
    setAccessToken(session.accessToken);
    setUser(session.user);
  };

  const logout = async () => {
    await logoutUser();
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isRestoring, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
