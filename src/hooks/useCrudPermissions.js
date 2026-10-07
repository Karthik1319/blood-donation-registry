import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/hasPermission';

/**
 * What the logged-in user may do with one type of record, e.g.
 * useCrudPermissions(CRUD_PERMISSIONS.DONOR) → { canCreate, canEdit, canDelete }.
 * Hiding buttons with these is UX, NOT security; the API must check the same permissions.
 */
export function useCrudPermissions({ create, update, remove }) {
  const { user } = useAuth();
  return {
    canCreate: hasPermission(user, create),
    canEdit: hasPermission(user, update),
    canDelete: hasPermission(user, remove),
  };
}
