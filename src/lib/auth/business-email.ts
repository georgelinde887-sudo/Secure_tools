/**
 * Business Email Validation Policy
 * Restricts Magic Link sign-in/registration to legitimate business domains.
 * Common free, temporary, and personal email providers are rejected.
 */

export const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'aim.com',
  'proton.me',
  'protonmail.com',
  'protonmail.ch',
  'zoho.com',
  'zohomail.com',
  'mail.com',
  'email.com',
  'gmx.com',
  'gmx.net',
  'yandex.com',
  'yandex.ru',
  'tutanota.com',
  'tutamail.com',
  'tuta.com',
  'fastmail.com',
  'inbox.com',
  'mailfence.com',
  'hushmail.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'throwawaymail.com',
  'sharklasers.com',
]);

/**
 * Extracts and normalizes the domain from an email address
 */
export function getEmailDomain(email: string): string {
  if (!email || !email.includes('@')) return '';
  const parts = email.trim().toLowerCase().split('@');
  return parts[parts.length - 1];
}

/**
 * Validates whether an email belongs to a business domain.
 * Rejects common personal email providers.
 */
export function isBusinessEmail(email: string): { valid: boolean; reason?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Please enter a valid email address.' };
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, reason: 'Please enter a valid email address format.' };
  }

  const domain = getEmailDomain(trimmed);
  if (!domain || domain.length < 3) {
    return { valid: false, reason: 'Invalid email domain.' };
  }

  if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: `Personal email addresses (${domain}) are not accepted for Magic Link. Please enter your work/company email address, or sign in using the "Continue with Google" button above.`,
    };
  }

  return { valid: true };
}
