import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PasswordChecklist from '@/components/ui/PasswordChecklist';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { PASSWORD_RULES } from '@/constants/validation';

const renderChecklist = (password) =>
  render(
    <PasswordChecklist
      password={password}
      rules={PASSWORD_RULES}
      title={LABELS.PASSWORD_CHECKLIST_TITLE}
      metIcon={LABELS.SUCCESS_ICON}
      unmetIcon={LABELS.ERROR_ICON}
    />,
  );

describe('PasswordChecklist', () => {
  it('marks every rule as unmet for an empty password', () => {
    renderChecklist('');
    screen.getAllByRole('listitem').forEach((item) => {
      expect(item).toHaveClass('checklist__item--unmet');
    });
  });

  it('marks only the satisfied rules as met', () => {
    renderChecklist('abc');
    expect(screen.getByText(MESSAGES.PASSWORD_RULE_LOWERCASE, { exact: false })).toHaveClass(
      'checklist__item--met',
    );
    expect(screen.getByText(MESSAGES.PASSWORD_RULE_UPPERCASE, { exact: false })).toHaveClass(
      'checklist__item--unmet',
    );
  });
});
