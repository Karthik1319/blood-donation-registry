import { MESSAGES } from '@/constants/messages';
import { ApiError } from '@/services/apiClient';

/**
 * The text to show the user for a caught error. Only ApiError messages are written for users;
 * anything else is a bug in our code, so its raw text (e.g. "Cannot read properties of
 * undefined") is never shown, only a generic message.
 */
export function getErrorMessage(error) {
  return error instanceof ApiError ? error.message : MESSAGES.GENERIC_ERROR;
}
