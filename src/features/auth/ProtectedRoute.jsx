import { Navigate, Outlet } from 'react-router';
import LoadingMessage from '@/components/ui/LoadingMessage';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

/**
 * Parent route for pages that need a logged-in user; anyone else is sent to Login.
 * This is UX, NOT security: the API must reject requests without a valid token.
 */
function ProtectedRoute() {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return <LoadingMessage message={LABELS.LOADING} />;
  }
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
