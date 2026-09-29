import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import AuthSwitchLink from '@/features/auth/AuthSwitchLink';
import RegistrationForm from '@/features/auth/RegistrationForm';

function RegisterPage() {
  return (
    <Card title={LABELS.REGISTER_TITLE} subtitle={LABELS.REGISTER_SUBTITLE}>
      <RegistrationForm />
      <AuthSwitchLink text={LABELS.HAVE_ACCOUNT} linkText={LABELS.NAV_LOGIN} to={ROUTES.LOGIN} />
    </Card>
  );
}

export default RegisterPage;
