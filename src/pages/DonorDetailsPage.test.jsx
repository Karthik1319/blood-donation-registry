import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/AuthContext';
import DonorDetailsPage from '@/pages/DonorDetailsPage';
import { getDonorById, getDonorDonations } from '@/services/donorService';

vi.mock('@/services/donorService', () => ({
  getDonorById: vi.fn(),
  getDonorDonations: vi.fn(),
}));

const DONOR = { id: 1, name: 'Ravi Kumar', bloodGroup: 'B+', phone: '9876500001' };

const renderPage = (role = ROLES.STAFF) =>
  render(
    <AuthContext.Provider value={{ user: { fullName: 'Test', role } }}>
      <MemoryRouter initialEntries={['/donors/1']}>
        <Routes>
          <Route path={ROUTES.DONOR_DETAILS} element={<DonorDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('DonorDetailsPage', () => {
  it('shows the donor and their donations', async () => {
    getDonorById.mockResolvedValue(DONOR);
    getDonorDonations.mockResolvedValue([
      { id: 9, donationDate: '2026-03-15', quantity: 450, location: 'City Blood Bank' },
    ]);
    renderPage();
    expect(await screen.findByRole('heading', { level: 1, name: DONOR.name })).toBeInTheDocument();
    expect(await screen.findByText('City Blood Bank')).toBeInTheDocument();
    expect(screen.getByText('15 Mar 2026')).toBeInTheDocument();
    expect(getDonorById).toHaveBeenCalledWith('1');
    expect(screen.getByRole('link', { name: LABELS.EDIT })).toHaveAttribute(
      'href',
      '/donors/1/edit',
    );
  });

  it('shows the empty state when the donor has no donations', async () => {
    getDonorById.mockResolvedValue(DONOR);
    getDonorDonations.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText(LABELS.NO_DONATIONS)).toBeInTheDocument();
  });

  it('shows the error from the API when the donor does not exist', async () => {
    getDonorById.mockRejectedValue(new Error(MESSAGES.NOT_FOUND));
    getDonorDonations.mockRejectedValue(new Error(MESSAGES.NOT_FOUND));
    renderPage();
    expect(await screen.findByText(MESSAGES.NOT_FOUND)).toBeInTheDocument();
    expect(screen.queryByText(LABELS.DONATIONS_TITLE)).not.toBeInTheDocument();
  });
});
