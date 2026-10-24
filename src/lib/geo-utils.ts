// Helper utility for country resolution, ISO codes, and flag emojis

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRY_LOOKUP: Record<string, CountryInfo> = {
  US: { code: 'US', name: 'United States', flag: '🇺🇸' },
  GB: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  DE: { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  IN: { code: 'IN', name: 'India', flag: '🇮🇳' },
  CA: { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  FR: { code: 'FR', name: 'France', flag: '🇫🇷' },
  AU: { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  NL: { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  SG: { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  JP: { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  BR: { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  SE: { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  CH: { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  ES: { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  IT: { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  IE: { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  IL: { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  KR: { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  AE: { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  SA: { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  PL: { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  NZ: { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  DK: { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  NO: { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  FI: { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  AT: { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  BE: { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  MX: { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  ID: { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  MY: { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  LK: { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  BD: { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  PK: { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  NP: { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  TH: { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  PH: { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  VN: { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  ZA: { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  EG: { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  NG: { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  KE: { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
};

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  // South Asia
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Colombo': 'LK',
  'Asia/Dhaka': 'BD',
  'Asia/Karachi': 'PK',
  'Asia/Kathmandu': 'NP',

  // Middle East
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Qatar': 'QA',
  'Asia/Muscat': 'OM',
  'Asia/Kuwait': 'KW',
  'Asia/Bahrain': 'BH',

  // East & Southeast Asia
  'Asia/Singapore': 'SG',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Hong_Kong': 'HK',
  'Asia/Shanghai': 'CN',
  'Asia/Taipei': 'TW',
  'Asia/Bangkok': 'TH',
  'Asia/Jakarta': 'ID',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Manila': 'PH',
  'Asia/Ho_Chi_Minh': 'VN',

  // Europe
  'Europe/London': 'GB',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Vienna': 'AT',
  'Europe/Zurich': 'CH',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK',
  'Europe/Helsinki': 'FI',
  'Europe/Dublin': 'IE',
  'Europe/Warsaw': 'PL',

  // North America
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Montreal': 'CA',
  'America/Mexico_City': 'MX',

  // Australia / NZ
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
  'Pacific/Auckland': 'NZ',

  // South America & Africa
  'America/Sao_Paulo': 'BR',
  'America/Buenos_Aires': 'AR',
  'Africa/Johannesburg': 'ZA',
  'Africa/Cairo': 'EG',
  'Africa/Lagos': 'NG',
  'Africa/Nairobi': 'KE',
};

/**
 * Resolves country ISO-2 code from timezone string (e.g. 'Asia/Kolkata' -> 'IN')
 */
export function resolveCountryFromTimezone(tz?: string | null): string | null {
  if (!tz) return null;
  const clean = tz.trim();
  if (TIMEZONE_TO_COUNTRY[clean]) {
    return TIMEZONE_TO_COUNTRY[clean];
  }
  for (const [key, code] of Object.entries(TIMEZONE_TO_COUNTRY)) {
    if (key.toLowerCase() === clean.toLowerCase()) {
      return code;
    }
  }
  return null;
}

/**
 * Resolves country ISO-2 code from browser locale string (e.g. 'en-IN' -> 'IN')
 */
export function resolveCountryFromLocale(locale?: string | null): string | null {
  if (!locale) return null;
  const parts = locale.trim().split(/[-_]/);
  if (parts.length >= 2 && parts[1].length === 2) {
    return parts[1].toUpperCase();
  }
  return null;
}

/**
 * Converts a 2-letter ISO country code into a unicode flag emoji.
 */
export function isoToEmojiFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const upper = countryCode.toUpperCase();
  const codePoints = [...upper].map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Resolves country code, full country name, and flag emoji from code or name.
 */
export function resolveCountryInfo(input: string): CountryInfo {
  if (!input || typeof input !== 'string') {
    return { code: 'OTHER', name: 'Other Regions', flag: '🌐' };
  }

  const clean = input.trim();
  const upper = clean.toUpperCase();

  // 1. Direct match on 2-letter ISO code
  if (COUNTRY_LOOKUP[upper]) {
    return COUNTRY_LOOKUP[upper];
  }

  // 2. Direct match on country name
  for (const info of Object.values(COUNTRY_LOOKUP)) {
    if (info.name.toUpperCase() === upper) {
      return info;
    }
  }

  // 3. Partial match on country name
  for (const info of Object.values(COUNTRY_LOOKUP)) {
    if (info.name.toUpperCase().includes(upper) || upper.includes(info.name.toUpperCase())) {
      return info;
    }
  }

  // 4. Valid 2-letter ISO code not in lookup
  if (/^[A-Z]{2}$/.test(upper)) {
    return {
      code: upper,
      name: clean,
      flag: isoToEmojiFlag(upper),
    };
  }

  // Fallback
  return {
    code: 'OTHER',
    name: clean || 'Other Regions',
    flag: '🌐',
  };
}
