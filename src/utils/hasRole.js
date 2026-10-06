/**
 * True when no roles are required, or the user's role is one of `allowedRoles`.
 * UX only (menus, routes): the API must check the role on every request.
 */
export function hasRole(user, allowedRoles) {
  if (!allowedRoles) {
    return true;
  }
  return Boolean(user) && allowedRoles.includes(user.role);
}
