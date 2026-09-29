import { useNavigate } from 'react-router';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LABELS, PLACEHOLDERS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { LOGIN_INITIAL_VALUES, loginSchema } from '@/features/auth/loginSchema';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { loginUser } from '@/services/authService';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { getFieldProps, handleSubmit, isSubmitting, submitError } = useForm(
    loginSchema,
    LOGIN_INITIAL_VALUES,
  );

  const submitLogin = async (credentials) => {
    const session = await loginUser(credentials);
    login(session);
    navigate(ROUTES.HOME);
  };

  return (
    <form className="form" onSubmit={handleSubmit(submitLogin)} noValidate>
      <Alert message={submitError} />
      <Input
        {...getFieldProps('email')}
        label={LABELS.EMAIL}
        type="email"
        placeholder={PLACEHOLDERS.EMAIL}
        autoComplete="username"
        isRequired
      />
      <Input
        {...getFieldProps('password')}
        label={LABELS.PASSWORD}
        type="password"
        autoComplete="current-password"
        isRequired
      />
      <Button type="submit" isLoading={isSubmitting} loadingText={LABELS.LOGIN_LOADING} isFullWidth>
        {LABELS.LOGIN_BUTTON}
      </Button>
    </form>
  );
}

export default LoginForm;
