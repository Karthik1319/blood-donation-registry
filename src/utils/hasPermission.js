import { ROLE_PERMISSIONS } from '@/constants/roles';

/**
 * Returns true when the user's role includes the permission.
 * UX only (show/hide buttons): the API must check the same rule on every request.
 */
export function hasPermission(user, permission) {
  if (!user) {
    return false;
  }
  const rolePermissions = ROLE_PERMISSIONS[user.role] ?? [];
  return rolePermissions.includes(permission);
}
