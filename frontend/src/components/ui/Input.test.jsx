import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Input from '@/components/ui/Input';

function renderInput(props = {}) {
  return render(
    <Input id="email" name="email" label="Email" value="" onChange={vi.fn()} {...props} />,
  );
}

describe('Input', () => {
  it('links the visible label to the input', () => {
    renderInput();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('id', 'email');
  });

  it('shows no error and is valid by default', () => {
    renderInput();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('announces the error and marks the input invalid', () => {
    renderInput({ error: 'Email is required.' });
    const input = screen.getByRole('textbox');
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Email is required.');
  });
});
