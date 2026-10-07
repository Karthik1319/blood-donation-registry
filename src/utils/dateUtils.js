// Helpers for plain calendar dates in "YYYY-MM-DD" form (what the API and <input type="date"> use).
// Calculations run in UTC so daylight-saving changes can never make a day 23 or 25 hours long.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcTime(isoDate) {
  return Date.parse(`${isoDate}T00:00:00Z`);
}

/** Today's date on the user's own calendar, e.g. "2026-10-07". */
export function getTodayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Moves a date forwards (or backwards with a negative number), e.g. addDays("2026-01-30", 3). */
export function addDays(isoDate, days) {
  return new Date(toUtcTime(isoDate) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Whole days between two dates, always positive, e.g. "2026-01-01" and "2026-01-31" → 30. */
export function daysBetween(firstDate, secondDate) {
  return Math.round(Math.abs(toUtcTime(firstDate) - toUtcTime(secondDate)) / MS_PER_DAY);
}

/** True for a real calendar date such as "2026-02-28" (false for "2026-02-30"). */
export function isValidIsoDate(isoDate) {
  const time = toUtcTime(isoDate);
  return !Number.isNaN(time) && new Date(time).toISOString().startsWith(isoDate);
}
