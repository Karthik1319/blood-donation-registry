import { Navigate } from 'react-router';
import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

function HomePage() {
  const { user } = useAuth();

  // Redirecting is UX, NOT security; the API must reject requests without a valid token.
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <Card title={`${LABELS.HOME_TITLE}, ${user.fullName}`}>
      <p>{LABELS.HOME_TEXT}</p>
    </Card>
  );
}

export default HomePage;
