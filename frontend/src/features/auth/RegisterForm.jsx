import { useNavigate } from 'react-router-dom';
import Form from '@/components/ui/Form';
import { REGISTER_FIELDS, REGISTER_INITIAL_VALUES } from '@/constants/forms';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { registerSchema } from '@/features/auth/schemas/registerSchema';
import { useZodForm } from '@/hooks/useZodForm';
import { register } from '@/services/authService';

// Connects the generic Form to the registration schema and the register API call.
function RegisterForm() {
  const navigate = useNavigate();
  const form = useZodForm({
    schema: registerSchema,
    initialValues: REGISTER_INITIAL_VALUES,
    onSubmit: async (account) => {
      await register(account);
      // Router state tells the login page to show the success message.
      navigate(ROUTES.LOGIN, { state: { isRegistered: true } });
    },
  });

  return (
    <Form
      fields={REGISTER_FIELDS}
      form={form}
      submitLabel={LABELS.REGISTER_SUBMIT}
      submittingLabel={LABELS.REGISTER_SUBMITTING}
    />
  );
}

export default RegisterForm;
