/**
 * Utility functions for formatting and parsing Indonesian Rupiah (IDR)
 */

export function formatIDR(
  amount: number | null | undefined,
  options: {
    showSign?: boolean;
    showPrefix?: boolean;
    spaceAfterPrefix?: boolean;
  } = {}
): string {
  const { showSign = false, showPrefix = true, spaceAfterPrefix = false } = options;
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showPrefix ? (spaceAfterPrefix ? "Rp 0" : "Rp0") : "0";
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  
  // Format with thousand separator dot
  const formattedNumber = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  let prefix = "";
  if (showPrefix) {
    prefix = spaceAfterPrefix ? "Rp " : "Rp";
  }

  if (showSign) {
    if (amount > 0) {
      return `+${prefix}${formattedNumber}`;
    } else if (amount < 0) {
      return `-${prefix}${formattedNumber}`;
    }
  }

  return isNegative ? `-${prefix}${formattedNumber}` : `${prefix}${formattedNumber}`;
}

/**
 * Parses natural Indonesian currency strings like "25rb", "5jt", "1.250.000", "50k"
 */
export function parseIDRString(input: string): number | null {
  if (!input) return null;
  const clean = input.toLowerCase().trim().replace(/rp|\s+/g, "");

  // Match suffixes
  if (clean.endsWith("jt") || clean.endsWith("juta")) {
    const num = parseFloat(clean.replace(/jt|juta/g, "").replace(",", "."));
    return isNaN(num) ? null : Math.round(num * 1_000_000);
  }
  if (clean.endsWith("rb") || clean.endsWith("ribu") || clean.endsWith("k")) {
    const num = parseFloat(clean.replace(/rb|ribu|k/g, "").replace(",", "."));
    return isNaN(num) ? null : Math.round(num * 1_000);
  }

  // Raw number with dots or commas
  const sanitized = clean.replace(/\./g, "").replace(/,/g, ".");
  const val = parseFloat(sanitized);
  return isNaN(val) ? null : Math.round(val);
}
