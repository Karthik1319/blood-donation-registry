import { describe, expect, it } from 'vitest';
import { ROLES, ROUTE_ROLES } from '@/constants/roles';
import { hasRole } from '@/utils/hasRole';

describe('hasRole', () => {
  it('allows everyone when no roles are required', () => {
    expect(hasRole({ role: ROLES.DONOR }, undefined)).toBe(true);
  });

  it('allows a role that is in the list', () => {
    expect(hasRole({ role: ROLES.ADMIN }, ROUTE_ROLES.USERS)).toBe(true);
  });

  it('blocks a role that is not in the list', () => {
    expect(hasRole({ role: ROLES.STAFF }, ROUTE_ROLES.USERS)).toBe(false);
  });

  it('blocks when nobody is logged in', () => {
    expect(hasRole(null, ROUTE_ROLES.DONORS)).toBe(false);
  });
});
