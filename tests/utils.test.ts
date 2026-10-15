import { describe, expect, it } from 'vitest';
import { css } from '@/utils/css';
import { formatDate, money, num } from '@/utils/format';
import { stageIndexFor, stageLabelFor } from '@/constants/catalog';

describe('css()', () => {
  it('converts kebab-case declarations to a React style object', () => {
    expect(css('font-size:13px; font-weight:800; color:#141a2e;')).toEqual({
      fontSize: '13px',
      fontWeight: '800',
      color: '#141a2e',
    });
  });

  it('keeps gradients and url() values intact despite their inner punctuation', () => {
    const grad =
      'background:url("https://example.org/a;b.jpg?width=1200") center/cover, linear-gradient(140deg,#f3d27a,#b8860b); height:142px;';
    expect(css(grad)).toEqual({
      background:
        'url("https://example.org/a;b.jpg?width=1200") center/cover, linear-gradient(140deg,#f3d27a,#b8860b)',
      height: '142px',
    });
  });

  it('maps vendor-prefixed properties to their React spelling', () => {
    expect(css('-webkit-appearance:none; appearance:none;')).toEqual({
      WebkitAppearance: 'none',
      appearance: 'none',
    });
  });

  it('ignores empty input and malformed fragments', () => {
    expect(css('')).toEqual({});
    expect(css(undefined)).toEqual({});
    expect(css('color:#fff; nonsense; ;')).toEqual({ color: '#fff' });
  });
});

describe('formatting helpers', () => {
  it('formats money the way the design does', () => {
    expect(money(2410)).toBe('$2,410.00');
    expect(money(0)).toBe('$0.00');
  });

  it('formats ISO dates as day-month-year', () => {
    expect(formatDate('2026-10-15')).toBe('15 Oct 2026');
    expect(formatDate('')).toBe('—');
  });

  it('strips currency formatting back to a number', () => {
    expect(num('$2,410')).toBe(2410);
    expect(num('$0.90')).toBe(0.9);
  });
});

describe('pipeline stages', () => {
  it('maps a progress percentage onto the matching stage', () => {
    expect(stageIndexFor('BUY', '33%')).toBe(1);
    expect(stageLabelFor('BUY', '33%')).toBe('Third-party verification');
    expect(stageLabelFor('BUY', '100%')).toBe('Order complete');
  });

  it('uses the sell pipeline for sell-side orders', () => {
    expect(stageLabelFor('SELL', '66%')).toBe('Received by Mineral Bridge');
  });
});
