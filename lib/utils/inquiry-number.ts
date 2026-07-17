/**
 * Generates a human-readable inquiry number.
 *
 * Format:
 * RQ-YYYYMMDD-XXXXXX
 *
 * Example:
 * RQ-20260717-8X4K2M
 */

export function generateInquiryNumber(id: string): string {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
  
    const date = `${year}${month}${day}`;
  
    const suffix = id
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-6)
      .toUpperCase();
  
    return `RQ-${date}-${suffix}`;
  }