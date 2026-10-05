import { afterEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { MESSAGES } from '@/constants/messages';
import { apiRequest, setUnauthorizedHandler } from '@/services/apiClient';
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
  afterEach(() => {
    clearAccessToken();
    setUnauthorizedHandler(null);
  });

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

  describe('401 interceptor', () => {
    const response = (status, body = '') => ({
      ok: status >= 200 && status < 300,
      status,
      text: async () => body,
    });

    it('refreshes the token once and retries the request', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(response(HTTP_STATUS.UNAUTHORIZED))
        .mockResolvedValueOnce(response(200, '{"ok":true}'));
      vi.stubGlobal('fetch', fetchMock);
      const refresh = vi.fn().mockResolvedValue(true);
      setUnauthorizedHandler(refresh);

      await expect(apiRequest('/donors')).resolves.toEqual({ ok: true });
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('gives up with "session expired" when the refresh fails', async () => {
      mockFetchResponse(HTTP_STATUS.UNAUTHORIZED);
      setUnauthorizedHandler(vi.fn().mockResolvedValue(false));
      await expect(apiRequest('/donors')).rejects.toThrow(MESSAGES.SESSION_EXPIRED);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('never refreshes for auth requests such as login', async () => {
      mockFetchResponse(HTTP_STATUS.UNAUTHORIZED);
      const refresh = vi.fn();
      setUnauthorizedHandler(refresh);
      await expect(apiRequest('/auth/login', { isAuthRequest: true })).rejects.toThrow();
      expect(refresh).not.toHaveBeenCalled();
    });
  });
});
