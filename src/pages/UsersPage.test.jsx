import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LABELS } from '@/constants/labels';
import { ROLE_LABELS, ROLES } from '@/constants/roles';
import { AuthContext } from '@/context/AuthContext';
import ToastProvider from '@/context/ToastProvider';
import UsersPage from '@/pages/UsersPage';
import { getUsers, updateUser } from '@/services/userService';

vi.mock('@/services/userService', () => ({ getUsers: vi.fn(), updateUser: vi.fn() }));

const ADMIN = {
  id: 1,
  fullName: 'Demo Admin',
  email: 'admin@blood.org',
  role: ROLES.ADMIN,
  enabled: true,
};
const STAFF = {
  id: 2,
  fullName: 'Demo Staff',
  email: 'staff@blood.org',
  role: ROLES.STAFF,
  enabled: true,
};

const renderPage = () =>
  render(
    <AuthContext.Provider value={{ user: ADMIN }}>
      <ToastProvider>
        <MemoryRouter>
          <UsersPage />
        </MemoryRouter>
      </ToastProvider>
    </AuthContext.Provider>,
  );

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue([ADMIN, STAFF]);
  });

  it('shows status badges and no actions on the logged-in admin row', async () => {
    renderPage();
    const ownRow = (await screen.findByText('admin@blood.org')).closest('tr');
    expect(within(ownRow).getByText(LABELS.YOU)).toBeInTheDocument();
    expect(within(ownRow).queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByText(LABELS.STATUS_ACTIVE)).toHaveLength(2);
  });

  it('disables an account only after confirmation, then shows a toast', async () => {
    updateUser.mockResolvedValue({ ...STAFF, enabled: false });
    renderPage();
    await userEvent.click(
      await screen.findByRole('button', { name: LABELS.disableUserAriaLabel(STAFF.fullName) }),
    );
    expect(updateUser).not.toHaveBeenCalled();

    const dialog = screen.getByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: LABELS.DISABLE }));
    expect(updateUser).toHaveBeenCalledWith(STAFF.id, { enabled: false });
    expect(await screen.findByText(LABELS.userDisabled(STAFF.fullName))).toBeInTheDocument();
  });

  it('offers only the other roles and sends the chosen one', async () => {
    updateUser.mockResolvedValue({ ...STAFF, role: ROLES.ADMIN });
    renderPage();
    await userEvent.click(
      await screen.findByRole('button', { name: LABELS.changeRoleAriaLabel(STAFF.fullName) }),
    );
    const dialog = screen.getByRole('dialog');
    const select = within(dialog).getByLabelText(LABELS.NEW_ROLE);
    const optionTexts = within(select)
      .getAllByRole('option')
      .map((option) => option.textContent);
    expect(optionTexts).toEqual([ROLE_LABELS[ROLES.ADMIN], ROLE_LABELS[ROLES.DONOR]]);

    await userEvent.selectOptions(select, ROLES.ADMIN);
    await userEvent.click(within(dialog).getByRole('button', { name: LABELS.CHANGE_ROLE }));
    expect(updateUser).toHaveBeenCalledWith(STAFF.id, { role: ROLES.ADMIN });
  });
});
