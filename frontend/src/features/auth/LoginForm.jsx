import { useNavigate } from 'react-router-dom';
import Form from '@/components/ui/Form';
import { LOGIN_FIELDS, LOGIN_INITIAL_VALUES } from '@/constants/forms';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { loginSchema } from '@/features/auth/schemas/loginSchema';
import { useZodForm } from '@/hooks/useZodForm';
import { login } from '@/services/authService';

// Connects the generic Form to the login schema and the login API call.
function LoginForm() {
  const navigate = useNavigate();
  const form = useZodForm({
    schema: loginSchema,
    initialValues: LOGIN_INITIAL_VALUES,
    onSubmit: async (credentials) => {
      await login(credentials);
      navigate(ROUTES.HOME, { replace: true });
    },
  });

  return (
    <Form
      fields={LOGIN_FIELDS}
      form={form}
      submitLabel={LABELS.LOGIN_SUBMIT}
      submittingLabel={LABELS.LOGIN_SUBMITTING}
    />
  );
}

export default LoginForm;
