import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LABELS, PASSWORD_RULE_LABELS } from '@/constants/labels';
import { VALIDATION_MESSAGES } from '@/constants/messages';
import RegisterForm from '@/features/auth/RegisterForm';
import { getFieldByLabel } from '@/test/getFieldByLabel';
import { renderWithRouter } from '@/test/renderWithRouter';

function ruleItem(label) {
  return screen.getByText(label).closest('li');
}

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

  it('shows no errors before the user interacts with the form', () => {
    renderWithRouter(<RegisterForm />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('validates live while typing and clears the error once the value is valid', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);
    const phone = getFieldByLabel(LABELS.FIELD_PHONE);

    await user.type(phone, '98765');
    expect(screen.getByText(VALIDATION_MESSAGES.PHONE_FORMAT)).toBeInTheDocument();

    await user.type(phone, '43210');
    expect(screen.queryByText(VALIDATION_MESSAGES.PHONE_FORMAT)).not.toBeInTheDocument();
  });

  it('shows "required" when the user leaves a field empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);
    await user.click(getFieldByLabel(LABELS.FIELD_FULL_NAME));
    await user.tab();

    expect(screen.getByText(VALIDATION_MESSAGES.FULL_NAME_REQUIRED)).toBeInTheDocument();
  });

  it('ticks off password rules live and removes the error when all are met', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);
    const password = getFieldByLabel(LABELS.FIELD_PASSWORD);

    await user.type(password, 'abc');
    expect(ruleItem(PASSWORD_RULE_LABELS.LOWERCASE)).toHaveClass('requirement--met');
    expect(ruleItem(PASSWORD_RULE_LABELS.UPPERCASE)).toHaveClass('requirement--unmet');
    expect(screen.getByText(VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS)).toBeInTheDocument();

    await user.type(password, 'DEF12!');
    expect(ruleItem(PASSWORD_RULE_LABELS.UPPERCASE)).toHaveClass('requirement--met');
    expect(screen.queryByText(VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS)).not.toBeInTheDocument();
  });

  it('shows the mismatch live when the confirmation differs from the password', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);
    await user.type(getFieldByLabel(LABELS.FIELD_PASSWORD), 'Str0ng!Pass');
    await user.type(getFieldByLabel(LABELS.FIELD_CONFIRM_PASSWORD), 'Str0ng');
    expect(screen.getByText(VALIDATION_MESSAGES.PASSWORDS_MISMATCH)).toBeInTheDocument();

    await user.type(getFieldByLabel(LABELS.FIELD_CONFIRM_PASSWORD), '!Pass');
    expect(screen.queryByText(VALIDATION_MESSAGES.PASSWORDS_MISMATCH)).not.toBeInTheDocument();
  });
});
