import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';
import ToastProvider from '@/context/ToastProvider';
import DonationFormPage from '@/pages/DonationFormPage';
import { createDonation, getDonorDonations, updateDonation } from '@/services/donationService';
import { getDonorById } from '@/services/donorService';
import { addDays, getTodayIsoDate } from '@/utils/dateUtils';
import { formatDate } from '@/utils/formatDate';

import { ApiError } from '@/services/apiClient';

vi.mock('@/services/donorService', () => ({ getDonorById: vi.fn() }));
vi.mock('@/services/donationService', () => ({
  getDonorDonations: vi.fn(),
  createDonation: vi.fn(),
  updateDonation: vi.fn(),
}));

const today = getTodayIsoDate();
const RECENT = {
  id: 9,
  donorId: 1,
  donationDate: addDays(today, -30),
  quantity: 450,
  location: 'NIMS',
};

const renderAt = (path) =>
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={ROUTES.DONATION_NEW} element={<DonationFormPage />} />
          <Route path={ROUTES.DONATION_EDIT} element={<DonationFormPage />} />
          <Route path={ROUTES.DONOR_DETAILS} element={<p>Details page</p>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>,
  );

async function fillForm(date) {
  await userEvent.type(await screen.findByLabelText(LABELS.DONATION_DATE, { exact: false }), date);
  await userEvent.type(screen.getByLabelText(LABELS.QUANTITY_ML, { exact: false }), '450');
  await userEvent.type(screen.getByLabelText(LABELS.LOCATION, { exact: false }), 'City Blood Bank');
}

describe('DonationFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDonorById.mockResolvedValue({
      id: 1,
      name: 'Ravi Kumar',
      bloodGroup: 'B+',
      phone: '9876500001',
    });
    getDonorDonations.mockResolvedValue([RECENT]);
  });

  it('blocks a donation within 90 days of the last one, before calling the API', async () => {
    renderAt('/donors/1/donations/new');
    await fillForm(today);
    await userEvent.click(screen.getByRole('button', { name: LABELS.ADD_DONATION }));
    expect(
      screen.getByText(MESSAGES.donationTooSoon(formatDate(RECENT.donationDate))),
    ).toBeInTheDocument();
    expect(createDonation).not.toHaveBeenCalled();
  });

  it('adds an allowed donation, shows a toast and returns to the donor', async () => {
    createDonation.mockResolvedValue({});
    renderAt('/donors/1/donations/new');
    const oldDate = addDays(today, -200);
    await fillForm(oldDate);
    await userEvent.click(screen.getByRole('button', { name: LABELS.ADD_DONATION }));
    expect(createDonation).toHaveBeenCalledWith('1', {
      donationDate: oldDate,
      quantity: 450,
      location: 'City Blood Bank',
    });
    expect(
      await screen.findByText(LABELS.donationCreated(formatDate(oldDate))),
    ).toBeInTheDocument();
    expect(screen.getByText('Details page')).toBeInTheDocument();
  });

  it('edits a donation in the same form without comparing it to itself', async () => {
    updateDonation.mockResolvedValue({});
    renderAt('/donors/1/donations/9/edit');
    const location = await screen.findByDisplayValue('NIMS');
    await userEvent.clear(location);
    await userEvent.type(location, 'NIMS Blood Centre');
    await userEvent.click(screen.getByRole('button', { name: LABELS.SAVE_DONATION }));
    expect(updateDonation).toHaveBeenCalledWith(
      '9',
      expect.objectContaining({ location: 'NIMS Blood Centre' }),
    );
  });

  it('shows an error toast when the server rejects the donation (422)', async () => {
    createDonation.mockRejectedValue(
      new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, MESSAGES.DONATION_NOT_ELIGIBLE),
    );
    renderAt('/donors/1/donations/new');
    await fillForm(addDays(today, -200));
    await userEvent.click(screen.getByRole('button', { name: LABELS.ADD_DONATION }));
    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.DONATION_NOT_ELIGIBLE);
  });
});
