/**
 * Timezone-safe date utilities for stock register.
 * All dates are stored as YYYY-MM-DD strings and handled without timezone conversion.
 */

/**
 * Format a date as YYYY-MM-DD from year, month, day components (no timezone conversion)
 */
export function formatYMD(year: number, month: number, day: number): string {
  const yyyy = year.toString().padStart(4, '0');
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Parse a YYYY-MM-DD string into year, month, day components (no Date object parsing)
 */
export function parseYMD(dateString: string): { year: number; month: number; day: number } {
  const parts = dateString.split('-');
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2], 10),
  };
}

/**
 * Compare two YYYY-MM-DD date strings for sorting (returns -1, 0, or 1)
 */
export function compareDateStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

/**
 * Check if a YYYY-MM-DD date string matches the given year and month
 */
export function matchesYearMonth(dateString: string, year: number, month: number): boolean {
  const parsed = parseYMD(dateString);
  return parsed.year === year && parsed.month === month;
}

/**
 * Check if a YYYY-MM-DD date string matches the given year, month, and day
 */
export function matchesYearMonthDay(dateString: string, year: number, month: number, day: number): boolean {
  const parsed = parseYMD(dateString);
  return parsed.year === year && parsed.month === month && parsed.day === day;
}

/**
 * Create a local Date object from parsed year, month, day for display purposes only
 * (avoids timezone issues when constructing from components)
 */
export function createLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

/**
 * Format a YYYY-MM-DD string for display using locale formatting
 */
export function formatDateForDisplay(dateString: string): string {
  const { year, month, day } = parseYMD(dateString);
  const date = createLocalDate(year, month, day);
  return date.toLocaleDateString();
}

/**
 * Get the number of days in a given month (handles leap years correctly)
 */
export function getDaysInMonth(year: number, month: number): number {
  // Create date for the 0th day of the next month (which is the last day of the current month)
  return new Date(year, month, 0).getDate();
}
