import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/AuthContext';
import DonorDetailsPage from '@/pages/DonorDetailsPage';
import { getDonorDonations } from '@/services/donationService';
import { getDonorById } from '@/services/donorService';
import { addDays, getTodayIsoDate } from '@/utils/dateUtils';
import { formatDate } from '@/utils/formatDate';

import { ApiError } from '@/services/apiClient';

vi.mock('@/services/donorService', () => ({ getDonorById: vi.fn() }));
vi.mock('@/services/donationService', () => ({
  getDonorDonations: vi.fn(),
  deleteDonation: vi.fn(),
}));

const DONOR = { id: 1, name: 'Ravi Kumar', bloodGroup: 'B+', phone: '9876500001' };
const donationDaysAgo = (id, days) => ({
  id,
  donorId: 1,
  donationDate: addDays(getTodayIsoDate(), -days),
  quantity: 450,
  location: 'City Blood Bank',
});

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
  it('shows the donor, their donations and the Edit link', async () => {
    getDonorById.mockResolvedValue(DONOR);
    getDonorDonations.mockResolvedValue([donationDaysAgo(9, 200)]);
    renderPage();
    expect(await screen.findByRole('heading', { level: 1, name: DONOR.name })).toBeInTheDocument();
    expect(await screen.findByText('City Blood Bank')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: LABELS.EDIT })).toHaveAttribute(
      'href',
      '/donors/1/edit',
    );
  });

  it('says "not eligible" with the next date when the last donation was under 90 days ago', async () => {
    getDonorById.mockResolvedValue(DONOR);
    getDonorDonations.mockResolvedValue([donationDaysAgo(9, 30)]);
    renderPage();
    const nextDate = formatDate(addDays(getTodayIsoDate(), 60));
    expect(await screen.findByText(LABELS.notEligibleUntil(nextDate))).toBeInTheDocument();
  });

  it('says "eligible" and still offers Add donation when there are no donations', async () => {
    getDonorById.mockResolvedValue(DONOR);
    getDonorDonations.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText(LABELS.NO_DONATIONS)).toBeInTheDocument();
    expect(screen.getByText(LABELS.ELIGIBLE)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: LABELS.ADD_DONATION })).toBeInTheDocument();
  });

  it('shows donation Delete to Admin only', async () => {
    getDonorById.mockResolvedValue(DONOR);
    getDonorDonations.mockResolvedValue([donationDaysAgo(9, 200)]);
    renderPage(ROLES.STAFF);
    await screen.findByText('City Blood Bank');
    expect(screen.queryByRole('button', { name: /Delete donation/ })).not.toBeInTheDocument();
  });

  it('shows the error from the API when the donor does not exist', async () => {
    getDonorById.mockRejectedValue(new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND));
    renderPage();
    expect(await screen.findByText(MESSAGES.NOT_FOUND)).toBeInTheDocument();
    expect(screen.queryByText(LABELS.DONATIONS_TITLE)).not.toBeInTheDocument();
  });
});
