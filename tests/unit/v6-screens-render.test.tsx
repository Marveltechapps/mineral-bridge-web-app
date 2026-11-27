/**
 * Every platform screen (Claude Design page "Mineral Bridge Web v6") renders against the controller's view model
 * without throwing, for a signed-in buyer/seller with a buy order, a sell order and the catalogue loaded.
 */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { AppShell } from '../../src/components/platform/AppShell';
import { PlatformController } from '../../src/lib/platform/controller';
import { clearCatalogue, setCategories, stages, upsertProducts } from '../../src/lib/platform/data';
import type { Product } from '../../src/types/mineralBridge';

const NOW = Date.UTC(2026, 10, 27, 10, 0);
const lot = (id: string, mineral: string, name: string, over: Partial<Product> = {}): Product =>
  ({ id, mineral, name, form: 'Bars', avail: 5, unit: 'kg', min: 1, grade: 'Au 99.5%', lab: 'SGS Lagos', cert: 'SGS-1', origin: 'Lagos · Nigeria', img: 'cat-precious', ref: 70000, ...over }) as Product;

function buyOrder(idx: number) {
  return {
    id: 'MB-ORD-1', kind: 'buy', idx, created: NOW - 864e5,
    items: [{ pid: 'G-1', qty: 2, qIn: 2, uIn: 'kg', unit: 'kg', name: 'Gold Bars' }],
    log: stages('buy').slice(0, idx + 1).map((s, i) => ({ who: 'You', text: s.label, note: '', at: NOW - (idx - i) * 36e5 })),
    quote: { no: 'Q-1', total: 140000, issued: NOW - 36e5, valid: NOW + 6 * 864e5 },
    addr: { org: 'Buyer Ltd', street: '1 Marina', city: 'Lagos', country: 'Nigeria', contact: 'Ada', mobile: '2348000000000' },
    docs: [], hold: '',
  };
}
function sellOrder(idx: number) {
  return {
    id: 'MB-SELL-1', kind: 'sell', idx, created: NOW - 5 * 864e5, items: [],
    sell: { mineral: 'gold', name: 'Gold Dust', qty: 2.8, unit: 'kg', grade: 'Au 89%', form: 'Raw', details: 'Alluvial dust', photos: 3, docs: ['Assay report'], ref: 57000 },
    log: stages('sell').slice(0, idx + 1).map((s, i) => ({ who: 'You', text: s.label, note: '', at: NOW - (idx - i) * 36e5 })),
    form: { method: 'Bank transfer', date: 'Thu 3 Dec', time: '10:00', address: 'Ilesha site 4' },
    quote: { no: 'Q-2', total: 150000, issued: NOW - 864e5, valid: NOW + 6 * 864e5 },
    company: { by: 'Inspector', at: NOW - 36e5, result: 'Quantity verified' }, sgs: { no: 'SGS-9', at: NOW - 36e5, result: 'Compliant' },
    insp: { when: 'Thu 3 Dec · 10:00' }, txn: 'TRX-1',
    ship: { id: 'SSF-1', partner: 'Sahel Secure Freight', contact: 'Musa', mode: 'Road', from: 'Ilesha', to: 'Mineral Bridge vault', pickup: '01 Dec · 10:00', status: 'In transit', events: [['Collected', NOW - 36e5]] },
    docs: [], hold: '',
  };
}

function controller(screenId: string, oid: string, orders: unknown[]) {
  const c = new PlatformController();
  c.state = {
    ...c.state, ready: true, booting: false, screen: screenId, stack: ['home'], oid,
    user: { id: 'u1', name: 'Ada Okafor', business: 'Okafor Metals', email: 'ada@example.com', phone: '+2348000000000', country: 'Nigeria', kyc: 'verified', role: 'both', buyerType: 'refinery', sellerType: 'asm' },
    orders, cat: 'precious', mineral: 'gold', pid: 'G-1', search: '',
    auctions: [], notifs: [], cart: [{ pid: 'G-1', qty: 1, qIn: 1, uIn: 'kg' }],
  };
  return c;
}

const BUY_SCREENS = ['home', 'cats', 'minerals', 'lots', 'detail', 'cart', 'checkout', 'placed', 'orders', 'order', 'quote', 'contract', 'payInsp', 'pay', 'receipt', 'chat', 'shipment', 'refund', 'refunds', 'cancel', 'doc', 'profile', 'editProfile', 'kycStatus', 'notifs', 'prefs', 'help', 'auctions', 'sellCats', 'sellForm', 'sellDone'];
const SELL_SCREENS: [string, string][] = [['sellReview', 'reviewed'], ['quote', 'quote'], ['contract', 'confirmed'], ['sellConfirm', 'contractMb'], ['sellInspect', 'sgs'], ['report', 'sgs'], ['payout', 'payout'], ['shipment', 'transit'], ['saleDone', 'done'], ['order', 'approved']];
const ONBOARDING = ['welcome', 'auth', 'otp', 'regType', 'regDetails', 'kyc', 'kycDoc', 'kycDone'];

beforeAll(() => {
  jest.spyOn(Date, 'now').mockReturnValue(NOW);
  clearCatalogue();
  setCategories([{ id: 'precious', name: 'Precious metals', img: 'cat-precious', minerals: [['gold', 'Gold'], ['silver', 'Silver']] }, { id: 'base', name: 'Base metals', img: 'cat-industrial', minerals: [['copper', 'Copper']] }]);
  upsertProducts([lot('G-1', 'gold', 'Gold Bars'), lot('S-1', 'silver', 'Silver Bars', { lab: '' }), lot('C-4012', 'copper', 'Copper Cathode', { img: 'cat-industrial' })]);
});
afterAll(() => { jest.restoreAllMocks(); clearCatalogue(); });
afterEach(cleanup);

describe('v6 screens render', () => {
  it.each(BUY_SCREENS)('buy flow: %s', (id) => {
    const c = controller(id, 'MB-ORD-1', [buyOrder(5), sellOrder(3)]);
    const vm = c.renderVals();
    render(<AppShell vm={vm} />);
    expect(vm.is[id] ?? true).toBeTruthy();
  });

  it.each(SELL_SCREENS)('sell journey: %s', (id, stageKey) => {
    const idx = stages('sell').findIndex(s => s.key === stageKey);
    const c = controller(id, 'MB-SELL-1', [sellOrder(idx)]);
    const vm = c.renderVals();
    render(<AppShell vm={vm} />);
    expect(vm.is[id]).toBe(true);
    if (id !== 'order') expect(vm.sx.on).toBe(true);
  });

  it.each(ONBOARDING)('onboarding: %s', (id) => {
    const c = controller(id, '', []);
    c.state = { ...c.state, user: null };
    render(<AppShell vm={c.renderVals()} />);
  });

  it('header, account menu and footer use the v6 shell', () => {
    const c = controller('profile', '', []);
    const vm = c.renderVals();
    render(<AppShell vm={vm} />);
    expect(vm.web.acct).toBe(true);
    expect(screen.getByRole('navigation', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mineral Bridge home' })).toBeInTheDocument();
    expect(screen.getAllByText('Mineral Bridge Trading Promise').length).toBe(1);
  });

  it('a lot with only a category image shows its mineral photo', () => {
    const c = controller('lots', '', []);
    c.state = { ...c.state, mineral: 'copper' };
    const vm = c.renderVals();
    expect(vm.lots[0].img).toContain('/assets/minerals/copper-cathode.jpg');
  });
});
