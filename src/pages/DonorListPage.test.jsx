import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { LABELS } from '@/constants/labels';
import { ROLES } from '@/constants/roles';
import { AuthContext } from '@/context/AuthContext';
import DonorListPage from '@/pages/DonorListPage';
import { getDonors } from '@/services/donorService';

vi.mock('@/services/donorService', () => ({
  getDonors: vi.fn(),
  deleteDonor: vi.fn(),
}));

const ONE_DONOR_PAGE = {
  content: [{ id: 1, name: 'Ravi Kumar', bloodGroup: 'B+', phone: '9876500001' }],
  totalElements: 1,
  totalPages: 1,
};

const renderAs = (role) =>
  render(
    <AuthContext.Provider value={{ user: { fullName: 'Test', role } }}>
      <MemoryRouter>
        <DonorListPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('DonorListPage', () => {
  it('shows donors from the API', async () => {
    getDonors.mockResolvedValue(ONE_DONOR_PAGE);
    renderAs(ROLES.STAFF);
    expect(await screen.findByText('Ravi Kumar')).toBeInTheDocument();
  });

  it('shows the Delete button to Admin only', async () => {
    getDonors.mockResolvedValue(ONE_DONOR_PAGE);
    renderAs(ROLES.ADMIN);
    expect(await screen.findByRole('button', { name: /Ravi Kumar/ })).toBeInTheDocument();
  });

  it('hides the Delete button from Staff', async () => {
    getDonors.mockResolvedValue(ONE_DONOR_PAGE);
    renderAs(ROLES.STAFF);
    await screen.findByText('Ravi Kumar');
    expect(screen.queryByRole('button', { name: /Ravi Kumar/ })).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no donors', async () => {
    getDonors.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 });
    renderAs(ROLES.STAFF);
    expect(await screen.findByText(LABELS.NO_DONORS)).toBeInTheDocument();
  });

  it('shows the error and a retry button when the request fails', async () => {
    getDonors.mockRejectedValue(new Error('Unable to reach the server.'));
    renderAs(ROLES.STAFF);
    expect(await screen.findByText('Unable to reach the server.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: LABELS.RETRY })).toBeInTheDocument();
  });

  it('shows Add donor and Edit to Staff, but not Delete', async () => {
    getDonors.mockResolvedValue(ONE_DONOR_PAGE);
    renderAs(ROLES.STAFF);
    expect(screen.getByRole('link', { name: LABELS.ADD_DONOR })).toBeInTheDocument();
    expect(
      await screen.findByRole('link', { name: LABELS.editDonorAriaLabel('Ravi Kumar') }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: LABELS.deleteDonorAriaLabel('Ravi Kumar') }),
    ).not.toBeInTheDocument();
  });
});
