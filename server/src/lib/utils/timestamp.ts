/**
 * Converts any incoming timestamp (number, ISO string, or Date) to a Unix
 * millisecond number. Falls back to Date.now() only when value is null/undefined.
 * Handles the epoch=0 falsy bug by using null/undefined check instead of truthiness.
 */
export function ensureTimestamp(
    val: number | string | Date | null | undefined
): number {
    if (val == null) return Date.now();
    if (typeof val === 'number') return val; // already a number (includes 0)
    if (val instanceof Date) return val.getTime(); // Date object
    const ms = Date.parse(val); // ISO or parseable string
    return isNaN(ms) ? Date.now() : ms;
}

/**
 * Same as ensureTimestamp but returns a Date object.
 * Use this for Prisma DateTime columns (e.g., Diagram.createdAt).
 */
export function ensureDate(
    val: number | string | Date | null | undefined
): Date {
    return new Date(ensureTimestamp(val));
}
