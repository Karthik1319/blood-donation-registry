import { describe, expect, it } from 'vitest';
import { buildQueryString } from '@/utils/buildQueryString';

describe('buildQueryString', () => {
  it('leaves out empty values and encodes special characters', () => {
    expect(buildQueryString({ page: 0, search: '', bloodGroup: 'A+' })).toBe(
      '?page=0&bloodGroup=A%2B',
    );
  });

  it('returns an empty string when nothing is set', () => {
    expect(buildQueryString({ search: '', bloodGroup: null })).toBe('');
  });
});
