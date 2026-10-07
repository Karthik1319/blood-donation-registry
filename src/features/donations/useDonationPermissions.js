import { PERMISSIONS } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/hasPermission';

/**
 * What the logged-in user may do with donations: { canCreate, canEdit, canDelete }.
 * Hiding buttons with these is UX, NOT security; the API must check the same permissions.
 */
export function useDonationPermissions() {
  const { user } = useAuth();
  return {
    canCreate: hasPermission(user, PERMISSIONS.DONATION_CREATE),
    canEdit: hasPermission(user, PERMISSIONS.DONATION_UPDATE),
    canDelete: hasPermission(user, PERMISSIONS.DONATION_DELETE),
  };
}
