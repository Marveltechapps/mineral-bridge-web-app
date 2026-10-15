import { useAuctionsViewModel } from '@/features/auctions/hooks/useAuctionsViewModel';
import { css } from '@/utils/css';

/** Auction list with live / upcoming / ended tabs and the outbid alert. */
export function AuctionsPage() {
  const vm = useAuctionsViewModel();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <div
        style={css(
          'display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:22px; flex-wrap:wrap;',
        )}
      >
        <div>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
            )}
          >
            Auctions
          </h1>
          <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>
            Bid on assured lots released from our vault.
          </p>
        </div>
        <div style={css('display:flex; gap:8px;')}>
          {vm.aucTabs.map((t) => (
            <button key={t.k} className="v2-chip" onClick={t.select} style={css(t.style)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {vm.aucOutbid && (
        <div
          role="alert"
          style={css(
            'display:flex; align-items:center; gap:14px; background:#fdecec; border:1px solid #f3c8c8; border-left:4px solid #dc2626; border-radius:14px; padding:16px 20px; margin-bottom:20px;',
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={css('flex-shrink:0;')}
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={css('flex:1;')}>
            <div style={css('font-size:14.5px; font-weight:800; color:#141a2e;')}>
              You&apos;ve been outbid on {vm.aucOutbidLot}
            </div>
            <div style={css('font-size:13px; color:#8a4b4b; margin-top:2px;')}>
              Current bid is now {vm.aucOutbidAmount}. Raise your bid to stay in.
            </div>
          </div>
          <button
            onClick={vm.dismissOutbid}
            aria-label="Dismiss"
            style={css(
              'width:32px; height:32px; border-radius:16px; border:none; background:#fbdada; color:#a33; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
            )}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div
        className="v2-g3"
        style={css('display:grid; grid-template-columns:repeat(3,1fr); gap:18px;')}
      >
        {vm.aucList.map((a) => (
          <div
            key={a.id}
            className="v2-lift"
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 4px 14px rgba(20,26,46,.05); display:flex; flex-direction:column;',
            )}
          >
            <div style={css('height:150px; background:' + a.grad + '; position:relative;')}>
              <span style={css(a.flagStyle)}>{a.flag}</span>
              <span
                style={css(
                  'position:absolute; bottom:12px; left:12px; background:rgba(20,26,46,.78); color:#fff; font-size:11px; font-weight:800; padding:6px 11px; border-radius:8px;',
                )}
              >
                {a.timeLabel}
              </span>
            </div>
            <div
              style={css('padding:16px 18px 18px; display:flex; flex-direction:column; flex:1;')}
            >
              <div style={css('font-size:16px; font-weight:800; color:#141a2e;')}>{a.name}</div>
              <div style={css('font-size:12.5px; color:#6b7290; margin-top:4px;')}>
                {a.qty} · {a.grade}
              </div>
              <div
                style={css('margin-top:13px; padding-bottom:14px; border-bottom:1px solid #f0f2f8;')}
              >
                <div
                  style={css(
                    'font-size:11.5px; font-weight:800; letter-spacing:.5px; color:#8b95b4;',
                  )}
                >
                  {a.bidLabel}
                </div>
                <div
                  style={css(
                    "font-family:'Poppins'; font-size:21px; font-weight:800; color:#141a2e; margin-top:3px;",
                  )}
                >
                  {a.bid}
                </div>
                {a.yourBid && (
                  <div
                    style={css(
                      'font-size:12.5px; font-weight:700; color:' +
                        a.yourBidColor +
                        '; margin-top:4px;',
                    )}
                  >
                    Your bid · {a.yourBid}
                  </div>
                )}
              </div>
              <button
                className="v2-btn"
                onClick={a.open}
                style={css(
                  'width:100%; height:44px; margin-top:14px; border:none; border-radius:11px; background:' +
                    a.ctaBg +
                    '; color:' +
                    a.ctaColor +
                    '; font-size:14px; font-weight:800; cursor:pointer;',
                )}
              >
                {a.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
