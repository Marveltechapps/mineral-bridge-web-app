import { useContractViewModel } from '@/features/trade/hooks/useContractViewModel';
import { ChainGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const GROUP_LABEL = 'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;';
const FIELD_LABEL =
  'display:block; font-size:12px; font-weight:800; letter-spacing:.5px; color:#5b638a; margin:16px 0 8px;';
const CHIP_ROW = 'display:flex; gap:8px; flex-wrap:wrap;';
const BOLD = 'color:#141a2e;';
const SIG_COL = 'border-top:1.5px solid #141a2e; padding-top:9px;';

/** Contract Builder: trade and LC terms with a live document preview. */
export function ContractPage() {
  const c = useContractViewModel();

  if (!c.hasDraft) {
    return (
      <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
        <h1
          style={css(
            "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
          )}
        >
          Contract Builder
        </h1>
        <p style={css('font-size:14px; color:#6b7290; margin:6px 0 22px;')}>
          A contract is drafted from an agreed offer, or from a letter-of-credit purchase.
        </p>
        <div
          style={css(
            'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:36px 28px;',
          )}
        >
          <h2 style={css("font-family:'Poppins'; font-size:20px; margin:0; color:#141a2e;")}>
            No contract draft yet
          </h2>
          <p style={css('font-size:14px; color:#6b7290; margin:8px 0 0;')}>
            Accept an offer in the Negotiation Room, or choose Letter of Credit on a mineral, to start a draft.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <h1
        style={css(
          "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
        )}
      >
        Contract Builder
      </h1>
      <p style={css('font-size:14px; color:#6b7290; margin:6px 0 22px;')}>
        Set trade and Letter of Credit terms. The preview updates as you type.
      </p>

      <div
        className="v2-split"
        style={css(
          'display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:26px; align-items:start;',
        )}
      >
        <div
          style={css(
            'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); padding:26px;',
          )}
        >
          <div style={css(GROUP_LABEL)}>TRADE TERMS</div>

          <div style={css(FIELD_LABEL)}>Incoterm</div>
          <div style={css(CHIP_ROW)}>
            {c.incoterms.map((o) => (
              <button key={o.label} onClick={o.select} style={css(o.style)}>
                {o.label}
              </button>
            ))}
          </div>
          <div style={css('font-size:12.5px; color:#6b7290; margin-top:9px; line-height:1.5;')}>
            {c.incotermDesc}
          </div>

          <div
            className="v2-g2"
            style={css('display:grid; grid-template-columns:1fr 1fr; gap:0 16px;')}
          >
            <div>
              <div style={css(FIELD_LABEL)}>Price per unit (USD)</div>
              <input
                value={c.f.price}
                onChange={c.onPrice}
                disabled={c.locked}
                placeholder="e.g. 2360"
                aria-label="Price per unit in USD"
                style={css(c.inp)}
              />
            </div>
            <div>
              <div style={css(FIELD_LABEL)}>Quantity</div>
              <input
                value={c.f.qty}
                onChange={c.onQty}
                disabled={c.locked}
                placeholder="e.g. 77"
                aria-label="Quantity"
                style={css(c.inp)}
              />
            </div>
          </div>

          <div style={css(FIELD_LABEL)}>Unit</div>
          <div style={css(CHIP_ROW)}>
            {c.units.map((o) => (
              <button key={o.label} onClick={o.select} style={css(o.style)}>
                {o.label}
              </button>
            ))}
          </div>

          <div style={css(FIELD_LABEL)}>Named port or place</div>
          <input
            value={c.f.port}
            onChange={c.onPort}
            disabled={c.locked}
            placeholder="e.g. Durban"
            aria-label="Named port or place"
            style={css(c.inp)}
          />

          <div style={css(FIELD_LABEL)}>Shipment window</div>
          <div
            className="v2-g2"
            style={css('display:grid; grid-template-columns:1fr 1fr; gap:16px;')}
          >
            <input
              type="date"
              value={c.f.from}
              onChange={c.onFrom}
              disabled={c.locked}
              aria-label="Shipment window from"
              style={css(c.inp)}
            />
            <input
              type="date"
              value={c.f.to}
              onChange={c.onTo}
              disabled={c.locked}
              aria-label="Shipment window to"
              style={css(c.inp)}
            />
          </div>

          <div style={css(GROUP_LABEL + ' margin-top:30px;')}>LETTER OF CREDIT TERMS</div>

          <div style={css(FIELD_LABEL)}>LC type</div>
          <div style={css(CHIP_ROW)}>
            {c.lcTypes.map((o) => (
              <button key={o.label} onClick={o.select} style={css(o.style)}>
                {o.label}
              </button>
            ))}
          </div>

          <div style={css(FIELD_LABEL)}>Tenor</div>
          <div style={css(CHIP_ROW)}>
            {c.tenors.map((o) => (
              <button key={o.label} onClick={o.select} style={css(o.style)}>
                {o.label}
              </button>
            ))}
          </div>

          <div
            className="v2-g2"
            style={css('display:grid; grid-template-columns:1fr 1fr; gap:0 16px;')}
          >
            <div>
              <div style={css(FIELD_LABEL)}>Issuing bank</div>
              <input
                value={c.f.bank}
                onChange={c.onBank}
                disabled={c.locked}
                placeholder="Bank name"
                aria-label="Issuing bank"
                style={css(c.inp)}
              />
            </div>
            <div>
              <div style={css(FIELD_LABEL)}>Presentation period (days)</div>
              <input
                value={c.f.presentation}
                onChange={c.onPres}
                disabled={c.locked}
                placeholder="21"
                aria-label="Presentation period in days"
                style={css(c.inp)}
              />
            </div>
          </div>
        </div>

        <aside className="v2-sticky" style={css('position:sticky; top:96px;')}>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(20,26,46,.08);',
            )}
          >
            <div
              style={css(
                'display:flex; align-items:center; justify-content:space-between; padding:14px 22px; background:#f4f5f9; border-bottom:1px solid #eef1f8;',
              )}
            >
              <span style={css(GROUP_LABEL)}>LIVE PREVIEW</span>
              <span style={css(c.statusStyle)}>{c.statusLabel}</span>
            </div>
            <div style={css('padding:28px 30px;')}>
              <div style={css('text-align:center;')}>
                <div
                  style={css(
                    "font-family:'Poppins'; font-size:17px; font-weight:800; letter-spacing:1.5px; color:#141a2e;",
                  )}
                >
                  SALES &amp; PURCHASE CONTRACT
                </div>
                <div style={css('font-size:12px; color:#8b95b4; margin-top:4px;')}>
                  No. MB-SPA-2026-0419
                </div>
              </div>

              <div
                style={css('font-size:13.5px; line-height:1.75; color:#3a4160; margin-top:20px;')}
              >
                <p style={css('margin:0 0 12px;')}>
                  Made between <b style={css(BOLD)}>{c.f.seller}</b> (Seller) and{' '}
                  <b style={css(BOLD)}>{c.buyer}</b> (Buyer), facilitated by Mineral Bridge.
                </p>
                <p style={css('margin:0 0 12px;')}>
                  <b style={css(BOLD)}>1. Goods.</b> {c.f.lot}, quantity{' '}
                  <b style={css(BOLD)}>{c.qtyLabel}</b>, at <b style={css(BOLD)}>{c.priceLabel}</b>.
                </p>
                <p style={css('margin:0 0 12px;')}>
                  <b style={css(BOLD)}>2. Delivery.</b>{' '}
                  <b style={css(BOLD)}>
                    {c.f.incoterm} {c.f.port}
                  </b>{' '}
                  (Incoterms 2020). Shipment between <b style={css(BOLD)}>{c.fromLabel}</b> and{' '}
                  <b style={css(BOLD)}>{c.toLabel}</b>.
                </p>
                <p style={css('margin:0 0 12px;')}>
                  <b style={css(BOLD)}>3. Payment.</b> By <b style={css(BOLD)}>{c.f.lcType}</b>{' '}
                  documentary Letter of Credit, payable <b style={css(BOLD)}>{c.tenorLabel}</b>,
                  issued by <b style={css(BOLD)}>{c.f.bank}</b>. Documents to be presented within{' '}
                  <b style={css(BOLD)}>{c.f.presentation} days</b> of shipment.
                </p>
                <p style={css('margin:0;')}>
                  <b style={css(BOLD)}>4. Assay.</b> Final weight and purity per independent assay, anchored to the lot&apos;s Mineral Passport.
                </p>
              </div>

              <div
                style={css(
                  'display:flex; justify-content:space-between; align-items:center; gap:12px; background:#141a2e; border-radius:14px; padding:16px 20px; margin-top:20px;',
                )}
              >
                <span
                  style={css(
                    'font-size:12px; font-weight:800; letter-spacing:1px; color:#f7dd8e;',
                  )}
                >
                  CONTRACT VALUE
                </span>
                <span
                  style={css("font-family:'Poppins'; font-size:21px; font-weight:800; color:#fff;")}
                >
                  {c.total}
                </span>
              </div>

              <div
                style={css('display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:20px;')}
              >
                <div style={css(SIG_COL)}>
                  <div
                    style={css('font-size:11px; font-weight:800; letter-spacing:.6px; color:#8b95b4;')}
                  >
                    BUYER
                  </div>
                  <div
                    style={css('font-size:13.5px; font-weight:800; color:#141a2e; margin-top:3px;')}
                  >
                    {c.buyerSig}
                  </div>
                </div>
                <div style={css(SIG_COL)}>
                  <div
                    style={css('font-size:11px; font-weight:800; letter-spacing:.6px; color:#8b95b4;')}
                  >
                    SELLER
                  </div>
                  <div
                    style={css('font-size:13.5px; font-weight:800; color:#141a2e; margin-top:3px;')}
                  >
                    {c.sellerSig}
                  </div>
                </div>
              </div>

              {c.signed && (
                <div
                  style={css(
                    'display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:18px; padding-top:14px; border-top:1px solid #f0f2f8;',
                  )}
                >
                  <span
                    style={css(
                      'display:inline-flex; align-items:center; gap:6px; background:#dcf3e8; color:#15803d; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 10px; border-radius:8px; white-space:nowrap;',
                    )}
                  >
                    <ChainGlyph />
                    VERIFIED ON BLOCKCHAIN
                  </span>
                  <span style={css('font-size:12px; color:#6b7290; font-family:monospace;')}>
                    {c.hash}
                  </span>
                </div>
              )}
            </div>
          </div>

          {c.notSigned && (
            <button
              className="v2-btn"
              onClick={c.sign}
              disabled={c.signBlocked}
              style={css(c.signStyle)}
            >
              Sign contract
            </button>
          )}
          {c.signed && (
            <button
              className="v2-btn"
              onClick={c.openLc}
              style={css(
                'width:100%; height:50px; margin-top:16px; border:none; border-radius:13px; background:#1e2a5a; color:#fff; font-size:15px; font-weight:800; cursor:pointer;',
              )}
            >
              Open LC Workspace
            </button>
          )}
          <div style={css('font-size:12px; color:#6b7290; margin-top:10px; line-height:1.5;')}>
            {c.signHint}
          </div>
        </aside>
      </div>
    </div>
  );
}
