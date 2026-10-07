import { TOAST_TYPES } from '@/constants/config';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/getErrorMessage';

/**
 * Returns runAction(action, successMessage): runs an API call, then shows a success toast or an
 * error toast (with a user-safe message, never a raw error). Resolves to { isSuccess, data }.
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
      showToast(TOAST_TYPES.ERROR, getErrorMessage(error));
      return { isSuccess: false, data: null };
    }
  };
}
