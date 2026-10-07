import { describe, expect, it } from 'vitest';
import { MESSAGES } from '@/constants/messages';
import { ApiError } from '@/services/apiClient';
import { getErrorMessage } from '@/utils/getErrorMessage';

describe('getErrorMessage', () => {
  it('shows the user-safe message of an API error', () => {
    expect(getErrorMessage(new ApiError(404, MESSAGES.NOT_FOUND))).toBe(MESSAGES.NOT_FOUND);
  });

  it('hides the raw text of any other error', () => {
    const bug = new TypeError("Cannot read properties of undefined (reading 'name')");
    expect(getErrorMessage(bug)).toBe(MESSAGES.GENERIC_ERROR);
  });
});
