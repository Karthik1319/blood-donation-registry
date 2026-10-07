import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

/** Returns { showToast } from the ToastProvider. */
export function useToast() {
  return useContext(ToastContext);
}
