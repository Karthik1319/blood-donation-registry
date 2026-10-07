import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, getTodayIsoDate, isValidIsoDate } from '@/utils/dateUtils';

describe('dateUtils', () => {
  it('adds days across month and year ends', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('counts whole days in either order', () => {
    expect(daysBetween('2026-01-01', '2026-01-31')).toBe(30);
    expect(daysBetween('2026-01-31', '2026-01-01')).toBe(30);
  });

  it('rejects dates that do not exist', () => {
    expect(isValidIsoDate('2026-02-28')).toBe(true);
    expect(isValidIsoDate('2026-02-30')).toBe(false);
    expect(isValidIsoDate('not-a-date')).toBe(false);
  });

  it('returns today as YYYY-MM-DD', () => {
    expect(getTodayIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
