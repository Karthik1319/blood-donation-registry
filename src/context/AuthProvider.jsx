import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@/context/AuthContext';
import { setUnauthorizedHandler } from '@/services/apiClient';
import { logoutUser, refreshSession } from '@/services/authService';
import { clearAccessToken, setAccessToken } from '@/services/tokenStorage';

function startSession(session, setUser) {
  setAccessToken(session.accessToken);
  setUser(session.user);
}

function endSession(setUser) {
  clearAccessToken();
  setUser(null);
}

/** Asks the server for a new access token (via the refresh cookie). Returns true on success. */
async function tryRefreshSession(setUser) {
  try {
    startSession(await refreshSession(), setUser);
    return true;
  } catch {
    endSession(setUser);
    return false;
  }
}

/**
 * Provides { user, isRestoring, isSessionExpired, dismissSessionExpired, login, logout } to the app.
 * @param {object} props
 * @param {React.ReactNode} props.children - the app.
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true until we know whether the refresh cookie still holds a valid session.
  const [isRestoring, setIsRestoring] = useState(true);
  // true when the user was logged out because the session ran out (shown on the Login page).
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    let isActive = true;
    // On page load the in-memory token is empty, so ask the server for a new one.
    tryRefreshSession(setUser).finally(() => {
      if (isActive) {
        setIsRestoring(false);
      }
    });
    // When any API call gets 401, apiClient's interceptor calls this. If the refresh fails the
    // user is logged out, and ProtectedRoute sends them to the login page.
    setUnauthorizedHandler(async () => {
      const isRefreshed = await tryRefreshSession(setUser);
      setIsSessionExpired(!isRefreshed);
      return isRefreshed;
    });
    return () => {
      isActive = false;
      setUnauthorizedHandler(null);
    };
  }, []);

  // Called when the user tries to log in again, so the old notice doesn't stack with new errors.
  const dismissSessionExpired = () => setIsSessionExpired(false);

  const login = (session) => {
    setIsSessionExpired(false);
    startSession(session, setUser);
  };

  const logout = async () => {
    await logoutUser();
    endSession(setUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, isRestoring, isSessionExpired, dismissSessionExpired, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
