import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RequirementList from '@/components/ui/RequirementList';

const RULES = [
  { id: 'digit', label: 'One number', pattern: /\d/ },
  { id: 'upper', label: 'One uppercase letter', pattern: /[A-Z]/ },
];

function itemFor(label) {
  return screen.getByText(label).closest('li');
}

describe('RequirementList', () => {
  it('shows every rule as pending (neutral) before anything is typed', () => {
    render(<RequirementList id="rules" rules={RULES} value="" />);
    expect(itemFor('One number')).toHaveClass('requirement--pending');
    expect(itemFor('One uppercase letter')).toHaveClass('requirement--pending');
  });

  it('marks each rule met or unmet for the current value, with text not just color', () => {
    render(<RequirementList id="rules" rules={RULES} value="abc1" />);
    expect(itemFor('One number')).toHaveClass('requirement--met');
    expect(itemFor('One number')).toHaveTextContent('(met)');
    expect(itemFor('One uppercase letter')).toHaveClass('requirement--unmet');
    expect(itemFor('One uppercase letter')).toHaveTextContent('(not met)');
  });
});
