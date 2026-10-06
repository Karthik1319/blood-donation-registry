import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '@/constants/api';
import { MESSAGES } from '@/constants/messages';
import { apiClient, apiRequest, setUnauthorizedHandler } from '@/services/apiClient';
import { setAccessToken } from '@/services/tokenStorage';

let server;

describe('apiClient', () => {
  beforeEach(() => {
    server = new MockAdapter(apiClient);
  });

  afterEach(() => {
    server.restore();
    setUnauthorizedHandler(null);
  });

  it('returns the response body on success', async () => {
    server.onGet('/x').reply(HTTP_STATUS.OK, { name: 'Ravi' });
    await expect(apiRequest('/x')).resolves.toEqual({ name: 'Ravi' });
  });

  it('returns null for an empty body', async () => {
    server.onDelete('/x').reply(HTTP_STATUS.NO_CONTENT);
    await expect(apiRequest('/x', { method: 'DELETE' })).resolves.toBeNull();
  });

  it('request interceptor attaches the access token', async () => {
    setAccessToken('abc');
    server.onGet('/x').reply((config) => [HTTP_STATUS.OK, config.headers.Authorization]);
    await expect(apiRequest('/x')).resolves.toBe('Bearer abc');
  });

  it('maps HTTP errors to safe user messages', async () => {
    server.onGet('/x').reply(HTTP_STATUS.NOT_FOUND, 'java.lang.NullPointerException at ...');
    await expect(apiRequest('/x')).rejects.toMatchObject({
      status: HTTP_STATUS.NOT_FOUND,
      message: MESSAGES.NOT_FOUND,
    });
  });

  it('uses endpoint-specific messages when given', async () => {
    server.onPost('/x').reply(HTTP_STATUS.UNAUTHORIZED);
    const errorMessages = { [HTTP_STATUS.UNAUTHORIZED]: MESSAGES.LOGIN_FAILED };
    const request = apiRequest('/x', { method: 'POST', errorMessages, isAuthRequest: true });
    await expect(request).rejects.toThrow(MESSAGES.LOGIN_FAILED);
  });

  it('reports a network error when the server is unreachable or times out', async () => {
    server.onGet('/offline').networkError();
    server.onGet('/slow').timeout();
    const networkError = { status: HTTP_STATUS.NETWORK_ERROR, message: MESSAGES.NETWORK_ERROR };
    await expect(apiRequest('/offline')).rejects.toMatchObject(networkError);
    await expect(apiRequest('/slow')).rejects.toMatchObject(networkError);
  });

  describe('401 response interceptor', () => {
    it('refreshes the token once and retries the request', async () => {
      server.onGet('/donors').replyOnce(HTTP_STATUS.UNAUTHORIZED);
      server.onGet('/donors').replyOnce(HTTP_STATUS.OK, { ok: true });
      const refresh = vi.fn().mockResolvedValue(true);
      setUnauthorizedHandler(refresh);

      await expect(apiRequest('/donors')).resolves.toEqual({ ok: true });
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(server.history.get).toHaveLength(2);
    });

    it('gives up with "session expired" when the refresh fails', async () => {
      server.onGet('/donors').reply(HTTP_STATUS.UNAUTHORIZED);
      setUnauthorizedHandler(vi.fn().mockResolvedValue(false));
      await expect(apiRequest('/donors')).rejects.toThrow(MESSAGES.SESSION_EXPIRED);
      expect(server.history.get).toHaveLength(1);
    });

    it('retries only once, even if the retried request is also rejected', async () => {
      server.onGet('/donors').reply(HTTP_STATUS.UNAUTHORIZED);
      const refresh = vi.fn().mockResolvedValue(true);
      setUnauthorizedHandler(refresh);
      await expect(apiRequest('/donors')).rejects.toThrow(MESSAGES.SESSION_EXPIRED);
      expect(refresh).toHaveBeenCalledTimes(1);
    });

    it('never refreshes for auth requests such as login', async () => {
      server.onPost('/auth/login').reply(HTTP_STATUS.UNAUTHORIZED);
      const refresh = vi.fn();
      setUnauthorizedHandler(refresh);
      await expect(
        apiRequest('/auth/login', { method: 'POST', isAuthRequest: true }),
      ).rejects.toThrow();
      expect(refresh).not.toHaveBeenCalled();
    });
  });
});
