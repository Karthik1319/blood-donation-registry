import { useNavigate } from 'react-router';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordChecklist from '@/components/ui/PasswordChecklist';
import Select from '@/components/ui/Select';
import { BLOOD_GROUPS } from '@/constants/config';
import { LABELS, PLACEHOLDERS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';
import { PASSWORD_RULES } from '@/constants/validation';
import {
  REGISTRATION_INITIAL_VALUES,
  registrationSchema,
} from '@/features/auth/registrationSchema';
import { useForm } from '@/hooks/useForm';
import { registerUser } from '@/services/authService';

function RegistrationForm() {
  const navigate = useNavigate();
  const { values, getFieldProps, handleSubmit, isSubmitting, submitError } = useForm(
    registrationSchema,
    REGISTRATION_INITIAL_VALUES,
  );

  const submitRegistration = async (newUser) => {
    await registerUser(newUser);
    // Pass the success message to the login page through router state.
    navigate(ROUTES.LOGIN, { state: { successMessage: MESSAGES.REGISTER_SUCCESS } });
  };

  return (
    <form className="form" onSubmit={handleSubmit(submitRegistration)} noValidate>
      <Alert message={submitError} />
      <Input
        {...getFieldProps('fullName')}
        label={LABELS.FULL_NAME}
        placeholder={PLACEHOLDERS.FULL_NAME}
        autoComplete="name"
        isRequired
      />
      <Input
        {...getFieldProps('email')}
        label={LABELS.EMAIL}
        type="email"
        placeholder={PLACEHOLDERS.EMAIL}
        autoComplete="email"
        isRequired
      />
      <Input
        {...getFieldProps('phone')}
        label={LABELS.PHONE}
        type="tel"
        placeholder={PLACEHOLDERS.PHONE}
        autoComplete="tel"
        isRequired
      />
      <Select
        {...getFieldProps('bloodGroup')}
        label={LABELS.BLOOD_GROUP}
        options={BLOOD_GROUPS}
        placeholder={LABELS.SELECT_PLACEHOLDER}
        isRequired
      />
      <Input
        {...getFieldProps('password')}
        label={LABELS.PASSWORD}
        type="password"
        autoComplete="new-password"
        isRequired
      />
      <PasswordChecklist
        password={values.password}
        rules={PASSWORD_RULES}
        title={LABELS.PASSWORD_CHECKLIST_TITLE}
        metIcon={LABELS.RULE_MET_ICON}
        unmetIcon={LABELS.RULE_UNMET_ICON}
      />
      <Input
        {...getFieldProps('confirmPassword')}
        label={LABELS.CONFIRM_PASSWORD}
        type="password"
        autoComplete="new-password"
        isRequired
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText={LABELS.REGISTER_LOADING}
        isFullWidth
      >
        {LABELS.REGISTER_BUTTON}
      </Button>
    </form>
  );
}

export default RegistrationForm;
