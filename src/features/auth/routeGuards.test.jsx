import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LABELS } from '@/constants/labels';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/AuthContext';
import GuestRoute from '@/features/auth/GuestRoute';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import RoleRoute from '@/features/auth/RoleRoute';

const ADMIN_PAGE = '/admin-only';

// Renders the same route tree as App.jsx, with simple text pages, starting at `startPath`.
const renderAt = (startPath, authValue) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[startPath]}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path={ROUTES.LOGIN} element={<p>Login page</p>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<p>Dashboard page</p>} />
            <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path={ADMIN_PAGE} element={<p>Admin page</p>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

const loggedOut = { user: null, isRestoring: false };
const asRole = (role) => ({ user: { fullName: 'Test', role }, isRestoring: false });

describe('route guards', () => {
  it('shows a loading message while the session is being restored', () => {
    renderAt(ROUTES.DASHBOARD, { user: null, isRestoring: true });
    expect(screen.getByRole('status')).toHaveTextContent(LABELS.LOADING);
  });

  it('sends logged-out users from a protected page to Login', () => {
    renderAt(ROUTES.DASHBOARD, loggedOut);
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('sends logged-in users away from Login to the Dashboard', () => {
    renderAt(ROUTES.LOGIN, asRole(ROLES.DONOR));
    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
  });

  it('lets an allowed role open a role-restricted page', () => {
    renderAt(ADMIN_PAGE, asRole(ROLES.ADMIN));
    expect(screen.getByText('Admin page')).toBeInTheDocument();
  });

  it('shows the 403 page to a role that is not allowed', () => {
    renderAt(ADMIN_PAGE, asRole(ROLES.STAFF));
    expect(screen.getByText(LABELS.ACCESS_DENIED_TITLE)).toBeInTheDocument();
    expect(screen.queryByText('Admin page')).not.toBeInTheDocument();
  });
});
