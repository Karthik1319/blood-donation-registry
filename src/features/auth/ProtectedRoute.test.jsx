import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LABELS } from '@/constants/labels';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/AuthContext';
import ProtectedRoute from '@/features/auth/ProtectedRoute';

const PAGE_TEXT = 'Secret page';
const LOGIN_TEXT = 'Login page';

const renderRoute = (authValue, allowedRoles) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[ROUTES.HOME]}>
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <p>{PAGE_TEXT}</p>
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.LOGIN} element={<p>{LOGIN_TEXT}</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('ProtectedRoute', () => {
  it('shows a loading message while the session is being restored', () => {
    renderRoute({ user: null, isRestoring: true });
    expect(screen.getByRole('status')).toHaveTextContent(LABELS.LOADING);
  });

  it('redirects to login when nobody is logged in', () => {
    renderRoute({ user: null, isRestoring: false });
    expect(screen.getByText(LOGIN_TEXT)).toBeInTheDocument();
  });

  it('shows the page to a logged-in user', () => {
    renderRoute({ user: { role: ROLES.DONOR }, isRestoring: false });
    expect(screen.getByText(PAGE_TEXT)).toBeInTheDocument();
  });

  it('denies access when the role is not allowed', () => {
    renderRoute({ user: { role: ROLES.DONOR }, isRestoring: false }, [ROLES.ADMIN]);
    expect(screen.getByText(LABELS.ACCESS_DENIED_TITLE)).toBeInTheDocument();
    expect(screen.queryByText(PAGE_TEXT)).not.toBeInTheDocument();
  });
});
