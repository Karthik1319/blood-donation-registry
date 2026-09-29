import Card from '@/components/ui/Card';
import PromptLink from '@/components/ui/PromptLink';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import RegisterForm from '@/features/auth/RegisterForm';

function RegisterPage() {
  return (
    <Card
      title={LABELS.REGISTER_TITLE}
      subtitle={LABELS.REGISTER_SUBTITLE}
      footer={
        <PromptLink
          prompt={LABELS.REGISTER_HAS_ACCOUNT}
          to={ROUTES.LOGIN}
          linkText={LABELS.NAV_LOGIN}
        />
      }
    >
      <RegisterForm />
    </Card>
  );
}

export default RegisterPage;
