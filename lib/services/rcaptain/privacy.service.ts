/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Privacy Protection
 * Module          : Privacy Service
 *
 * Author          : Prem Singh
 * Purpose         : Enforce deterministic masking and prevent
 *                   sensitive data from reaching AI providers.
 * ============================================================
 */

const MASKED_CONTACT_KEYS = new Set([
    "email", "emailAddress", "email_address",
    "primaryEmail", "alternateEmail1", "alternateEmail2",
    "salesEmail", "infoEmail",
    "mobile", "mobileNumber", "mobile_number",
    "phone", "phoneNumber", "phone_number",
    "primaryPhone", "alternatePhone", "whatsapp",
  ]);
  
  const NEVER_EXPOSE_KEYS = new Set([
    "password", "passwd", "secret", "token", "apiKey", "api_key",
    "authorization", "cookie",
    "bankAccount", "bank_account", "accountNumber", "account_number",
    "accountNo", "account_no", "iban", "swift", "swiftBic",
    "swift_bic", "ifsc", "cardNumber", "card_number", "cvv", "cvc",
    "address", "addressLine1", "addressLine2", "postalCode",
    "pincode", "pin_code",
    "gstin", "iecNumber", "iec_number", "udyamNumber", "udyam_number",
    "adCode", "ad_code", "icegateRegistrationId",
    "icegate_registration_id", "rcmcNumber", "rcmc_number",
  ]);
  
  function normalizedKey(key: string): string {
    return key.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[-\s]/g, "_").toLowerCase();
  }
  
  function isNeverExposeKey(key: string): boolean {
    if (NEVER_EXPOSE_KEYS.has(key)) return true;
    const normalized = normalizedKey(key).replace(/_/g, "");
    return [
      "password", "passwd", "secret", "token", "apikey",
      "authorization", "cookie", "bankaccount", "accountnumber",
      "accountno", "iban", "swift", "swiftbic", "ifsc",
      "cardnumber", "cvv", "cvc", "address", "postalcode",
      "pincode", "gstin", "iecnumber", "udyamnumber",
      "adcode", "icegateregistrationid", "rcmcnumber",
    ].some((part) => normalized.includes(part));
  }
  
  /**
   * Email policy: first character + *** + @domain.
   * Example: prem.singh@example.com -> p***@example.com
   */
  export function maskEmail(value: string | null | undefined): string | null {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim();
    const at = trimmed.lastIndexOf("@");
    if (at <= 0 || at === trimmed.length - 1) return "***";
    return `${trimmed.charAt(0)}***@${trimmed.slice(at + 1)}`;
  }
  
  /**
   * Mobile policy: expose only the final four digits.
   * Example: +91 9876543210 -> ******3210
   */
  export function maskMobile(value: string | null | undefined): string | null {
    if (!value || typeof value !== "string") return null;
    const digits = value.replace(/\D/g, "");
    if (!digits) return "***";
    return digits.length <= 4
      ? `****${digits}`
      : `******${digits.slice(-4)}`;
  }
  
  export function maskContactValue(
    key: string,
    value: string | null | undefined
  ): string | null {
    if (value == null) return null;
    const lower = key.toLowerCase();
    if (lower.includes("email")) return maskEmail(value);
    if (
      lower.includes("phone") ||
      lower.includes("mobile") ||
      lower.includes("whatsapp")
    ) return maskMobile(value);
    return "***";
  }
  
  /**
   * Recursively sanitize data before it becomes R-CAPTAIN AI context.
   *
   * Contact fields are masked. Secrets, financial credentials,
   * identity/compliance identifiers and addresses are removed.
   */
  export function sanitizeForAI<T>(value: T): unknown {
    return sanitizeValue(value);
  }
  
  function sanitizeValue(value: unknown, parentKey?: string): unknown {
    if (value == null) return value;
  
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      if (parentKey && isNeverExposeKey(parentKey)) {
        if (MASKED_CONTACT_KEYS.has(parentKey)) {
          return maskContactValue(parentKey, String(value));
        }
        return undefined;
      }
      return value;
    }
  
    if (Array.isArray(value)) {
      return value
        .map((item) => sanitizeValue(item, parentKey))
        .filter((item) => item !== undefined);
    }
  
    if (typeof value === "object") {
      const result: Record<string, unknown> = {};
  
      for (const [key, childValue] of Object.entries(
        value as Record<string, unknown>
      )) {
        if (MASKED_CONTACT_KEYS.has(key)) {
          const masked = maskContactValue(
            key,
            typeof childValue === "string"
              ? childValue
              : String(childValue ?? "")
          );
          if (masked !== null) result[key] = masked;
          continue;
        }
  
        if (isNeverExposeKey(key)) continue;
  
        const sanitized = sanitizeValue(childValue, key);
        if (sanitized !== undefined) result[key] = sanitized;
      }
  
      return result;
    }
  
    return undefined;
  }
  
  export function sanitizeForAIJson(value: unknown): string {
    return JSON.stringify(sanitizeForAI(value), null, 2);
  }
  