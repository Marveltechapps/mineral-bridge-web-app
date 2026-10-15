import { useNavigationState } from '@/hooks/useAppState';
import { css } from '@/utils/css';
import type { RouteKey } from '@/types';

const TRADE_NAV: [RouteKey, string][] = [
  ['negotiation', 'Negotiation Room'],
  ['contract', 'Contract Builder'],
  ['lc', 'LC Workspace'],
  ['bank', 'Bank Portal'],
  ['shipment', 'Shipment Tracking'],
];

/** Secondary "TRADE DESK" bar linking the five institutional trade screens. */
export function TradeNav() {
  const { route, go } = useNavigationState();

  return (
    <div style={css('background:#fff; border-bottom:1px solid #e7eaf3;')}>
      <div
        style={css(
          'max-width:1440px; margin:0 auto; padding:0 32px; display:flex; align-items:center; gap:2px; overflow-x:auto;',
        )}
      >
        <span
          style={css(
            'font-size:11px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin-right:12px; white-space:nowrap;',
          )}
        >
          TRADE DESK
        </span>
        {TRADE_NAV.map(([r, label]) => {
          const on = route === r;
          return (
            <button
              key={r}
              onClick={() => go(r)}
              aria-current={on ? 'page' : undefined}
              style={css(
                'padding:13px 14px; border:none; background:none; cursor:pointer; white-space:nowrap; font-size:13.5px; font-weight:' +
                  (on ? '800' : '600') +
                  '; color:' +
                  (on ? '#141a2e' : '#5b638a') +
                  '; border-bottom:2.5px solid ' +
                  (on ? '#c8962f' : 'transparent') +
                  ';',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
