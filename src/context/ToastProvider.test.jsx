import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_CONFIG, TOAST_TYPES } from '@/constants/config';
import { LABELS } from '@/constants/labels';
import ToastProvider from '@/context/ToastProvider';
import { useToast } from '@/hooks/useToast';

function ShowToastButtons() {
  const { showToast } = useToast();
  return (
    <>
      <button type="button" onClick={() => showToast(TOAST_TYPES.SUCCESS, 'Saved')}>
        success
      </button>
      <button type="button" onClick={() => showToast(TOAST_TYPES.ERROR, 'Failed')}>
        error
      </button>
    </>
  );
}

const renderWithToasts = () =>
  render(
    <ToastProvider>
      <ShowToastButtons />
    </ToastProvider>,
  );

describe('ToastProvider', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows an error toast as an alert', async () => {
    renderWithToasts();
    await userEvent.click(screen.getByRole('button', { name: 'error' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });

  it('removes a toast when its close button is pressed', async () => {
    renderWithToasts();
    await userEvent.click(screen.getByRole('button', { name: 'success' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: LABELS.DISMISS_NOTIFICATION }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('removes a toast automatically after a few seconds', () => {
    vi.useFakeTimers();
    renderWithToasts();
    act(() => screen.getByRole('button', { name: 'success' }).click());
    expect(screen.getByText('Saved')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(APP_CONFIG.TOAST_DURATION_MS));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });
});
