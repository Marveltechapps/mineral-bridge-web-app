/**
 * BUG-005: product document download must save a file, not only open a tab.
 */
import { Remote } from '../../src/lib/platform/remote';
import * as catalogueSvc from '../../src/services/catalogue.service';

jest.mock('../../src/services/catalogue.service');

const catalogue = catalogueSvc as jest.Mocked<typeof catalogueSvc>;

describe('BUG-005: openProductDocument download', () => {
  const origCreateElement = document.createElement.bind(document);

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['pdf-bytes'], { type: 'application/pdf' })),
    }) as jest.Mock;
    jest.spyOn(window, 'open').mockReturnValue({ location: { href: '' }, opener: null, close: jest.fn() } as unknown as Window);
    URL.createObjectURL = jest.fn(() => 'blob:mock');
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    document.createElement = origCreateElement;
  });

  it('BUG-005: download=true fetches blob and triggers anchor download', async () => {
    catalogue.getProductDocument.mockResolvedValue({
      type: 'lot_test_report',
      number: 'SGS-1',
      name: 'sgs-report.pdf',
      contentType: 'application/pdf',
      available: true,
      url: 'https://files.example.com/sgs-report.pdf',
      expiresAt: null,
    });

    const clicks: HTMLAnchorElement[] = [];
    document.createElement = ((tag: string) => {
      const el = origCreateElement(tag);
      if (tag === 'a') {
        const a = el as HTMLAnchorElement;
        a.click = jest.fn(() => clicks.push(a));
        return a;
      }
      return el;
    }) as typeof document.createElement;

    const host = {
      flash: jest.fn(),
      setState: jest.fn(),
      state: {},
      fail: jest.fn(),
      run: async (_k: string, fn: () => Promise<unknown>) => fn(),
      st: { user: null },
    } as unknown as ConstructorParameters<typeof Remote>[0];
    const remote = new Remote(host);

    const result = await remote.openProductDocument('REF-1', 'lot_test_report', true);
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('https://files.example.com/sgs-report.pdf');
    expect(clicks[0]?.download).toBe('sgs-report.pdf');
  });

  it('BUG-005 neighbouring: view mode still uses a signed URL', async () => {
    catalogue.getProductDocument.mockResolvedValue({
      type: 'lot_test_report',
      number: 'SGS-1',
      name: 'sgs-report.pdf',
      contentType: 'application/pdf',
      available: true,
      url: 'https://files.example.com/sgs-report.pdf',
      expiresAt: null,
    });
    const open = jest.spyOn(window, 'open').mockReturnValue({ location: { href: '' }, opener: null, close: jest.fn() } as unknown as Window);

    const host = {
      s: { flash: jest.fn(), setState: jest.fn(), state: {} },
      fail: jest.fn(),
      run: async (_k: string, fn: () => Promise<unknown>) => fn(),
      st: { user: null },
    } as unknown as ConstructorParameters<typeof Remote>[0];
    const remote = new Remote(host);

    await remote.openProductDocument('REF-1', 'lot_test_report', false);
    expect(open).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    open.mockRestore();
  });
});