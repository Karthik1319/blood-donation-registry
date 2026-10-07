import { TOAST_TYPES } from '@/constants/config';
import { useToast } from '@/hooks/useToast';

/**
 * Returns runAction(action, successMessage): runs an API call, then shows a success toast or an
 * error toast (with the user-safe message from apiClient). Resolves to { isSuccess, data }.
 * Create, update and delete all use this, so feedback works the same everywhere.
 */
export function useNotifiedAction() {
  const { showToast } = useToast();

  return async (action, successMessage) => {
    try {
      const data = await action();
      showToast(TOAST_TYPES.SUCCESS, successMessage);
      return { isSuccess: true, data };
    } catch (error) {
      showToast(TOAST_TYPES.ERROR, error.message);
      return { isSuccess: false, data: null };
    }
  };
}
