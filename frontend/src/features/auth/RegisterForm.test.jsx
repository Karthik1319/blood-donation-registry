import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LABELS } from '@/constants/labels';
import { VALIDATION_MESSAGES } from '@/constants/messages';
import RegisterForm from '@/features/auth/RegisterForm';
import { getFieldByLabel } from '@/test/getFieldByLabel';
import { renderWithRouter } from '@/test/renderWithRouter';

describe('RegisterForm', () => {
  it('renders every registration field with a label', () => {
    renderWithRouter(<RegisterForm />);
    const labels = [
      LABELS.FIELD_FULL_NAME,
      LABELS.FIELD_USERNAME,
      LABELS.FIELD_EMAIL,
      LABELS.FIELD_PHONE,
      LABELS.FIELD_PASSWORD,
      LABELS.FIELD_CONFIRM_PASSWORD,
    ];
    labels.forEach((label) => expect(getFieldByLabel(label)).toBeInTheDocument());
  });

  it('validates a field when the user leaves it', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);
    await user.type(getFieldByLabel(LABELS.FIELD_PHONE), '123');
    await user.tab();

    expect(screen.getByText(VALIDATION_MESSAGES.PHONE_FORMAT)).toBeInTheDocument();
  });

  it('clears a field error as soon as the user edits the field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);
    await user.click(screen.getByRole('button', { name: LABELS.REGISTER_SUBMIT }));
    await user.type(getFieldByLabel(LABELS.FIELD_FULL_NAME), 'A');

    expect(screen.queryByText(VALIDATION_MESSAGES.FULL_NAME_REQUIRED)).not.toBeInTheDocument();
  });
});
