/**
 * Convert tinybars to HBAR (1 HBAR = 100,000,000 tinybars)
 * @param tinybars - Amount in tinybars
 * @returns Amount in HBAR
 */
export function tinybarsToHbar(tinybars: number): number {
  return tinybars / 100_000_000;
}

/**
 * Convert HBAR to tinybars
 * @param hbar - Amount in HBAR
 * @returns Amount in tinybars
 */
export function hbarToTinybars(hbar: number): number {
  return Math.round(hbar * 100_000_000);
}

/**
 * Format HBAR for display
 * @param tinybars - Amount in tinybars
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted string with HBAR symbol
 */
export function formatHbar(tinybars: number, decimals = 4): string {
  return `${tinybarsToHbar(tinybars).toFixed(decimals)} ℏ`;
}

/**
 * Decode base64 string to UTF-8 text (safe — returns original if decode fails)
 * @param encoded - Base64 encoded string
 * @returns Decoded UTF-8 text or original string if decode fails
 */
export function decodeBase64(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return encoded;
  }
}

/**
 * Encode string to base64
 * @param text - Text to encode
 * @returns Base64 encoded string
 */
export function encodeBase64(text: string): string {
  return btoa(text);
}

/**
 * Shorten an account ID for display: "0.0.12345678" → "0.0.1234…5678"
 * @param accountId - Full account ID
 * @param chars - Number of characters to show on each side (default: 4)
 * @returns Shortened account ID
 */
export function shortenAccountId(accountId: string, chars = 4): string {
  if (accountId.length <= chars * 2 + 3) return accountId;
  const parts = accountId.split(".");
  const last = parts[parts.length - 1];
  if (last.length <= chars * 2) return accountId;
  return `${parts.slice(0, -1).join(".")}.${last.slice(0, chars)}…${last.slice(-chars)}`;
}

/**
 * Format consensus timestamp (seconds.nanos) to JS Date
 * @param timestamp - Consensus timestamp string (e.g., "1234567890.123456789")
 * @returns JavaScript Date object
 */
export function consensusTimestampToDate(timestamp: string): Date {
  const [seconds] = timestamp.split(".");
  return new Date(parseInt(seconds, 10) * 1000);
}
