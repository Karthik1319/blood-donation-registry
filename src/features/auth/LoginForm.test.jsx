import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import AuthProvider from '@/context/AuthProvider';
import LoginForm from '@/features/auth/LoginForm';

// Simulates the Spring Boot API answering 401 to every request.
const mockUnauthorizedApi = () =>
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue({ ok: false, status: HTTP_STATUS.UNAUTHORIZED, text: async () => '' }),
  );

const renderLoginForm = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </AuthProvider>,
  );

describe('LoginForm', () => {
  it('shows field errors when submitted empty', async () => {
    mockUnauthorizedApi();
    renderLoginForm();
    await userEvent.click(screen.getByRole('button', { name: LABELS.LOGIN_BUTTON }));
    expect(screen.getByText(MESSAGES.EMAIL_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES.PASSWORD_REQUIRED)).toBeInTheDocument();
  });

  it('shows a generic error when the API rejects the credentials', async () => {
    mockUnauthorizedApi();
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(LABELS.EMAIL, { exact: false }), 'x@y.com');
    await userEvent.type(screen.getByLabelText(LABELS.PASSWORD, { exact: false }), 'Wrong@123');
    await userEvent.click(screen.getByRole('button', { name: LABELS.LOGIN_BUTTON }));
    expect(await screen.findByText(MESSAGES.LOGIN_FAILED)).toBeInTheDocument();
  });
});
