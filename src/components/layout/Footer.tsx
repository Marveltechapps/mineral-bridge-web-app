import { useAppState } from '@/hooks/useAppState';
import { css } from '@/utils/css';
import logo from '@/assets/images/mb-logo.png';
import type { RouteKey } from '@/types';

type FooterLink = { label: string; r: RouteKey | '__auth' };

const FOOTER_COLS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'MARKETPLACE',
    links: [
      { label: 'Browse minerals', r: 'buy' },
      { label: 'Sell a mineral', r: 'sell' },
      { label: 'Artisanal mining', r: 'mining' },
    ],
  },
  {
    title: 'ACCOUNT',
    links: [
      { label: 'Sign in', r: '__auth' },
      { label: 'My orders', r: 'orders' },
      { label: 'Settings', r: 'account' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'How it works', r: 'howItWorks' },
      { label: 'Compliance', r: 'home' },
      { label: 'Support', r: 'account' },
    ],
  },
];

/** Dark brand footer with the three link columns and the legal strip. */
export function Footer() {
  const { setState, go } = useAppState();

  const follow = (r: FooterLink['r']) => () =>
    r === '__auth'
      ? setState({ authOpen: true, authMode: 'login', authStage: 'form' })
      : go(r);

  return (
    <footer style={css('background:#141a2e; color:rgba(255,255,255,.62); margin-top:auto;')}>
      <div
        className="v2-g4"
        style={css(
          'max-width:1440px; margin:0 auto; padding:48px 32px 28px; display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:36px;',
        )}
      >
        <div>
          <div style={css('display:flex; align-items:center; gap:11px;')}>
            <img
              src={logo}
              alt=""
              style={css('width:38px; height:38px; border-radius:19px; object-fit:cover;')}
            />
            <span
              className="v2-gold"
              style={css(
                "font-family:'Poppins'; font-size:15px; font-weight:800; letter-spacing:1.4px;",
              )}
            >
              MINERAL BRIDGE
            </span>
          </div>
          <p style={css('font-size:13px; line-height:1.65; margin:16px 0 0; max-width:300px;')}>
            The verified marketplace for precious metals, gemstones and critical minerals — escrow-backed, assay-certified, globally logistics-ready.
          </p>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <div
              style={css('font-size:12px; font-weight:800; letter-spacing:1px; color:#fff;')}
            >
              {col.title}
            </div>
            <div
              style={css('display:flex; flex-direction:column; gap:10px; margin-top:15px;')}
            >
              {col.links.map((l) => (
                <button
                  key={l.label}
                  onClick={follow(l.r)}
                  style={css(
                    'background:none; border:none; padding:0; text-align:left; font-size:13px; color:rgba(255,255,255,.62); cursor:pointer;',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={css('border-top:1px solid rgba(255,255,255,.1);')}>
        <div
          style={css(
            'max-width:1440px; margin:0 auto; padding:18px 32px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; font-size:12.5px;',
          )}
        >
          <span>© 2026 Mineral Bridge. All rights reserved.</span>
          <span>Escrow-protected · KYC-verified · Blockchain-audited</span>
        </div>
      </div>
    </footer>
  );
}
