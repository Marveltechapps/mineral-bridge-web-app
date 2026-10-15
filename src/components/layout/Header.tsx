import { useCatalogState, useNavigationState, useSessionState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { css } from '@/utils/css';
import logo from '@/assets/images/mb-logo.png';
import type { RouteKey } from '@/types';

const NAV_BASE =
  'padding:9px 15px; border:none; background:none; border-radius:9px; font-size:14px; font-weight:600; color:#9aa4c4; cursor:pointer; white-space:nowrap;';
const NAV_ON =
  'padding:9px 15px; border:none; background:rgba(255,255,255,.1); border-radius:9px; font-size:14px; font-weight:700; color:#fff; cursor:pointer; white-space:nowrap;';

const BASE_NAV: { id: RouteKey; label: string; r: RouteKey }[] = [
  { id: 'home', label: 'Home', r: 'home' },
  { id: 'buy', label: 'Buy', r: 'buy' },
  { id: 'sell', label: 'Sell', r: 'sell' },
  { id: 'auctions', label: 'Auctions', r: 'auctions' },
  { id: 'academy', label: 'Academy', r: 'academy' },
  { id: 'mining', label: 'Mining', r: 'mining' },
];

/** Sticky top bar: brand, primary navigation, search and the account cluster. */
export function Header() {
  const { authed } = useSessionState();
  const { query } = useCatalogState();
  const { route, go } = useNavigationState();
  const h = useActions();

  const topNav = BASE_NAV.concat(
    authed ? [{ id: 'orders' as RouteKey, label: 'My Orders', r: 'orders' as RouteKey }] : [],
  );

  return (
    <header style={css('position:sticky; top:0; z-index:50; background:#141a2e; color:#fff;')}>
      <div
        className="v2-hdr"
        style={css(
          'max-width:1440px; margin:0 auto; padding:0 32px; height:72px; display:flex; align-items:center; gap:28px; min-width:0;',
        )}
      >
        <button
          onClick={h.goHome}
          aria-label="Mineral Bridge — home"
          style={css(
            'display:flex; align-items:center; gap:11px; background:none; border:none; cursor:pointer; padding:0;',
          )}
        >
          <img
            src={logo}
            alt="Mineral Bridge"
            style={css('width:40px; height:40px; border-radius:20px; object-fit:cover;')}
          />
          <span
            style={css(
              'display:flex; flex-direction:column; align-items:flex-start; line-height:1;',
            )}
          >
            <span
              className="v2-gold"
              style={css(
                "font-family:'Poppins'; font-size:14px; font-weight:800; letter-spacing:1.4px;",
              )}
            >
              MINERAL
            </span>
            <span
              className="v2-gold"
              style={css(
                "font-family:'Poppins'; font-size:14px; font-weight:800; letter-spacing:1.4px; margin-top:2px;",
              )}
            >
              BRIDGE
            </span>
          </span>
        </button>

        <nav
          className="v2-nav"
          aria-label="Primary"
          style={css(
            'display:flex; align-items:center; gap:4px; min-width:0; flex:0 1 auto; overflow-x:auto;',
          )}
        >
          {topNav.map((n) => (
            <button
              key={n.id}
              className="v2-top"
              onClick={() => go(n.r)}
              aria-current={route === n.id ? 'page' : undefined}
              style={css(route === n.id ? NAV_ON : NAV_BASE)}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div
          style={css(
            'flex:1 1 auto; min-width:0; display:flex; justify-content:flex-end; align-items:center; gap:14px;',
          )}
        >
          <div
            className="v2-hide-md"
            style={css('position:relative; width:300px; display:flex; align-items:center;')}
          >
            <span style={css('position:absolute; left:13px; color:#8b95b4; display:flex;')}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              value={query}
              onChange={h.setQuery}
              placeholder="Search minerals, orders…"
              aria-label="Search minerals and orders"
              style={css(
                'width:100%; height:42px; border:1px solid #2b3352; background:#1b2237; border-radius:11px; padding:0 14px 0 38px; font-size:13.5px; color:#fff; outline:none;',
              )}
            />
          </div>

          {authed ? (
            <>
              <button
                onClick={h.goOrders}
                aria-label="My orders — 2 notifications"
                style={css(
                  'position:relative; width:42px; height:42px; border-radius:11px; border:1px solid #2b3352; background:#1b2237; color:#dfe4f2; display:flex; align-items:center; justify-content:center; cursor:pointer;',
                )}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.7 21a2 2 0 0 1-3.4 0"></path>
                </svg>
                <span
                  style={css(
                    'position:absolute; top:-5px; right:-5px; background:#e0245e; color:#fff; font-size:10px; font-weight:800; min-width:18px; height:18px; border-radius:9px; display:flex; align-items:center; justify-content:center; border:2px solid #141a2e; padding:0 4px;',
                  )}
                >
                  2
                </span>
              </button>
              <button
                onClick={h.goAccount}
                style={css(
                  'display:flex; align-items:center; gap:9px; background:#1b2237; border:1px solid #2b3352; border-radius:11px; padding:5px 12px 5px 6px; cursor:pointer;',
                )}
              >
                <span
                  style={css(
                    "width:32px; height:32px; border-radius:16px; background:linear-gradient(135deg,#f0a04b,#c8962f); color:#fff; font-family:'Poppins'; font-size:12.5px; font-weight:700; display:flex; align-items:center; justify-content:center;",
                  )}
                >
                  MT
                </span>
                <span style={css('font-size:13px; font-weight:700; color:#fff;')}>Marvel</span>
              </button>
            </>
          ) : (
            <button
              className="v2-btn"
              onClick={h.signIn}
              style={css(
                'height:42px; padding:0 22px; border-radius:11px; border:none; background:linear-gradient(135deg,#f7dd8e,#c8962f); color:#141a2e; font-size:13.5px; font-weight:800; cursor:pointer;',
              )}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
