import { useEffect, useRef } from 'react';
import { useOrdersViewModel } from '@/features/orders/hooks/useOrdersViewModel';
import { useActions } from '@/hooks/useActions';
import { css } from '@/utils/css';

const GRID = 'grid-template-columns:1.5fr .7fr .8fr .8fr 1.4fr .8fr; gap:16px;';

/** "My Orders" — buy and sell activity across the settlement pipeline. */
export function OrdersPage() {
  const vm = useOrdersViewModel();
  const h = useActions();
  const asked = useRef(false);
  useEffect(() => {
    if (!vm.needsSignIn || asked.current) return;
    asked.current = true;
    h.signIn();
  }, [vm.needsSignIn, h]);

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <div
        style={css(
          'display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:24px; flex-wrap:wrap;',
        )}
      >
        <div>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
            )}
          >
            My Orders
          </h1>
          <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>
            Track buy and sell activity through the settlement pipeline.
          </p>
        </div>
        <div style={css('display:flex; gap:8px;')}>
          {vm.orderFilters.map((f) => (
            <button key={f.k} className="v2-chip" onClick={f.select} style={css(f.style)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={css('display:flex; gap:6px; border-bottom:1px solid #e7eaf3; margin-bottom:20px;')}
      >
        {vm.orderTabs.map((t) => (
          <button key={t.k} onClick={t.select} style={css(t.style)}>
            {t.label}
          </button>
        ))}
      </div>

      <div
        style={css(
          'background:#fff; border:1px solid #e7eaf3; border-radius:20px; overflow:hidden; box-shadow:0 4px 14px rgba(20,26,46,.05);',
        )}
      >
        <div
          style={css(
            'display:grid; ' +
              GRID +
              ' padding:15px 24px; background:#f9fafd; border-bottom:1px solid #eef1f8;',
          )}
        >
          {vm.orderCols.map((c) => (
            <span
              key={c.v}
              style={css(
                'font-size:11px; font-weight:800; letter-spacing:.7px; color:#8b95b4;',
              )}
            >
              {c.v}
            </span>
          ))}
        </div>

        {vm.orderRows.map((o) => (
          <button
            key={o.id}
            className="v2-row"
            onClick={o.open}
            style={css(
              'display:grid; ' +
                GRID +
                ' align-items:center; width:100%; padding:17px 24px; border:none; border-bottom:1px solid #f2f4fa; background:#fff; cursor:pointer; text-align:left;',
            )}
          >
            <span style={css('display:flex; align-items:center; gap:12px; min-width:0;')}>
              <span
                style={css(
                  'width:38px; height:38px; border-radius:11px; background:' +
                    o.grad +
                    '; flex-shrink:0;',
                )}
              />
              <span style={css('min-width:0;')}>
                <span
                  style={css('display:block; font-size:14.5px; font-weight:800; color:#141a2e;')}
                >
                  {o.mineral}
                </span>
                <span
                  style={css('display:block; font-size:12px; color:#8b95b4; margin-top:1px;')}
                >
                  {o.id}
                </span>
              </span>
            </span>
            <span style={css(o.sideStyle)}>{o.side}</span>
            <span style={css('font-size:13.5px; font-weight:700; color:#141a2e;')}>{o.qty}</span>
            <span style={css('font-size:13.5px; color:#6b7290;')}>{o.date}</span>
            <span>
              <span
                style={css(
                  'display:block; height:6px; border-radius:3px; background:#eef1f8; overflow:hidden;',
                )}
              >
                <span
                  style={css(
                    'display:block; width:' +
                      o.progress +
                      '; height:100%; background:' +
                      o.progressBg +
                      ';',
                  )}
                />
              </span>
              <span
                style={css(
                  'display:block; font-size:11.5px; font-weight:700; color:#6b7290; margin-top:6px;',
                )}
              >
                {o.stage}
              </span>
            </span>
            <span style={css(o.statusStyle)}>{o.status}</span>
          </button>
        ))}

        {vm.ordersEmpty && (
          <div style={css('padding:56px 24px; text-align:center;')}>
            <div
              style={css(
                'width:56px; height:56px; border-radius:28px; background:#f2f4fa; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:#8b95b4;',
              )}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              </svg>
            </div>
            <div style={css('font-size:15.5px; font-weight:800; color:#141a2e;')}>
              {vm.ordersEmptyMsg}
            </div>
            <div style={css('font-size:13.5px; color:#6b7290; margin-top:6px;')}>
              Browse assured inventory or list a mineral to get started.
            </div>
            <div style={css('display:flex; gap:11px; justify-content:center; margin-top:20px;')}>
              {vm.needsSignIn ? (
                <button
                  className="v2-btn"
                  onClick={h.signIn}
                  style={css(
                    'height:46px; padding:0 22px; border:none; border-radius:11px; background:#1e2a5a; color:#fff; font-size:14px; font-weight:800; cursor:pointer;',
                  )}
                >
                  Sign in
                </button>
              ) : null}
              <button
                className="v2-btn"
                onClick={h.goBuy}
                style={css(
                  'height:46px; padding:0 22px; border:none; border-radius:11px; background:#1e2a5a; color:#fff; font-size:14px; font-weight:800; cursor:pointer;',
                )}
              >
                Browse minerals
              </button>
              <button
                onClick={h.goSell}
                style={css(
                  'height:46px; padding:0 22px; border:1px solid #d5dbef; border-radius:11px; background:#fff; color:#1e2a5a; font-size:14px; font-weight:800; cursor:pointer;',
                )}
              >
                Sell a mineral
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
