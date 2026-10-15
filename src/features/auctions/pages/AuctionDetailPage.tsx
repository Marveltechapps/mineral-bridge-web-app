import { useAuctionsViewModel } from '@/features/auctions/hooks/useAuctionsViewModel';
import { useActions } from '@/hooks/useActions';
import { css } from '@/utils/css';

const SECTION_LABEL =
  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin:28px 0 12px;';
const PANEL =
  'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 3px 12px rgba(20,26,46,.05);';
const STEPPER_BTN =
  'width:46px; height:46px; border-radius:12px; border:1px solid #dde2f0; background:#f7f8fc; font-size:21px; color:#3a4160; cursor:pointer;';

/** Auction lot detail: specification, bid history and the bidding panel. */
export function AuctionDetailPage() {
  const vm = useAuctionsViewModel();
  const h = useActions();
  const { auc } = vm;

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <nav
        aria-label="Breadcrumb"
        style={css(
          'display:flex; align-items:center; gap:8px; font-size:13px; color:#5b638a; margin-bottom:18px;',
        )}
      >
        <button
          onClick={h.goAuctions}
          style={css(
            'background:none; border:none; padding:0; font-size:13px; color:#5b638a; cursor:pointer;',
          )}
        >
          Auctions
        </button>
        <span>/</span>
        <span style={css('color:#141a2e; font-weight:700;')}>{auc.name}</span>
      </nav>

      <div
        className="v2-split"
        style={css('display:grid; grid-template-columns:1fr 386px; gap:32px; align-items:start;')}
      >
        <div>
          <div
            style={css(
              'height:340px; border-radius:20px; background:' +
                auc.grad +
                '; position:relative; overflow:hidden; box-shadow:0 16px 40px rgba(20,26,46,.16);',
            )}
          >
            <span style={css(auc.flagStyle)}>{auc.flag}</span>
          </div>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:31px; font-weight:800; color:#141a2e; margin:22px 0 0; letter-spacing:-.6px;",
            )}
          >
            {auc.name}
          </h1>
          <div style={css('font-size:14px; color:#6b7290; margin-top:7px;')}>
            {auc.qty} · {auc.grade} · {auc.origin}
          </div>

          <div style={css(SECTION_LABEL)}>LOT SPECIFICATION</div>
          <div style={css(PANEL)}>
            {auc.specs.map((s) => (
              <div
                key={s.k}
                style={css(
                  'display:flex; align-items:center; gap:16px; padding:15px 20px; border-bottom:1px solid #f2f4fa;',
                )}
              >
                <span style={css('flex:1; font-size:13.5px; color:#6b7290;')}>{s.k}</span>
                <span style={css('font-size:14px; font-weight:800; color:#141a2e;')}>{s.v}</span>
              </div>
            ))}
          </div>

          <div style={css(SECTION_LABEL)}>BID HISTORY</div>
          <div style={css(PANEL)}>
            {auc.bids.map((b) => (
              <div
                key={b.who}
                style={css(
                  'display:flex; align-items:center; gap:14px; padding:15px 20px; border-bottom:1px solid #f2f4fa;',
                )}
              >
                <span
                  style={css(
                    'width:34px; height:34px; border-radius:17px; background:' +
                      b.avBg +
                      '; color:' +
                      b.avColor +
                      '; font-size:11.5px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  {b.initials}
                </span>
                <span style={css('flex:1; min-width:0;')}>
                  <span
                    style={css('display:block; font-size:14px; font-weight:800; color:#141a2e;')}
                  >
                    {b.who}
                  </span>
                  <span
                    style={css('display:block; font-size:12px; color:#8b95b4; margin-top:1px;')}
                  >
                    {b.time}
                  </span>
                </span>
                <span
                  style={css('font-size:15px; font-weight:800; color:' + b.amountColor + ';')}
                >
                  {b.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside
          className="v2-sticky"
          aria-label="Bidding"
          style={css(
            'position:sticky; top:96px; background:#fff; border:1px solid #e7eaf3; border-radius:20px; padding:26px; box-shadow:0 10px 30px rgba(20,26,46,.09);',
          )}
        >
          <div style={css('display:flex; align-items:center; justify-content:space-between;')}>
            <span
              style={css('font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;')}
            >
              {auc.bidLabel}
            </span>
            <span style={css(auc.stateChip)}>{auc.stateLabel}</span>
          </div>
          <div
            style={css(
              "font-family:'Poppins'; font-size:34px; font-weight:800; color:#141a2e; margin-top:8px;",
            )}
          >
            {auc.bid}
          </div>
          <div
            style={css(
              'display:flex; align-items:center; gap:9px; margin:16px 0; padding:13px 15px; background:' +
                auc.timerBg +
                '; border-radius:12px;',
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={auc.timerColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            <span style={css('font-size:13px; font-weight:800; color:' + auc.timerColor + ';')}>
              {auc.timeLabel}
            </span>
          </div>

          {auc.canBid && (
            <>
              <div style={css(vm.lbl)}>Your bid ({auc.unit})</div>
              <div style={css('display:flex; align-items:center; gap:12px; margin-bottom:8px;')}>
                <button onClick={vm.bidDec} aria-label="Lower bid" style={css(STEPPER_BTN)}>
                  −
                </button>
                <input
                  value={vm.bidValue}
                  onChange={vm.setBid}
                  aria-label={`Your bid in ${auc.unit}`}
                  style={css(
                    'flex:1; height:46px; border:1px solid #dde2f0; border-radius:12px; padding:0 14px; font-size:17px; font-weight:800; color:#141a2e; text-align:center; outline:none;',
                  )}
                />
                <button onClick={vm.bidInc} aria-label="Raise bid" style={css(STEPPER_BTN)}>
                  +
                </button>
              </div>
              <div style={css('font-size:12px; color:#8b95b4; margin-bottom:16px;')}>
                Minimum increment {auc.increment}
              </div>
              <button
                className="v2-btn"
                onClick={vm.placeBid}
                style={css(
                  'width:100%; height:54px; border:none; border-radius:13px; background:#1e2a5a; color:#fff; font-size:16px; font-weight:800; cursor:pointer;',
                )}
              >
                Place bid
              </button>
              <button
                onClick={vm.setMaxBid}
                style={css(
                  'width:100%; height:48px; margin-top:11px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:14.5px; font-weight:800; cursor:pointer;',
                )}
              >
                Set auto-bid limit
              </button>
            </>
          )}

          {auc.isUpcoming && (
            <button
              onClick={vm.remindMe}
              style={css(
                'width:100%; height:54px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:15.5px; font-weight:800; cursor:pointer;',
              )}
            >
              Remind me when it opens
            </button>
          )}

          {auc.isEnded && (
            <>
              <div
                style={css(
                  'background:#f4f5f9; border:1px solid #e7eaf3; border-radius:14px; padding:18px; text-align:center;',
                )}
              >
                <div style={css('font-size:13.5px; font-weight:800; color:#141a2e;')}>
                  {auc.endedHeadline}
                </div>
                <div
                  style={css('font-size:12.5px; color:#6b7290; margin-top:5px; line-height:1.5;')}
                >
                  {auc.endedSub}
                </div>
              </div>
              <button
                onClick={h.goAuctions}
                style={css(
                  'width:100%; height:50px; margin-top:13px; border:none; border-radius:13px; background:#1e2a5a; color:#fff; font-size:15px; font-weight:800; cursor:pointer;',
                )}
              >
                Browse other auctions
              </button>
            </>
          )}

          <div
            style={css(
              'display:flex; align-items:flex-start; gap:11px; margin-top:20px; padding-top:18px; border-top:1px solid #f0f2f8;',
            )}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1e2a5a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={css('flex-shrink:0; margin-top:1px;')}
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <div style={css('font-size:12.5px; color:#6b7290; line-height:1.55;')}>
              Winning bids settle through escrow with full assay documentation.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
