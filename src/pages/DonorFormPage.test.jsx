import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';
import ToastProvider from '@/context/ToastProvider';
import DonorFormPage from '@/pages/DonorFormPage';
import { createDonor, getDonorById, updateDonor } from '@/services/donorService';

import { ApiError } from '@/services/apiClient';

vi.mock('@/services/donorService', () => ({
  createDonor: vi.fn(),
  updateDonor: vi.fn(),
  getDonorById: vi.fn(),
}));

const DONOR = { id: 7, name: 'Ravi Kumar', bloodGroup: 'B+', phone: '9876500001' };

const renderAt = (path) =>
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={ROUTES.DONOR_NEW} element={<DonorFormPage />} />
          <Route path={ROUTES.DONOR_EDIT} element={<DonorFormPage />} />
          <Route path={ROUTES.DONOR_DETAILS} element={<p>Details page</p>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>,
  );

const field = (label) => screen.getByLabelText(label, { exact: false });

describe('DonorFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates with Zod before calling the API', async () => {
    renderAt(ROUTES.DONOR_NEW);
    await userEvent.click(await screen.findByRole('button', { name: LABELS.ADD_DONOR }));
    expect(screen.getByText(MESSAGES.NAME_REQUIRED)).toBeInTheDocument();
    expect(createDonor).not.toHaveBeenCalled();
  });

  it('creates a donor, shows a success toast and opens its details', async () => {
    createDonor.mockResolvedValue(DONOR);
    renderAt(ROUTES.DONOR_NEW);
    await userEvent.type(
      await screen.findByLabelText(LABELS.FULL_NAME, { exact: false }),
      DONOR.name,
    );
    await userEvent.selectOptions(field(LABELS.BLOOD_GROUP), DONOR.bloodGroup);
    await userEvent.type(field(LABELS.PHONE), DONOR.phone);
    await userEvent.click(screen.getByRole('button', { name: LABELS.ADD_DONOR }));

    expect(createDonor).toHaveBeenCalledWith({
      name: DONOR.name,
      bloodGroup: 'B+',
      phone: DONOR.phone,
    });
    expect(await screen.findByText(LABELS.donorCreated(DONOR.name))).toBeInTheDocument();
    expect(screen.getByText('Details page')).toBeInTheDocument();
  });

  it('pre-fills the same form in edit mode and saves with PUT', async () => {
    getDonorById.mockResolvedValue(DONOR);
    updateDonor.mockResolvedValue({ ...DONOR, phone: '9000000000' });
    renderAt('/donors/7/edit');
    const phone = await screen.findByDisplayValue(DONOR.phone);
    await userEvent.clear(phone);
    await userEvent.type(phone, '9000000000');
    await userEvent.click(screen.getByRole('button', { name: LABELS.SAVE_DONOR }));

    expect(updateDonor).toHaveBeenCalledWith('7', expect.objectContaining({ phone: '9000000000' }));
    expect(await screen.findByText(LABELS.donorUpdated(DONOR.name))).toBeInTheDocument();
  });

  it('shows an error toast and stays on the form when saving fails', async () => {
    createDonor.mockRejectedValue(new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DONOR_PHONE_TAKEN));
    renderAt(ROUTES.DONOR_NEW);
    await userEvent.type(
      await screen.findByLabelText(LABELS.FULL_NAME, { exact: false }),
      DONOR.name,
    );
    await userEvent.selectOptions(field(LABELS.BLOOD_GROUP), DONOR.bloodGroup);
    await userEvent.type(field(LABELS.PHONE), DONOR.phone);
    await userEvent.click(screen.getByRole('button', { name: LABELS.ADD_DONOR }));

    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.DONOR_PHONE_TAKEN);
    expect(screen.getByRole('button', { name: LABELS.ADD_DONOR })).toBeEnabled();
  });
});
