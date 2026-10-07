import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { MESSAGES } from '@/constants/messages';
import { MOCK_CONFIG } from '@/mocks/mockConfig';
import { startMockServer } from '@/mocks/mockServer';
import { apiClient, setUnauthorizedHandler } from '@/services/apiClient';
import { loginUser, refreshSession } from '@/services/authService';
import {
  createDonation,
  deleteDonation,
  getDonorDonations,
  updateDonation,
} from '@/services/donationService';
import { createDonor, deleteDonor, getDonors, updateDonor } from '@/services/donorService';
import { getUsers } from '@/services/userService';
import { setAccessToken } from '@/services/tokenStorage';
import { addDays, getTodayIsoDate } from '@/utils/dateUtils';

// Runs the real services → Axios interceptors → fake backend, like the app does in mock mode.

const STAFF = { email: 'staff@blood.org', password: 'Staff@123' };
const DONOR_USER = { email: 'donor@blood.org', password: 'Donor@123' };
const ADMIN = { email: 'admin@blood.org', password: 'Admin@123' };
const daysAgo = (days) => addDays(getTodayIsoDate(), -days);
const PAGE = { page: 0, size: 5 };

async function logInAs(credentials) {
  const session = await loginUser(credentials);
  setAccessToken(session.accessToken);
  return session;
}

describe('mock backend through the real API layer', () => {
  beforeAll(() => {
    startMockServer(apiClient, 0);
  });

  afterEach(() => {
    vi.useRealTimers();
    setUnauthorizedHandler(null);
  });

  it('logs in and returns the user role, never the password', async () => {
    const session = await logInAs(STAFF);
    expect(session.user).toEqual(expect.objectContaining({ role: 'STAFF' }));
    expect(session.user).not.toHaveProperty('password');
  });

  it('rejects a wrong password with the generic message', async () => {
    await expect(loginUser({ ...STAFF, password: 'Wrong@123' })).rejects.toThrow(
      MESSAGES.LOGIN_FAILED,
    );
  });

  it('enforces roles on the server side (403), not just in the UI', async () => {
    await logInAs(STAFF);
    await expect(getDonors(PAGE)).resolves.toHaveProperty('content');
    await expect(deleteDonor(1)).rejects.toMatchObject({ status: HTTP_STATUS.FORBIDDEN });
    await expect(getUsers()).rejects.toMatchObject({ status: HTTP_STATUS.FORBIDDEN });
  });

  it('silently refreshes an expired access token and retries', async () => {
    await logInAs(STAFF);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + MOCK_CONFIG.ACCESS_TOKEN_TTL_MS + 1);
    setUnauthorizedHandler(async () => {
      setAccessToken((await refreshSession()).accessToken);
      return true;
    });
    await expect(getDonors(PAGE)).resolves.toHaveProperty('content');
  });

  it('ends the session after the idle timeout', async () => {
    await logInAs(STAFF);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + MOCK_CONFIG.IDLE_TIMEOUT_MS + 1);
    await expect(refreshSession()).rejects.toMatchObject({ status: HTTP_STATUS.UNAUTHORIZED });
    await expect(getDonors(PAGE)).rejects.toThrow(MESSAGES.SESSION_EXPIRED);
  });

  it('lets Staff create and update donors, and rejects a duplicate phone (409)', async () => {
    await logInAs(STAFF);
    const created = await createDonor({ name: 'Asha Rao', bloodGroup: 'A+', phone: '9111111111' });
    expect(created).toEqual(expect.objectContaining({ id: expect.any(Number), name: 'Asha Rao' }));
    const updated = await updateDonor(created.id, { ...created, bloodGroup: 'O-' });
    expect(updated.bloodGroup).toBe('O-');
    await expect(
      createDonor({ name: 'Copy Cat', bloodGroup: 'B+', phone: '9111111111' }),
    ).rejects.toThrow(MESSAGES.DONOR_PHONE_TAKEN);
  });

  it('does not let a Donor account create donors (403)', async () => {
    await logInAs(DONOR_USER);
    await expect(
      createDonor({ name: 'Not Allowed', bloodGroup: 'B+', phone: '9222222222' }),
    ).rejects.toMatchObject({ status: HTTP_STATUS.FORBIDDEN });
  });

  describe('donations and the 90-day rule (server side)', () => {
    const NEW_DONATION = { quantity: 450, location: 'City Blood Bank' };

    it('rejects a donation within 90 days of another one with 422', async () => {
      await logInAs(STAFF);
      // Mock donor 1 last donated 56 days ago.
      await expect(
        createDonation(1, { ...NEW_DONATION, donationDate: daysAgo(0) }),
      ).rejects.toMatchObject({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: MESSAGES.DONATION_NOT_ELIGIBLE,
      });
    });

    it('accepts an eligible donation and lists it newest first', async () => {
      await logInAs(STAFF);
      // Mock donor 8 last donated 107 days ago.
      const created = await createDonation(8, { ...NEW_DONATION, donationDate: daysAgo(0) });
      const donations = await getDonorDonations(8);
      expect(donations[0]).toEqual(created);
    });

    it('applies the rule when editing a date, too', async () => {
      await logInAs(STAFF);
      // Moving donor 1's oldest donation (309 days ago) next to the one 160 days ago.
      await expect(
        updateDonation(103, { ...NEW_DONATION, donationDate: daysAgo(150) }),
      ).rejects.toMatchObject({ status: HTTP_STATUS.UNPROCESSABLE_ENTITY });
    });

    it('lets only Admin delete a donation', async () => {
      await logInAs(STAFF);
      await expect(deleteDonation(102)).rejects.toMatchObject({ status: HTTP_STATUS.FORBIDDEN });
      await logInAs(ADMIN);
      await expect(deleteDonation(102)).resolves.toBeNull();
    });

    it('deletes the donations of a deleted donor (cascade)', async () => {
      await logInAs(ADMIN);
      await deleteDonor(3);
      await expect(getDonorDonations(3)).rejects.toMatchObject({ status: HTTP_STATUS.NOT_FOUND });
    });
  });
});
