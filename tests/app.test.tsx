import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { renderApp } from './render';

/**
 * Complete the one-time-code sign-in. Logging in (as opposed to signing up)
 * keeps the user on the current screen, so this resolves once the header
 * switches to the signed-in account control.
 */
async function signIn(user: UserEvent) {
  await user.click(screen.getAllByRole('button', { name: 'Sign in' })[0]);
  await user.click(screen.getByRole('button', { name: 'Send verification code' }));
  await user.click(screen.getByRole('button', { name: 'Verify & continue' }));
  await screen.findByRole('button', { name: /Marvel$/ }, { timeout: 4000 });
}

describe('navigation', () => {
  it('renders the home screen at the root URL', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fair price. Safety.');
    expect(screen.getByRole('heading', { name: 'Shop by category' })).toBeInTheDocument();
  });

  it('deep-links straight to an inner screen', () => {
    renderApp('/trade/letter-of-credit');
    expect(screen.getByRole('heading', { name: 'LC Workspace' })).toBeInTheDocument();
  });

  it('moves between screens from the primary navigation', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Auctions' }));
    expect(screen.getByRole('heading', { name: 'Auctions' })).toBeInTheDocument();
    expect(screen.getByText('Bid on assured lots released from our vault.')).toBeInTheDocument();
  });

  it('falls back to home for an unknown URL', () => {
    renderApp('/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Shop by category' })).toBeInTheDocument();
  });
});

describe('catalog filtering', () => {
  it('narrows the lot list when a category filter is applied', async () => {
    const { user } = renderApp('/buy');
    expect(screen.getByText('8 assured lots · owned inventory, ready to ship')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Gemstones/ }));
    expect(screen.getByText('2 assured lots · owned inventory, ready to ship')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gemstones' })).toBeInTheDocument();
  });

  it('shows the empty state and recovers via Reset filters', async () => {
    const { user } = renderApp('/buy');
    await user.click(screen.getByRole('button', { name: /Gemstones/ }));
    await user.click(screen.getByRole('button', { name: /Grade A/ }));
    expect(screen.getByText('No lots match those filters')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(screen.getByText('8 assured lots · owned inventory, ready to ship')).toBeInTheDocument();
  });

  it('reorders lots by price', async () => {
    const { user } = renderApp('/buy');
    await user.selectOptions(screen.getByLabelText('Sort lots'), 'low');
    const headings = screen.getAllByText(/^(High-Purity Quartz|Gold Concentrate)$/);
    expect(headings[0]).toHaveTextContent('High-Purity Quartz');
  });
});

describe('sell wizard', () => {
  it('asks an anonymous visitor to sign in before anything else', async () => {
    const { user } = renderApp('/sell');
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
  });

  it('blocks a signed-in seller until a mineral and quantity are given', async () => {
    const { user } = renderApp('/sell');
    await signIn(user);

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('A few details missing')).toBeInTheDocument();
    expect(screen.getByText(/mineral name and a quantity greater than zero/)).toBeInTheDocument();
  });

  it('advances to the location step once the details are complete', async () => {
    const { user } = renderApp('/sell');
    await signIn(user);
    await user.selectOptions(screen.getByLabelText('Mineral'), 'Gold Concentrate');
    await user.type(screen.getByLabelText('Estimated quantity'), '500');

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your location' })).toBeInTheDocument();
  });
});

