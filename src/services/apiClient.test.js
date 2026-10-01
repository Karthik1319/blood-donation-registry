import { afterEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { MESSAGES } from '@/constants/messages';
import { apiRequest } from '@/services/apiClient';
import { clearAccessToken, setAccessToken } from '@/services/tokenStorage';

const mockFetchResponse = (status, body = '') =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      text: async () => body,
    }),
  );

describe('apiRequest', () => {
  afterEach(clearAccessToken);

  it('returns the parsed JSON body on success', async () => {
    mockFetchResponse(200, '{"name":"Ravi"}');
    await expect(apiRequest('/x')).resolves.toEqual({ name: 'Ravi' });
  });

  it('returns null for an empty body', async () => {
    mockFetchResponse(HTTP_STATUS.NO_CONTENT);
    await expect(apiRequest('/x')).resolves.toBeNull();
  });

  it('sends the access token as a Bearer header', async () => {
    mockFetchResponse(200);
    setAccessToken('abc');
    await apiRequest('/x');
    const [, options] = fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe('Bearer abc');
  });

  it('maps HTTP errors to safe user messages', async () => {
    mockFetchResponse(HTTP_STATUS.NOT_FOUND, 'java.lang.NullPointerException at ...');
    await expect(apiRequest('/x')).rejects.toMatchObject({
      status: HTTP_STATUS.NOT_FOUND,
      message: MESSAGES.NOT_FOUND,
    });
  });

  it('uses endpoint-specific messages when given', async () => {
    mockFetchResponse(HTTP_STATUS.UNAUTHORIZED);
    const errorMessages = { [HTTP_STATUS.UNAUTHORIZED]: MESSAGES.LOGIN_FAILED };
    await expect(apiRequest('/x', { errorMessages })).rejects.toThrow(MESSAGES.LOGIN_FAILED);
  });

  it('reports a network error when the server is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(apiRequest('/x')).rejects.toMatchObject({
      status: HTTP_STATUS.NETWORK_ERROR,
      message: MESSAGES.NETWORK_ERROR,
    });
  });
});
