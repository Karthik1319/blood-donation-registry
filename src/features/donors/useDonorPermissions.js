import { PERMISSIONS } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/hasPermission';

/**
 * What the logged-in user may do with donors: { canCreate, canEdit, canDelete }.
 * Hiding buttons with these is UX, NOT security; the API must check the same permissions.
 */
export function useDonorPermissions() {
  const { user } = useAuth();
  return {
    canCreate: hasPermission(user, PERMISSIONS.DONOR_CREATE),
    canEdit: hasPermission(user, PERMISSIONS.DONOR_UPDATE),
    canDelete: hasPermission(user, PERMISSIONS.DONOR_DELETE),
  };
}
