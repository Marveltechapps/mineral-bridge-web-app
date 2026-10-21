import { useShipmentViewModel } from '@/features/trade/hooks/useShipmentViewModel';
import { ChainGlyph, CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const SECTION_LABEL =
  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin-bottom:12px;';
const VERIFIED_PILL =
  'display:inline-flex; align-items:center; gap:6px; background:#dcf3e8; color:#15803d; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 10px; border-radius:8px; white-space:nowrap;';

/** Shipment Tracking: route header, custody timeline and consignment details. */
export function ShipmentPage() {
  const ship = useShipmentViewModel();

  if (!ship.hasShipment) {
    return (
      <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
        <h1
          style={css(
            "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
          )}
        >
          Shipment Tracking
        </h1>
        <p style={css('font-size:14px; color:#6b7290; margin:6px 0 22px;')}>
          Location, carrier and the current leg of an open shipment.
        </p>
        <div
          style={css(
            'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:36px 28px;',
          )}
        >
          <h2 style={css("font-family:'Poppins'; font-size:20px; margin:0; color:#141a2e;")}>
            No shipment is in progress
          </h2>
          <p style={css('font-size:14px; color:#6b7290; margin:8px 0 0;')}>
            Tracking appears here once a signed trade is handed to a carrier.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <div
        style={css(
          'position:relative; overflow:hidden; border-radius:20px; background:linear-gradient(115deg,#141a2e,#1e2a5a 65%,#3a2c14 140%); padding:28px 32px; color:#fff;',
        )}
      >
        <div style={css('display:flex; align-items:center; gap:14px; flex-wrap:wrap;')}>
          <div style={css('flex:1; min-width:0;')}>
            <div
              style={css('font-size:11.5px; font-weight:800; letter-spacing:1.2px; color:#f7dd8e;')}
            >
              SHIPMENT TRACKING
            </div>
            <div
              style={css(
                "font-family:'Poppins'; font-size:25px; font-weight:800; margin-top:6px; letter-spacing:-.5px;",
              )}
            >
              {ship.lot}
            </div>
            <div style={css('font-size:13px; color:rgba(255,255,255,.7); margin-top:4px;')}>
              {ship.ref}
            </div>
          </div>
          <span
            style={css(
              'display:inline-flex; align-items:center; gap:6px; background:rgba(127,227,161,.14); border:1px solid rgba(127,227,161,.35); color:#7fe3a1; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:6px 11px; border-radius:8px;',
            )}
          >
            <ChainGlyph />
            VERIFIED ON BLOCKCHAIN
          </span>
        </div>

        <div style={css('display:flex; align-items:center; gap:16px; margin-top:24px;')}>
          <div>
            <div style={css('font-size:15px; font-weight:800;')}>{ship.from}</div>
            <div style={css('font-size:12px; color:rgba(255,255,255,.6);')}>
              Departed {ship.departed}
            </div>
          </div>
          <div
            style={css(
              'flex:1; height:6px; border-radius:3px; background:rgba(255,255,255,.16); overflow:hidden;',
            )}
          >
            <div
              style={css(
                'width:' +
                  ship.progress +
                  '; height:100%; background:linear-gradient(90deg,#f7dd8e,#c8962f);',
              )}
            />
          </div>
          <div style={css('text-align:right;')}>
            <div style={css('font-size:15px; font-weight:800;')}>{ship.to}</div>
            <div style={css('font-size:12px; color:rgba(255,255,255,.6);')}>ETA {ship.eta}</div>
          </div>
        </div>
      </div>

      <div
        className="v2-split"
        style={css(
          'display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:28px; align-items:start; margin-top:26px;',
        )}
      >
        <div>
          <div style={css(SECTION_LABEL)}>CUSTODY TIMELINE</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); padding:26px 28px;',
            )}
          >
            {ship.events.map((e) => (
              <div key={e.title} style={css('display:flex; gap:18px;')}>
                <div style={css('display:flex; flex-direction:column; align-items:center;')}>
                  <span style={css(e.dot)}>{e.done && <CheckGlyph strokeWidth={3.2} />}</span>
                  {e.hasLine && <span style={css(e.line)} />}
                </div>
                <div style={css('padding-bottom:22px; flex:1; min-width:0;')}>
                  <div style={css('display:flex; align-items:center; gap:10px; flex-wrap:wrap;')}>
                    <span style={css('font-size:15px; font-weight:800; color:' + e.color + ';')}>
                      {e.title}
                    </span>
                    {e.current && (
                      <span
                        style={css(
                          'font-size:10.5px; font-weight:800; letter-spacing:.6px; color:#1d4ed8; background:#dbeafe; padding:4px 10px; border-radius:8px;',
                        )}
                      >
                        LIVE
                      </span>
                    )}
                  </div>
                  <div style={css('font-size:13px; color:#6b7290; margin-top:3px;')}>
                    {e.who} · {e.where}
                  </div>
                  <div style={css('font-size:12px; color:#8b95b4; margin-top:3px;')}>{e.time}</div>
                  {e.done && (
                    <div
                      style={css(
                        'display:flex; align-items:center; gap:9px; flex-wrap:wrap; margin-top:8px;',
                      )}
                    >
                      <span style={css(VERIFIED_PILL)}>
                        <ChainGlyph />
                        VERIFIED ON BLOCKCHAIN
                      </span>
                      <span style={css('font-size:11.5px; color:#6b7290; font-family:monospace;')}>
                        {e.hash}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="v2-sticky" style={css('position:sticky; top:96px;')}>
          <div style={css(SECTION_LABEL)}>SHIPMENT DETAILS</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); padding:6px 22px;',
            )}
          >
            {ship.details.map((d) => (
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

          <div
            style={css(
              'display:flex; gap:12px; align-items:flex-start; background:#f0f9f4; border:1px solid #c8ead6; border-radius:14px; padding:16px 18px; margin-top:14px;',
            )}
          >
            <span style={css('color:#15803d; flex-shrink:0; margin-top:1px;')}>
              <CheckGlyph strokeWidth={3.2} />
            </span>
            <div>
              <div style={css('font-size:14px; font-weight:800; color:#141a2e;')}>Seal intact</div>
              <div style={css('font-size:12.5px; color:#3a5a46; margin-top:3px; line-height:1.5;')}>
                Seal MB-SEAL-00941 matches the on-chain record at every handover.
              </div>
            </div>
          </div>

          <button
            onClick={ship.openLc}
            style={css(
              'width:100%; height:48px; margin-top:14px; border:1px solid #d5dbef; border-radius:12px; background:#fff; color:#1e2a5a; font-size:14px; font-weight:800; cursor:pointer;',
            )}
          >
            Open LC Workspace
          </button>
        </aside>
      </div>
    </div>
  );
}
