import { describe, expect, it } from 'vitest';
import { formatAuthError } from '@/features/auth/services/authService';
import {
  applyPhoneInput,
  detectDialCountry,
  formatNational,
  listDialCountries,
  nationalDigits,
  prepareLogin,
  prepareSignup,
  resolveCountryCode,
  searchCountries,
  signupChannels,
  toE164,
} from '@/features/auth/phone';

describe('country text', () => {
  it('accepts a name, a code, or a calling-code prefix', () => {
    expect(resolveCountryCode('IN')).toBe('IN');
    expect(resolveCountryCode('India')).toBe('IN');
    expect(resolveCountryCode('+91 India')).toBe('IN');
    expect(resolveCountryCode('+91')).toBe('IN');
    expect(resolveCountryCode('GH')).toBe('GH');
    expect(resolveCountryCode('+1')).toBeNull();
    expect(resolveCountryCode('')).toBeNull();
  });
});

describe('international phone numbers', () => {
  it('normalizes a national number with the selected country, not a fixed +27', () => {
    expect(toE164('98765 43210', 'IN')).toBe('+919876543210');
    expect(toE164('082 123 4567', 'ZA')).toBe('+27821234567');
    expect(toE164('82 123 4567', 'IN')).toBeNull();
  });

  it('rejects an empty or impossible number', () => {
    expect(toE164('', 'ZA')).toBeNull();
    expect(toE164('123', 'US')).toBeNull();
    expect(prepareLogin({ method: 'mobile', phone: '', email: '', country: 'ZA' })).toEqual({
      ok: false,
      error: 'Enter a mobile number',
    });
  });

  it('does not add the calling code twice', () => {
    expect(toE164('+919876543210', 'ZA')).toBe('+919876543210');
    expect(toE164('+27 82 123 4567', 'IN')).toBe('+27821234567');
  });

  it('parses a pasted international number and moves the country selector', () => {
    expect(applyPhoneInput('+1', 'ZA').country).toBeUndefined();
    const india = applyPhoneInput('00 91 98765 43210', 'ZA');
    expect(india.country).toBe('IN');
    expect(toE164(india.national, india.country ?? 'ZA')).toBe('+919876543210');
    const states = applyPhoneInput('+1 415 555 2671', 'ZA');
    expect(states.country).toBe('US');
    expect(states.national.replace(/\D/g, '')).toBe('4155552671');
  });

  it('keeps the United States and Canada as separate countries that share +1', () => {
    const matches = searchCountries('1');
    const us = matches.find((country) => country.iso === 'US');
    const ca = matches.find((country) => country.iso === 'CA');
    expect(us?.dial).toBe('1');
    expect(ca?.dial).toBe('1');
    expect(us?.iso).not.toBe(ca?.iso);
    expect(toE164('415 555 2671', 'US')).toBe('+14155552671');
    expect(toE164('604 555 0123', 'CA')).not.toBe(toE164('415 555 2671', 'US'));
  });

  it('searches by country name and ISO code', () => {
    expect(searchCountries('India').some((country) => country.iso === 'IN')).toBe(true);
    expect(searchCountries('ng').some((country) => country.iso === 'NG')).toBe(true);
    expect(searchCountries('+234').some((country) => country.iso === 'NG')).toBe(true);
  });

  it('does not drop digits when the country changes', () => {
    const formatted = formatNational('IN', '9876543210');
    expect(nationalDigits(formatNational('US', nationalDigits(formatted)))).toBe('9876543210');
  });

  it('lists every country in the phone metadata', () => {
    expect(listDialCountries().length).toBeGreaterThan(200);
    expect(listDialCountries().every((country) => country.flag && country.dial && country.name)).toBe(true);
  });

  it('falls back to South Africa only when the locale has no supported region', () => {
    const original = navigator.language;
    Object.defineProperty(navigator, 'language', { configurable: true, value: 'en' });
    expect(detectDialCountry()).toBe('ZA');
    Object.defineProperty(navigator, 'language', { configurable: true, value: 'en-IN' });
    expect(detectDialCountry()).toBe('IN');
    Object.defineProperty(navigator, 'language', { configurable: true, value: original });
  });

  it('sends login email and phone on their own channels', () => {
    expect(prepareLogin({ method: 'email', phone: '9876543210', email: 'ada@example.com', country: 'IN' })).toEqual({
      ok: true,
      identifier: 'ada@example.com',
    });
    expect(prepareLogin({ method: 'whatsapp', phone: '98765 43210', email: 'ada@example.com', country: 'IN' })).toEqual({
      ok: true,
      identifier: '+919876543210',
    });
    expect(prepareLogin({ method: 'email', phone: '', email: 'not-an-email', country: 'ZA' }).ok).toBe(false);
  });

  it('keeps registration details until a verification method is chosen', () => {
    const draft = prepareSignup({
      fullName: 'Ada Lovelace',
      phone: '98765 43210',
      email: 'ada@example.com',
      country: 'IN',
    });
    expect(draft).toEqual({
      ok: true,
      fullName: 'Ada Lovelace',
      mobile: '+919876543210',
      email: 'ada@example.com',
      country: 'IN',
    });
    expect(signupChannels({ mobile: '+919876543210', email: 'ada@example.com' }, { email: true, sms: true })).toEqual([
      'email',
      'mobile',
    ]);
    expect(signupChannels({ email: 'ada@example.com' }, { email: true, sms: false })).toEqual(['email']);
    expect(signupChannels({ mobile: '+27821234567' }, { email: false, sms: false })).toEqual([]);
    expect(prepareSignup({ fullName: 'A', phone: '', email: 'ada@example.com', country: 'ZA' })).toEqual({
      ok: false,
      error: 'Enter your full name',
    });
  });

  it('prefers a field message over a generic validation failure', () => {
    const error = Object.assign(new Error('Validation failed'), {
      fields: { mobile: 'Enter a valid mobile number with country code' },
    });
    expect(formatAuthError(error, 'Could not send the code')).toBe(
      'Enter a valid mobile number with country code',
    );
  });
});
