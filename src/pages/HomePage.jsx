import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { useAuth } from '@/hooks/useAuth';

// Only rendered inside ProtectedRoute, so `user` is always set here.
function HomePage() {
  const { user } = useAuth();

  return (
    <Card title={`${LABELS.HOME_TITLE}, ${user.fullName}`}>
      <p>{LABELS.HOME_TEXT}</p>
    </Card>
  );
}

export default HomePage;
