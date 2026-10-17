import { usePassportViewModel } from '@/features/passport/hooks/usePassportViewModel';
import { ChainGlyph, CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const VERIFIED_PILL =
  'display:inline-flex; align-items:center; gap:6px; background:#dcf3e8; color:#15803d; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 10px; border-radius:8px; white-space:nowrap;';

/** Mineral Passport lookup section on the home screen. */
export function PassportPanel() {
  const passport = usePassportViewModel();

  return (
    <section style={css('max-width:1440px; margin:0 auto; padding:52px 32px 0;')}>
      <div
        className="v2-split"
        style={css(
          'display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:30px; align-items:center; background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); padding:34px 36px;',
        )}
      >
        <div>
          <span style={css(VERIFIED_PILL)}>
            <ChainGlyph />
            VERIFIED ON BLOCKCHAIN
          </span>
          <h2
            style={css(
              "font-family:'Poppins'; font-size:26px; font-weight:800; color:#141a2e; margin:14px 0 0; letter-spacing:-.4px;",
            )}
          >
            Verify a Mineral Passport
          </h2>
          <p style={css('font-size:14.5px; color:#6b7290; margin:8px 0 18px; line-height:1.6;')}>
            Every assured lot carries a Mineral Passport recorded on-chain. Enter its ID to check origin, assay and custody history.
          </p>
          <div style={css('display:flex; gap:10px; flex-wrap:wrap;')}>
            <input
              value={passport.q}
              onChange={passport.onQ}
              placeholder="e.g. MBP-2026-0419-AU"
              aria-label="Mineral Passport ID"
              style={css(
                'flex:1; min-width:200px; height:50px; border:1px solid #dde2f0; border-radius:12px; padding:0 15px; font-size:14.5px; color:#141a2e; outline:none; text-transform:uppercase;',
              )}
            />
            <button
              className="v2-btn"
              onClick={passport.verify}
              style={css(
                'height:50px; padding:0 24px; border:none; border-radius:12px; background:#1e2a5a; color:#fff; font-size:14.5px; font-weight:800; cursor:pointer;',
              )}
            >
              Verify
            </button>
          </div>
          {passport.showDemo && (
            <button
              onClick={passport.tryDemo}
              style={css(
                'background:none; border:none; padding:0; margin-top:11px; font-size:12.5px; font-weight:700; color:#1e2a5a; cursor:pointer; text-decoration:underline;',
              )}
            >
              Try MBP-2026-0419-AU
            </button>
          )}
        </div>

        <div
          style={css(
            'background:#f9fafd; border:1px solid #eef1f8; border-radius:16px; padding:22px; min-height:220px;',
          )}
        >
          {passport.idle && (
            <>
              <div
                style={css(
                  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;',
                )}
              >
                WHAT A PASSPORT PROVES
              </div>
              <div
                style={css('display:flex; flex-direction:column; gap:11px; margin-top:14px;')}
              >
                {passport.proves.map((p) => (
                  <span
                    key={p.v}
                    style={css(
                      'display:flex; align-items:center; gap:10px; font-size:13.5px; color:#3a4160;',
                    )}
                  >
                    <span style={css('color:#16a34a;')}>
                      <CheckGlyph />
                    </span>
                    {p.v}
                  </span>
                ))}
              </div>
            </>
          )}

          {passport.found && (
            <>
              <div
                style={css(
                  'display:flex; align-items:center; justify-content:space-between; gap:10px;',
                )}
              >
                <span style={css('font-size:15px; font-weight:800; color:#141a2e;')}>
                  {passport.id}
                </span>
                <span style={css(VERIFIED_PILL)}>
                  <ChainGlyph />
                  VERIFIED ON BLOCKCHAIN
                </span>
              </div>
              <div style={css('margin-top:8px;')}>
                {passport.rows.map((r) => (
                  <div
                    key={r.k}
                    style={css(
                      'display:flex; justify-content:space-between; gap:14px; padding:12px 0; border-bottom:1px solid #f0f2f8;',
                    )}
                  >
                    <span style={css('font-size:13px; color:#6b7290;')}>{r.k}</span>
                    <span
                      style={css(
                        'font-size:13px; font-weight:800; color:#141a2e; text-align:right;',
                      )}
                    >
                      {r.v}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {passport.notFound && (
            <>
              <div style={css('font-size:15px; font-weight:800; color:#141a2e;')}>
                No passport found
              </div>
              <div
                style={css('font-size:13.5px; color:#6b7290; margin-top:6px; line-height:1.55;')}
              >
                We couldn&apos;t find &quot;{passport.id}&quot; on-chain. Check the ID printed on the lot&apos;s seal or certificate.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
