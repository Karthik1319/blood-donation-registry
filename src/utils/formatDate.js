import { APP_CONFIG } from '@/constants/config';

const dateFormatter = new Intl.DateTimeFormat(APP_CONFIG.DATE_LOCALE, {
  dateStyle: 'medium',
  // API dates are plain "YYYY-MM-DD"; UTC stops them shifting a day in other time zones.
  timeZone: 'UTC',
});

/** Turns "2026-03-15" into "15 Mar 2026". */
export function formatDate(isoDate) {
  return dateFormatter.format(new Date(isoDate));
}
