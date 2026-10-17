import { describe, expect, it } from 'vitest';
import { formatAuthError, toWebPhone } from '@/features/auth/services/authService';

describe('web phone numbers', () => {
  it('adds the +27 prefix shown beside the field', () => {
    expect(toWebPhone('82 000 0000')).toBe('+27820000000');
    expect(toWebPhone('0820000000')).toBe('+27820000000');
    expect(toWebPhone('+2348024419087')).toBe('+2348024419087');
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
