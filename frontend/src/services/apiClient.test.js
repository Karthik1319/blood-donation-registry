import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_MESSAGES } from '@/constants/messages';
import { request } from '@/services/apiClient';
import { setToken } from '@/services/tokenStorage';

function mockFetch(implementation) {
  vi.stubGlobal('fetch', vi.fn(implementation));
}

describe('apiClient.request', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the parsed JSON body on success', async () => {
    mockFetch(async () => new Response(JSON.stringify({ id: 1 }), { status: 200 }));
    await expect(request('/donors/1')).resolves.toEqual({ id: 1 });
  });

  it.each([
    [400, API_MESSAGES.BAD_REQUEST],
    [404, API_MESSAGES.NOT_FOUND],
    [500, API_MESSAGES.SERVER],
    [502, API_MESSAGES.UNAVAILABLE],
  ])('maps HTTP %i to a safe message', async (status, message) => {
    mockFetch(async () => new Response('internal details', { status }));
    await expect(request('/donors')).rejects.toMatchObject({ status, message });
  });

  it('reports a network failure separately from server errors', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(request('/donors')).rejects.toMatchObject({
      status: 0,
      message: API_MESSAGES.NETWORK,
    });
  });

  it('sends the stored token as a Bearer header', async () => {
    setToken('abc123');
    mockFetch(async () => new Response(null, { status: 204 }));
    await request('/donors');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer abc123');
  });
});
