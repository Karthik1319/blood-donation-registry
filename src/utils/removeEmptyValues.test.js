import { describe, expect, it } from 'vitest';
import { removeEmptyValues } from '@/utils/removeEmptyValues';

describe('removeEmptyValues', () => {
  it('keeps real values, including 0', () => {
    expect(removeEmptyValues({ page: 0, bloodGroup: 'A+' })).toEqual({ page: 0, bloodGroup: 'A+' });
  });

  it('drops empty strings, null and undefined', () => {
    expect(removeEmptyValues({ search: '', bloodGroup: null, size: undefined })).toEqual({});
  });
});
