import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';

export type DialCountryCode = CountryCode;

export interface DialCountry {
  iso: CountryCode;
  name: string;
  /** Calling code without the leading plus, for example `27` or `1`. */
  dial: string;
  flag: string;
}

/** Marketplace fallback when the browser locale has no region. */
export const MARKET_DEFAULT_COUNTRY: CountryCode = 'ZA';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const regionNames =
  typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

export function flagEmoji(iso: string): string {
  return [...iso.toUpperCase()]
    .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join('');
}

export function countryName(iso: CountryCode): string {
  return regionNames?.of(iso) || iso;
}

let countries: DialCountry[] | null = null;

export function listDialCountries(): DialCountry[] {
  if (countries) return countries;
  countries = getCountries()
    .map((iso) => ({
      iso,
      name: countryName(iso),
      dial: getCountryCallingCode(iso),
      flag: flagEmoji(iso),
    }))
    .sort((a, b) => a.name.localeCompare(b.name) || a.iso.localeCompare(b.iso));
  return countries;
}

export function findDialCountry(iso: string): DialCountry | undefined {
  const code = iso.toUpperCase();
  return listDialCountries().find((country) => country.iso === code);
}

/**
 * Turns what a person types for a country into an ISO code.
 * Accepts `IN`, `India`, `+91`, and `+91 India`. Shared calling codes such as
 * `+1` still need the country name.
 */
export function resolveCountryCode(input: string): CountryCode | null {
  const text = input.trim();
  if (!text) return null;
  const upper = text.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper) && isSupportedCountry(upper)) return upper;

  const countries = listDialCountries();
  const byName = (name: string) => countries.find((country) => country.name.toLowerCase() === name.toLowerCase());
  const exact = byName(text);
  if (exact) return exact.iso;

  const dial = text.match(/^\+?(\d{1,3})\b/);
  const remainder = text.replace(/^\+?\d{1,3}\s*/, '').trim();
  if (remainder) {
    const named = byName(remainder);
    if (named) return named.iso;
  }
  if (!dial) return null;
  const matches = countries.filter((country) => country.dial === dial[1]);
  if (matches.length === 1) return matches[0].iso;
  return null;
}

/**
 * Browser region when it is a real country in the phone metadata.
 * Otherwise the marketplace default (South Africa), which the account
 * form already uses. The selector is never locked to that default.
 */
export function detectDialCountry(): CountryCode {
  const locale = typeof navigator !== 'undefined' ? navigator.language : '';
  const region = locale.split('-')[1]?.toUpperCase() ?? '';
  if (region && isSupportedCountry(region)) return region;
  return MARKET_DEFAULT_COUNTRY;
}

export function searchCountries(query: string): DialCountry[] {
  const text = query.trim().toLowerCase();
  const dial = text.replace(/^\+/, '');
  if (!text) return listDialCountries();
  return listDialCountries().filter((country) => {
    const iso = country.iso.toLowerCase();
    return (
      country.name.toLowerCase().includes(text) ||
      iso === text ||
      iso.startsWith(text) ||
      country.dial === dial ||
      (dial.length > 0 && country.dial.startsWith(dial))
    );
  });
}

export function nationalDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatNational(country: CountryCode, value: string): string {
  const digits = nationalDigits(value);
  if (!digits) return '';
  return new AsYouType(country).input(digits);
}

/**
 * Keep the national number and the selected country in step.
 * A pasted `+` or `00` number selects the country libphonenumber detects,
 * including when several countries share one calling code.
 */
export function applyPhoneInput(
  raw: string,
  selected: CountryCode,
): { national: string; country?: CountryCode } {
  const trimmed = raw.trim();
  if (trimmed.startsWith('+') || trimmed.startsWith('00')) {
    const international = trimmed.startsWith('00') ? `+${trimmed.slice(2).trim()}` : trimmed;
    const parsed = parsePhoneNumberFromString(international);
    if (parsed?.country && parsed.nationalNumber) {
      return { country: parsed.country, national: parsed.formatNational() };
    }
    return { national: trimmed };
  }
  return { national: formatNational(selected, raw) };
}

/** Valid numbers become E.164. Invalid or empty input returns null and is not sent. */
export function toE164(input: string, country: CountryCode): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const international = trimmed.startsWith('+') || trimmed.startsWith('00');
  const parsed = international
    ? parsePhoneNumberFromString(trimmed.startsWith('00') ? `+${trimmed.slice(2)}` : trimmed)
    : parsePhoneNumberFromString(trimmed, country);
  if (!parsed?.isValid()) return null;
  return parsed.number;
}

export function isWebEmail(value: string): boolean {
  const cleaned = value.trim().toLowerCase();
  return cleaned.length <= 254 && EMAIL.test(cleaned);
}

export function prepareLogin(input: {
  method: 'mobile' | 'email' | 'whatsapp';
  phone: string;
  email: string;
  country: CountryCode;
}): { ok: true; identifier: string } | { ok: false; error: string } {
  if (input.method === 'email') {
    const email = input.email.trim().toLowerCase();
    if (!isWebEmail(email)) return { ok: false, error: 'Enter a valid email address' };
    return { ok: true, identifier: email };
  }
  const e164 = toE164(input.phone, input.country);
  if (!e164) {
    const kind = input.method === 'whatsapp' ? 'WhatsApp' : 'mobile';
    return {
      ok: false,
      error: input.phone.trim()
        ? `Enter a valid ${kind} number for ${countryName(input.country)}`
        : `Enter a ${kind.toLowerCase()} number`,
    };
  }
  return { ok: true, identifier: e164 };
}

export interface SignupDraft {
  fullName: string;
  country: CountryCode;
  mobile?: string;
  email?: string;
}

export type SignupChannel = 'email' | 'mobile';

/** Registration details, without choosing a verification channel yet. */
export function prepareSignup(input: {
  fullName: string;
  phone: string;
  email: string;
  country: CountryCode;
}): ({ ok: true } & SignupDraft) | { ok: false; error: string } {
  const name = input.fullName.trim();
  if (name.length < 2) return { ok: false, error: 'Enter your full name' };
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  if (!phone && !email) return { ok: false, error: 'Enter a mobile number or email address' };
  if (email && !isWebEmail(email)) return { ok: false, error: 'Enter a valid email address' };
  const mobile = phone ? toE164(phone, input.country) : null;
  if (phone && !mobile) {
    return { ok: false, error: `Enter a valid mobile number for ${countryName(input.country)}` };
  }
  return {
    ok: true,
    fullName: name,
    country: input.country,
    mobile: mobile ?? undefined,
    email: email || undefined,
  };
}

/**
 * Channels the person can use: they supplied the contact, and the server can send on it.
 * Email is listed first because SMS sender approval is the more common failure.
 */
export function signupChannels(
  draft: Pick<SignupDraft, 'mobile' | 'email'>,
  providers: { email: boolean; sms: boolean },
): SignupChannel[] {
  const channels: SignupChannel[] = [];
  if (draft.email && providers.email) channels.push('email');
  if (draft.mobile && providers.sms) channels.push('mobile');
  return channels;
}
