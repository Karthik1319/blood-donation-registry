import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LABELS } from '@/constants/labels';
import { API_MESSAGES, VALIDATION_MESSAGES } from '@/constants/messages';
import LoginForm from '@/features/auth/LoginForm';
import { getFieldByLabel } from '@/test/getFieldByLabel';
import { renderWithRouter } from '@/test/renderWithRouter';

function mockFetchResponse(status, body = {}) {
  const response = new Response(JSON.stringify(body), { status });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

async function fillAndSubmit(user) {
  await user.type(getFieldByLabel(LABELS.FIELD_USERNAME), 'admin');
  await user.type(getFieldByLabel(LABELS.FIELD_PASSWORD), 'wrong-password');
  await user.click(screen.getByRole('button', { name: LABELS.LOGIN_SUBMIT }));
}

describe('LoginForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows an error per field and focuses the first one on empty submit', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);
    await user.click(screen.getByRole('button', { name: LABELS.LOGIN_SUBMIT }));

    expect(screen.getByText(VALIDATION_MESSAGES.USERNAME_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(VALIDATION_MESSAGES.PASSWORD_REQUIRED)).toBeInTheDocument();
    expect(getFieldByLabel(LABELS.FIELD_USERNAME)).toHaveFocus();
  });

  it('shows the generic message when the API rejects the credentials', async () => {
    mockFetchResponse(401);
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);
    await fillAndSubmit(user);

    expect(await screen.findByText(API_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
  });

  it('disables the submit button while the request is running', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);
    await fillAndSubmit(user);

    expect(screen.getByRole('button', { name: LABELS.LOGIN_SUBMITTING })).toBeDisabled();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
