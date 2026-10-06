import { useLocation } from 'react-router';
import Alert from '@/components/ui/Alert';
import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';
import AuthSwitchLink from '@/features/auth/AuthSwitchLink';
import LoginForm from '@/features/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const location = useLocation();
  const { isSessionExpired } = useAuth();
  // Set by the registration page after a successful sign-up.
  const successMessage = location.state?.successMessage ?? '';

  return (
    <Card title={LABELS.LOGIN_TITLE} subtitle={LABELS.LOGIN_SUBTITLE}>
      <Alert message={successMessage} variant="success" />
      <Alert message={isSessionExpired ? MESSAGES.SESSION_EXPIRED : ''} />
      <LoginForm />
      <AuthSwitchLink
        text={LABELS.NO_ACCOUNT}
        linkText={LABELS.NAV_REGISTER}
        to={ROUTES.REGISTER}
      />
    </Card>
  );
}

export default LoginPage;