describe('verification gating', () => {
  it('requires sign-in before a purchase can be completed', async () => {
    const { user } = renderApp('/product');
    await user.click(screen.getByRole('button', { name: 'Buy Now' }));
    // The sign-in overlay opens rather than the order being placed.
    expect(screen.getByRole('dialog', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('asks an unverified signed-in user to complete KYC before bidding', async () => {
    const { user } = renderApp('/auctions/detail');
    await signIn(user);
    await user.click(screen.getByRole('button', { name: 'Place bid' }));

    expect(screen.getByText('Verification required')).toBeInTheDocument();
    expect(screen.getByText(/we verify identity before you can place a bid/)).toBeInTheDocument();
  });
});

describe('product purchase panel', () => {
  it('recalculates the estimate as the quantity changes', async () => {
    const { user } = renderApp('/product');
    expect(screen.getByText('$24,100.00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByText('$26,510.00')).toBeInTheDocument();
    expect(screen.getByText('$265.10')).toBeInTheDocument();
  });

  it('reveals the Bitcoin notice when that settlement method is chosen', async () => {
    const { user } = renderApp('/product');
    await user.click(screen.getByRole('button', { name: /Bitcoin \(BTC\)/ }));
    expect(screen.getByText(/Bitcoin settlement is available in supported countries only/)).toBeInTheDocument();
  });
});

describe('negotiation room', () => {
  it('locks terms when an open offer is accepted', async () => {
    const { user } = renderApp('/trade/negotiation');
    expect(screen.getByText('IN NEGOTIATION')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Accept' }));
    expect(screen.getByText('TERMS AGREED')).toBeInTheDocument();
    expect(
      screen.getByText('Offer accepted — terms locked. A draft contract is ready.'),
    ).toBeInTheDocument();
  });

  it('sends a typed message into the thread', async () => {
    const { user } = renderApp('/trade/negotiation');
    await user.type(screen.getByLabelText('Message'), 'Please confirm the assay date.');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('Please confirm the assay date.')).toBeInTheDocument();
  });
});

describe('letter of credit', () => {
  it('reports the missing documents when the pre-check runs', async () => {
    const { user } = renderApp('/trade/letter-of-credit');
    await user.click(screen.getByRole('button', { name: 'Pre-check documents' }));

    expect(screen.getByText('3 discrepancies found')).toBeInTheDocument();
    expect(screen.getByText('Assay certificate not presented')).toBeInTheDocument();
  });

  it('clears the discrepancies once every document is uploaded', async () => {
    const { user } = renderApp('/trade/letter-of-credit');
    // Three documents start un-presented; upload each in turn.
    for (let i = 0; i < 3; i += 1) {
      const uploads = screen.getAllByRole('button', { name: 'Upload' });
      await user.click(uploads[0]);
    }
    await user.click(screen.getByRole('button', { name: 'Pre-check documents' }));
    expect(screen.getByText('Compliant presentation')).toBeInTheDocument();
  });

  it('flags a bill of lading dated after the latest shipment date', async () => {
    const { user } = renderApp('/trade/letter-of-credit');
    await user.click(screen.getByRole('button', { name: '18 Oct 2026' }));
    await user.click(screen.getByRole('button', { name: 'Pre-check documents' }));
    expect(screen.getByText(/on-board date \(18 Oct 2026\) is after the latest shipment date/)).toBeInTheDocument();
  });
});

describe('contract builder', () => {
  it('keeps signing disabled until the mandatory terms are set', async () => {
    const { user } = renderApp('/trade/contract');
    const sign = screen.getByRole('button', { name: 'Sign contract' });
    expect(sign).toBeEnabled();

    await user.clear(screen.getByLabelText('Named port or place'));
    expect(screen.getByRole('button', { name: 'Sign contract' })).toBeDisabled();
    expect(
      screen.getByText('Add price, quantity, port, shipment window and issuing bank to sign.'),
    ).toBeInTheDocument();
  });

  it('updates the live preview as the terms change', async () => {
    const { user } = renderApp('/trade/contract');
    expect(screen.getByText('$181,720.00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'FOB' }));
    expect(
      screen.getByText('Free On Board — risk passes to the buyer once goods are loaded on the vessel.'),
    ).toBeInTheDocument();
  });
});

describe('account', () => {
  it('switches between the account panels', async () => {
    const { user } = renderApp('/account');
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Payout methods' }));
    expect(screen.getByRole('heading', { name: 'Payout methods' })).toBeInTheDocument();
    expect(screen.getByText('Smart-contract secured · USDC')).toBeInTheDocument();
  });

  it('toggles a security preference', async () => {
    const { user } = renderApp('/account');
    await user.click(screen.getByRole('button', { name: 'Security' }));
    const ledger = screen.getByRole('switch', { name: 'Ledger visibility' });
    expect(ledger).toHaveAttribute('aria-checked', 'false');

    await user.click(ledger);
    expect(screen.getByRole('switch', { name: 'Ledger visibility' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});

describe('identity verification', () => {
  it('will not continue past document capture until both sides are taken', async () => {
    const { user } = renderApp('/kyc');
    await user.click(screen.getByRole('button', { name: 'Start verification' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Upload your national id card')).toBeInTheDocument();

    const blocked = screen.getByRole('button', { name: 'Capture both sides' });
    expect(blocked).toBeDisabled();

    const capture = screen.getByText('Both sides, in focus, all four corners visible.')
      .parentElement!;
    await user.click(within(capture).getByRole('button', { name: /^Front/ }));
    await user.click(within(capture).getByRole('button', { name: /^Back/ }));
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
  });

  it('asks for a passport photo page only', async () => {
    const { user } = renderApp('/kyc');
    await user.click(screen.getByRole('button', { name: 'Start verification' }));
    await user.click(screen.getByRole('button', { name: /Passport/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Upload your passport')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Photo page/ })).toBeInTheDocument();
  });
});
