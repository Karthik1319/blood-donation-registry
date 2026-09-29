import { API_MESSAGES } from '@/constants/messages';
import { ApiError } from '@/services/ApiError';

// Unknown errors may contain technical details, so users only ever see a generic message.
export function getErrorMessage(error) {
  return error instanceof ApiError ? error.message : API_MESSAGES.SERVER;
}
