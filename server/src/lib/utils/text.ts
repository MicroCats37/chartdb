/**
 * Normalizes newlines by converting single \n to \n\n, while preserving
 * existing \n\n sequences. This ensures consistent paragraph spacing
 * across the application.
 *
 * - "text\ntext"  → "text\n\ntext"
 * - "text\n\ntext" → "text\n\ntext" (unchanged)
 * - "text\n\n\ntext" → "text\n\n\n\ntext"
 */
export function normalizeNewlines(text: string): string {
    // Replace single \n (not preceded or followed by another \n) with \n\n
    // Negative lookbehind/lookahead ensure we don't touch existing \n\n
    return text.replace(/(?<!\n)\n(?!\n)/g, '\n\n');
}
