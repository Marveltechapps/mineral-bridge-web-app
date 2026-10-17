import { useProductViewModel } from '@/features/product/hooks/useProductViewModel';
import { useActions } from '@/hooks/useActions';
import { ChainGlyph, CheckGlyph, PinGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const SECTION_LABEL =
  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin:30px 0 12px;';

/** Lot detail: imagery, specification, seller, provenance and the purchase panel. */
export function ProductPage() {
  const vm = useProductViewModel();
  const h = useActions();
  const { active, prov, settle } = vm;

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <nav
        aria-label="Breadcrumb"
        style={css(
          'display:flex; align-items:center; gap:8px; font-size:13px; color:#5b638a; margin-bottom:18px;',
        )}
      >
        <button
          onClick={h.goHome}
          style={css(
            'background:none; border:none; padding:0; font-size:13px; color:#5b638a; cursor:pointer;',
          )}
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={h.goBuy}
          style={css(
            'background:none; border:none; padding:0; font-size:13px; color:#5b638a; cursor:pointer;',
          )}
        >
          Browse
        </button>
        <span>/</span>
        <span style={css('color:#141a2e; font-weight:700;')}>{active.name}</span>
      </nav>

      <div
        className="v2-split"
        style={css('display:grid; grid-template-columns:1fr 386px; gap:32px; align-items:start;')}
      >
        <div>
          <div
            style={css(
              'height:360px; border-radius:20px; background-color:#eef1f6; background:' +
                active.grad +
                '; position:relative; overflow:hidden; box-shadow:0 16px 40px rgba(20,26,46,.16);',
            )}
          >
            <span
              style={css(
                'position:absolute; top:18px; left:18px; background:rgba(255,255,255,.94); color:#141a2e; font-size:11px; font-weight:800; letter-spacing:.5px; padding:7px 13px; border-radius:9px;',
              )}
            >
              {active.category}
            </span>
          </div>

          <h1
            style={css(
              "font-family:'Poppins'; font-size:33px; font-weight:800; color:#141a2e; margin:24px 0 0; letter-spacing:-.7px;",
            )}
          >
            {active.name}
          </h1>
          <div style={css('margin-top:10px;')}>
            <span
              style={css(
                'display:inline-flex; align-items:center; gap:6px; background:#dcf3e8; color:#15803d; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 10px; border-radius:8px; white-space:nowrap;',
              )}
            >
              <ChainGlyph />
              VERIFIED ON BLOCKCHAIN
            </span>
          </div>
          <div
            style={css(
              'display:flex; align-items:center; gap:18px; margin-top:10px; flex-wrap:wrap;',
            )}
          >
            <span
              style={css(
                'display:flex; align-items:center; gap:7px; font-size:13.5px; color:#6b7290;',
              )}
            >
              <PinGlyph size={15} />
              {active.region}
            </span>
            <span
              style={css(
                'display:flex; align-items:center; gap:7px; font-size:13.5px; font-weight:700; color:#16a34a;',
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              Verified seller
            </span>
          </div>

          {/* spec table */}
          <div style={css(SECTION_LABEL)}>ASSAY &amp; SPECIFICATION</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 3px 12px rgba(20,26,46,.05);',
            )}
          >
            {active.specs.map((s) => (
              <div
                key={s.k}
                className="v2-row"
                style={css(
                  'display:flex; align-items:center; gap:16px; padding:15px 20px; border-bottom:1px solid #f2f4fa;',
                )}
              >
                <span style={css('flex:1; font-size:13.5px; color:#6b7290;')}>{s.k}</span>
                <span style={css('font-size:14px; font-weight:800; color:#141a2e;')}>{s.v}</span>
              </div>
            ))}
          </div>

          <div style={css(SECTION_LABEL)}>SELLER</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:22px; display:flex; align-items:center; gap:16px; box-shadow:0 3px 12px rgba(20,26,46,.05);',
            )}
          >
            <span
              style={css(
                "width:54px; height:54px; border-radius:27px; background:linear-gradient(135deg,#1e2a5a,#3a4b7a); color:#f7dd8e; font-family:'Poppins'; font-size:17px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0;",
              )}
            >
              {active.sellerInitials}
            </span>
            <div style={css('flex:1;')}>
              <div style={css('font-size:16px; font-weight:800; color:#141a2e;')}>
                {active.seller}
              </div>
              <div style={css('font-size:13px; color:#6b7290; margin-top:3px;')}>
                {active.sellerType} · {active.region}
              </div>
            </div>
            <span
              style={css(
                'font-size:11.5px; font-weight:800; color:#16a34a; background:#dcf3e8; padding:7px 14px; border-radius:9px;',
              )}
            >
              KYC VERIFIED
            </span>
          </div>

          <div style={css(SECTION_LABEL)}>PROVENANCE · {prov.passport}</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); padding:22px 24px;',
            )}
          >
            {prov.events.map((e) => (
              <div key={e.title} style={css('display:flex; gap:16px;')}>
                <div style={css('display:flex; flex-direction:column; align-items:center;')}>
                  <span
                    style={css(
                      'width:26px; height:26px; border-radius:13px; background:#16a34a; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                    )}
                  >
                    <CheckGlyph />
                  </span>
                  {e.hasLine && (
                    <span
                      style={css('width:2px; flex:1; min-height:30px; background:#16a34a;')}
                    />
                  )}
                </div>
                <div style={css('padding-bottom:18px; flex:1; min-width:0;')}>
                  <div style={css('font-size:14.5px; font-weight:800; color:#141a2e;')}>
                    {e.title}
                  </div>
                  <div style={css('font-size:13px; color:#6b7290; margin-top:2px;')}>{e.sub}</div>
                  <div
                    style={css(
                      'display:flex; align-items:center; gap:9px; flex-wrap:wrap; margin-top:7px;',
                    )}
                  >
                    <span style={css('font-size:12px; color:#8b95b4;')}>{e.time}</span>
                    <span
                      style={css('font-size:11.5px; color:#6b7290; font-family:monospace;')}
                    >
                      {e.hash}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={css(SECTION_LABEL)}>ABOUT THIS LOT</div>
          <p style={css('font-size:15.5px; line-height:1.7; color:#3a4160; margin:0;')}>
            {active.desc}
          </p>
        </div>

        {/* purchase panel */}
        <aside
          className="v2-sticky"
          aria-label="Purchase"
          style={css(
            'position:sticky; top:96px; background:#fff; border:1px solid #e7eaf3; border-radius:20px; padding:26px; box-shadow:0 10px 30px rgba(20,26,46,.09);',
          )}
        >
          <div style={css('font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;')}>
            INDICATIVE PRICE
          </div>
          <div style={css('display:flex; align-items:baseline; gap:6px; margin-top:7px;')}>
            <span
              style={css("font-family:'Poppins'; font-size:34px; font-weight:800; color:#141a2e;")}
            >
              {active.price}
            </span>
            <span style={css('font-size:14px; color:#8b95b4;')}>/ {active.unit}</span>
          </div>
          <div
            style={css(
              'display:flex; align-items:center; gap:8px; margin:16px 0 20px; padding:13px 15px; background:#f0f9f4; border-radius:12px;',
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={css('font-size:12.5px; font-weight:700; color:#16a34a;')}>
              {active.stock} in stock
            </span>
          </div>

          <div
            style={css(
              'font-size:12px; font-weight:800; letter-spacing:.5px; color:#5b638a; margin-bottom:9px;',
            )}
          >
            QUANTITY ({active.unit})
          </div>
          <div style={css('display:flex; align-items:center; gap:12px; margin-bottom:18px;')}>
            <button
              onClick={vm.qtyDec}
              aria-label="Decrease quantity"
              style={css(
                'width:46px; height:46px; border-radius:12px; border:1px solid #dde2f0; background:#f7f8fc; font-size:21px; color:#3a4160; cursor:pointer;',
              )}
            >
              −
            </button>
            <input
              value={vm.qty}
              onChange={vm.setQty}
              aria-label={`Quantity in ${active.unit}`}
              style={css(
                'flex:1; height:46px; border:1px solid #dde2f0; border-radius:12px; padding:0 14px; font-size:17px; font-weight:800; color:#141a2e; text-align:center; outline:none;',
              )}
            />
            <button
              onClick={vm.qtyInc}
              aria-label="Increase quantity"
              style={css(
                'width:46px; height:46px; border-radius:12px; border:1px solid #dde2f0; background:#f7f8fc; font-size:21px; color:#3a4160; cursor:pointer;',
              )}
            >
              +
            </button>
          </div>

          <div
            style={css(
              'display:flex; flex-direction:column; gap:10px; padding:16px 0; border-top:1px solid #f0f2f8; border-bottom:1px solid #f0f2f8;',
            )}
          >
            <div style={css('display:flex; justify-content:space-between; font-size:13.5px;')}>
              <span style={css('color:#6b7290;')}>Subtotal</span>
              <span style={css('font-weight:800; color:#141a2e;')}>{vm.estSubtotal}</span>
            </div>
            <div style={css('display:flex; justify-content:space-between; font-size:13.5px;')}>
              <span style={css('color:#6b7290;')}>Platform fee (1%)</span>
              <span style={css('font-weight:800; color:#141a2e;')}>{vm.estFee}</span>
            </div>
            <div
              style={css(
                'display:flex; justify-content:space-between; font-size:16px; margin-top:4px;',
              )}
            >
              <span style={css('font-weight:800; color:#141a2e;')}>Estimated total</span>
              <span style={css("font-family:'Poppins'; font-weight:800; color:#141a2e;")}>
                {vm.estTotal}
              </span>
            </div>
          </div>
          <div style={css('font-size:12px; color:#8b95b4; margin-top:12px; line-height:1.5;')}>
            Final pricing is confirmed by our trading desk. No payment is taken now.
          </div>

          <div
            style={css(
              'font-size:12px; font-weight:800; letter-spacing:.5px; color:#5b638a; margin:20px 0 9px;',
            )}
          >
            SETTLEMENT METHOD
          </div>
          <div style={css('display:flex; flex-direction:column; gap:8px;')}>
            {settle.opts.map((o) => (
              <button key={o.k} onClick={o.select} style={css(o.style)}>
                <span style={css(o.radio)} />
                <span style={css('flex:1; min-width:0; text-align:left;')}>
                  <span
                    style={css('display:block; font-size:13.5px; font-weight:800; color:#141a2e;')}
                  >
                    {o.t}
                  </span>
                  <span
                    style={css('display:block; font-size:11.5px; color:#6b7290; margin-top:1px;')}
                  >
                    {o.s}
                  </span>
                </span>
                {o.tag && (
                  <span
                    style={css(
                      'font-size:9.5px; font-weight:800; letter-spacing:.5px; padding:4px 8px; border-radius:7px; background:#fdecd6; color:#9a4a06; white-space:nowrap;',
                    )}
                  >
                    {o.tag}
                  </span>
                )}
              </button>
            ))}
          </div>
          {settle.isBtc && (
            <div
              style={css(
                'background:#fff7ed; border:1px solid #fcd9a8; border-radius:12px; padding:12px 14px; margin-top:10px; font-size:12px; color:#7c5010; line-height:1.55;',
              )}
            >
              Bitcoin settlement is available in supported countries only. Your country is checked at checkout, and the BTC amount is fixed at the rate locked when you confirm.
            </div>
          )}
          {settle.isLc && (
            <button
              onClick={settle.openLc}
              style={css(
                'width:100%; height:42px; margin-top:10px; border:1px solid #d5dbef; border-radius:11px; background:#fff; color:#1e2a5a; font-size:13px; font-weight:800; cursor:pointer;',
              )}
            >
              Set up in Contract Builder
            </button>
          )}

          <button
            className="v2-btn"
            onClick={vm.buyNow}
            style={css(
              'width:100%; height:54px; margin-top:18px; border:none; border-radius:13px; background:linear-gradient(135deg,#f7dd8e,#c8962f); color:#141a2e; font-size:16px; font-weight:800; cursor:pointer;',
            )}
          >
            Buy Now
          </button>
          <button
            onClick={h.goSell}
            style={css(
              'width:100%; height:48px; margin-top:11px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:14.5px; font-weight:800; cursor:pointer;',
            )}
          >
            I want to sell this instead
          </button>

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
              Escrow-protected. Funds release only on verified custody transfer.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
