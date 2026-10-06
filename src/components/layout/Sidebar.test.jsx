import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import Sidebar from '@/components/layout/Sidebar';
import { LABELS } from '@/constants/labels';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/AuthContext';

const renderSidebar = (role, path = ROUTES.DASHBOARD) =>
  render(
    <AuthContext.Provider value={{ user: { fullName: 'Test', role } }}>
      <MemoryRouter initialEntries={[path]}>
        <Sidebar id="sidebar" isOpen={false} onNavigate={vi.fn()} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );

const menuLink = (label) => screen.queryByRole('link', { name: label });

describe('Sidebar', () => {
  it('shows every menu item to Admin', () => {
    renderSidebar(ROLES.ADMIN);
    expect(menuLink(LABELS.NAV_DASHBOARD)).toBeInTheDocument();
    expect(menuLink(LABELS.NAV_DONORS)).toBeInTheDocument();
    expect(menuLink(LABELS.NAV_USERS)).toBeInTheDocument();
  });

  it('hides the Admin-only Users item from Staff', () => {
    renderSidebar(ROLES.STAFF);
    expect(menuLink(LABELS.NAV_DONORS)).toBeInTheDocument();
    expect(menuLink(LABELS.NAV_USERS)).not.toBeInTheDocument();
  });

  it('shows only the Dashboard to a Donor', () => {
    renderSidebar(ROLES.DONOR);
    expect(menuLink(LABELS.NAV_DASHBOARD)).toBeInTheDocument();
    expect(menuLink(LABELS.NAV_DONORS)).not.toBeInTheDocument();
  });

  it('highlights the current page, including its sub-pages', () => {
    renderSidebar(ROLES.ADMIN, '/donors/1');
    expect(menuLink(LABELS.NAV_DONORS)).toHaveAttribute('aria-current', 'page');
    expect(menuLink(LABELS.NAV_DONORS)).toHaveClass('sidebar__link--active');
    expect(menuLink(LABELS.NAV_DASHBOARD)).not.toHaveAttribute('aria-current');
  });
});
