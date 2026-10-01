import { describe, expect, it } from 'vitest';
import { PERMISSIONS, ROLES } from '@/constants/roles';
import { hasPermission } from '@/utils/hasPermission';

describe('hasPermission', () => {
  it('returns false when nobody is logged in', () => {
    expect(hasPermission(null, PERMISSIONS.DONOR_VIEW_ALL)).toBe(false);
  });

  it('gives admins every permission', () => {
    expect(hasPermission({ role: ROLES.ADMIN }, PERMISSIONS.DONOR_DELETE)).toBe(true);
  });

  it('does not let staff delete records', () => {
    expect(hasPermission({ role: ROLES.STAFF }, PERMISSIONS.DONOR_CREATE)).toBe(true);
    expect(hasPermission({ role: ROLES.STAFF }, PERMISSIONS.DONOR_DELETE)).toBe(false);
  });

  it('limits donors to their own data', () => {
    expect(hasPermission({ role: ROLES.DONOR }, PERMISSIONS.DONATION_VIEW_OWN)).toBe(true);
    expect(hasPermission({ role: ROLES.DONOR }, PERMISSIONS.DONATION_VIEW_ALL)).toBe(false);
  });

  it('returns false for an unknown role', () => {
    expect(hasPermission({ role: 'HACKER' }, PERMISSIONS.DONOR_VIEW_ALL)).toBe(false);
  });
});
