import { useLocation } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Card from '@/components/ui/Card';
import PromptLink from '@/components/ui/PromptLink';
import { LABELS } from '@/constants/labels';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';
import LoginForm from '@/features/auth/LoginForm';

function LoginPage() {
  const location = useLocation();
  // Set by RegisterForm after a successful registration.
  const isRegistered = Boolean(location.state?.isRegistered);

  return (
    <Card
      title={LABELS.LOGIN_TITLE}
      subtitle={LABELS.LOGIN_SUBTITLE}
      footer={
        <PromptLink
          prompt={LABELS.LOGIN_NO_ACCOUNT}
          to={ROUTES.REGISTER}
          linkText={LABELS.NAV_REGISTER}
        />
      }
    >
      {isRegistered && <Alert variant="success">{SUCCESS_MESSAGES.REGISTERED}</Alert>}
      <LoginForm />
    </Card>
  );
}

export default LoginPage;
