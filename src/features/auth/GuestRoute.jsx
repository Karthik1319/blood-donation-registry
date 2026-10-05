import { Navigate, Outlet } from 'react-router';
import LoadingMessage from '@/components/ui/LoadingMessage';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

/** Parent route for Login/Register: a user who is already logged in goes to the Dashboard. */
function GuestRoute() {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return <LoadingMessage message={LABELS.LOADING} />;
  }
  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <Outlet />;
}

export default GuestRoute;
