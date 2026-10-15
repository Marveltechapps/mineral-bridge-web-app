import { useLcViewModel } from '@/features/trade/hooks/useLcViewModel';
import { ChainGlyph, CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const SECTION_LABEL =
  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin-bottom:12px;';
const CARD =
  'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05);';
const VERIFIED_PILL =
  'display:inline-flex; align-items:center; gap:6px; background:#dcf3e8; color:#15803d; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 10px; border-radius:8px; white-space:nowrap;';

/** LC Workspace: milestone timeline, document checklist and presentation. */
export function LcPage() {
  const lc = useLcViewModel();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <div
        style={css(
          'display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap;',
        )}
      >
        <div>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
            )}
          >
            LC Workspace
          </h1>
          <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>{lc.headline}</p>
        </div>
        <span style={css(lc.statusChip)}>{lc.statusLabel}</span>
      </div>

      <div style={css(CARD + ' padding:24px 26px; margin-top:22px; overflow-x:auto;')}>
        <div style={css('display:flex; align-items:flex-start; min-width:720px;')}>
          {lc.milestones.map((s) => (
            <div key={s.label} style={css(s.wrap)}>
              <div style={css('display:flex; align-items:center;')}>
                <span style={css(s.dot)}>
                  {s.done ? <CheckGlyph strokeWidth={3.2} /> : s.n}
                </span>
                <span style={css(s.line)} />
              </div>
              <div
                style={css(
                  'font-size:12px; font-weight:800; color:' +
                    s.color +
                    '; margin-top:9px; max-width:96px;',
                )}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {lc.refused && (
        <div
          style={css(
            'display:flex; gap:14px; align-items:flex-start; background:#fdecec; border:1px solid #f3c8c8; border-left:4px solid #dc2626; border-radius:14px; padding:16px 20px; margin-top:18px;',
          )}
        >
          <div>
            <div style={css('font-size:15px; font-weight:800; color:#141a2e;')}>
              Presentation refused by the issuing bank
            </div>
            <div style={css('font-size:13px; color:#7a3b3b; margin-top:4px;')}>
              Correct the discrepancies below, re-run the pre-check and present again.
            </div>
          </div>
        </div>
      )}

      <div
        className="v2-split"
        style={css(
          'display:grid; grid-template-columns:minmax(0,1fr) 386px; gap:28px; align-items:start; margin-top:26px;',
        )}
      >
        <div>
          <div style={css(SECTION_LABEL)}>DOCUMENT CHECKLIST</div>
          <div style={css(CARD + ' overflow:hidden;')}>
            {lc.docs.map((d) => (
              <div
                key={d.k}
                style={css(
                  'display:flex; align-items:center; gap:14px; padding:15px 20px; border-bottom:1px solid #f2f4fa; flex-wrap:wrap;',
                )}
              >
                <div style={css('flex:1; min-width:200px;')}>
                  <div style={css('font-size:14.5px; font-weight:800; color:#141a2e;')}>
                    {d.name}
                  </div>
                  <div style={css('font-size:12.5px; color:#6b7290; margin-top:2px;')}>{d.sub}</div>
                  {d.up && (
                    <div style={css('margin-top:7px;')}>
                      <span style={css(VERIFIED_PILL)}>
                        <ChainGlyph />
                        VERIFIED ON BLOCKCHAIN
                      </span>
                    </div>
                  )}
                </div>
                <span style={css(d.chip)}>{d.chipLabel}</span>
                <button
                  onClick={d.toggle}
                  style={css(
                    'height:38px; padding:0 16px; border:1px solid #d5dbef; border-radius:10px; background:#fff; color:#1e2a5a; font-size:13px; font-weight:800; cursor:pointer;',
                  )}
                >
                  {d.btnLabel}
                </button>
              </div>
            ))}

            <div
              style={css(
                'display:flex; align-items:center; gap:12px; padding:16px 20px; background:#f9fafd; flex-wrap:wrap;',
              )}
            >
              <span
                style={css('flex:1; min-width:180px; font-size:13px; font-weight:700; color:#3a4160;')}
              >
                Bill of lading on-board date
              </span>
              {lc.blOpts.map((o) => (
                <button key={o.label} onClick={o.select} style={css(o.style)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="v2-btn"
            onClick={lc.precheck}
            style={css(
              'height:50px; padding:0 26px; margin-top:16px; border:none; border-radius:13px; background:#1e2a5a; color:#fff; font-size:15px; font-weight:800; cursor:pointer;',
            )}
          >
            Pre-check documents
          </button>

          {lc.compliant && (
            <div
              style={css(
                'display:flex; gap:14px; align-items:flex-start; background:#f0f9f4; border:1px solid #c8ead6; border-left:4px solid #16a34a; border-radius:14px; padding:18px 20px; margin-top:16px;',
              )}
            >
              <span
                style={css(
                  'width:34px; height:34px; border-radius:17px; background:#16a34a; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                )}
              >
                <CheckGlyph strokeWidth={3.2} />
              </span>
              <div>
                <div style={css('font-size:15.5px; font-weight:800; color:#141a2e;')}>
                  Compliant presentation
                </div>
                <div style={css('font-size:13px; color:#3a5a46; margin-top:4px; line-height:1.55;')}>
                  All required documents are present and consistent with the LC terms.
                </div>
              </div>
            </div>
          )}

          {lc.discrepant && (
            <div
              style={css(
                'background:#fdecec; border:1px solid #f3c8c8; border-left:4px solid #dc2626; border-radius:14px; padding:18px 20px; margin-top:16px;',
              )}
            >
              <div style={css('font-size:15.5px; font-weight:800; color:#141a2e;')}>
                {lc.discTitle}
              </div>
              <div style={css('display:flex; flex-direction:column; gap:7px; margin-top:10px;')}>
                {lc.disc.map((x) => (
                  <div
                    key={x.v}
                    style={css('display:flex; gap:9px; font-size:13px; color:#7a3b3b; line-height:1.5;')}
                  >
                    <span style={css('font-weight:800; color:#b91c1c;')}>•</span>
                    <span>{x.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="v2-sticky" style={css('position:sticky; top:96px;')}>
          <div style={css(SECTION_LABEL)}>LC DETAILS</div>
          <div style={css(CARD + ' padding:6px 22px;')}>
            {lc.details.map((d) => (
              <div
                key={d.k}
                style={css(
                  'display:flex; justify-content:space-between; gap:14px; padding:12px 0; border-bottom:1px solid #f0f2f8;',
                )}
              >
                <span style={css('font-size:13px; color:#6b7290;')}>{d.k}</span>
                <span
                  style={css('font-size:13px; font-weight:800; color:#141a2e; text-align:right;')}
                >
                  {d.v}
                </span>
              </div>
            ))}
          </div>

          <button
            className="v2-btn"
            onClick={lc.present}
            disabled={lc.presentBlocked}
            style={css(lc.presentStyle)}
          >
            {lc.presentLabel}
          </button>
          <div style={css('font-size:12px; color:#6b7290; margin-top:9px; line-height:1.5;')}>
            {lc.presentHint}
          </div>

          <div style={css('display:flex; gap:10px; margin-top:14px;')}>
            <button
              onClick={lc.goBank}
              style={css(
                'flex:1; height:44px; border:1px solid #d5dbef; border-radius:11px; background:#fff; color:#1e2a5a; font-size:13px; font-weight:800; cursor:pointer;',
              )}
            >
              Bank Portal
            </button>
            <button
              onClick={lc.goShip}
              style={css(
                'flex:1; height:44px; border:1px solid #d5dbef; border-radius:11px; background:#fff; color:#1e2a5a; font-size:13px; font-weight:800; cursor:pointer;',
              )}
            >
              Track shipment
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
