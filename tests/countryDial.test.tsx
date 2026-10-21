import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CountryDialField } from '@/features/auth/components/CountryDialField';
import type { DialCountryCode } from '@/features/auth/phone';

function Harness({ initial = 'ZA' as DialCountryCode }) {
  const [country, setCountry] = useState<DialCountryCode>(initial);
  return <CountryDialField country={country} onChange={setCountry} />;
}

describe('country calling-code selector', () => {
  it('opens, searches, and updates the displayed calling code', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole('button', { name: /South Africa, \+27/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /South Africa, \+27/ }));
    await user.type(screen.getByRole('searchbox', { name: 'Search countries' }), 'India');
    await user.click(screen.getByRole('option', { name: (name) => name.includes('India') && name.includes('+91') }));
    expect(screen.getByRole('button', { name: /India, \+91/ })).toBeInTheDocument();
  });

  it('can select Canada when the United States shares +1', async () => {
    const user = userEvent.setup();
    render(<Harness initial="US" />);
    await user.click(screen.getByRole('button', { name: /United States, \+1/ }));
    await user.type(screen.getByRole('searchbox', { name: 'Search countries' }), 'Canada');
    await user.click(screen.getByRole('option', { name: /Canada/ }));
    expect(screen.getByRole('button', { name: /Canada, \+1/ })).toBeInTheDocument();
  });

  it('selects a country from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: /South Africa, \+27/ }));
    const search = screen.getByRole('searchbox', { name: 'Search countries' });
    await user.type(search, 'Nigeria');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /Nigeria, \+234/ })).toBeInTheDocument();
  });
});
