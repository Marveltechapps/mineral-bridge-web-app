import { useBankViewModel } from '@/features/trade/hooks/useBankViewModel';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const CARD =
  'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05);';
const GRID = 'grid-template-columns:1.1fr 1.7fr .9fr .8fr 2fr; gap:14px;';
const COL_LABEL = 'font-size:11px; font-weight:800; letter-spacing:.7px; color:#8b95b4;';
const PANEL_LABEL =
  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin-bottom:6px;';
const DETAIL_ROW =
  'display:flex; justify-content:space-between; gap:14px; padding:12px 0; border-bottom:1px solid #f0f2f8;';

/** Bank Portal: the issuing bank's LC book and document examination desk. */
export function BankPage() {
  const bank = useBankViewModel();

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
            Bank Portal
          </h1>
          <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>
            Standard Bank of South Africa · Trade Finance desk
          </p>
        </div>
        <span
          style={css(
            'display:inline-block; font-size:10.5px; font-weight:800; letter-spacing:.6px; padding:6px 12px; border-radius:8px; background:#141a2e; color:#f7dd8e;',
          )}
        >
          BANK VIEW
        </span>
      </div>

      <div style={css('display:flex; gap:6px; border-bottom:1px solid #e7eaf3; margin:22px 0 20px;')}>
        {bank.tabs.map((t) => (
          <button key={t.k} onClick={t.select} style={css(t.style)}>
            {t.label}
          </button>
        ))}
      </div>

      {bank.isApps && (
        <div style={css(CARD + ' overflow-x:auto;')}>
          <div style={css('min-width:860px;')}>
            <div
              style={css(
                'display:grid; ' +
                  GRID +
                  ' padding:14px 22px; background:#f9fafd; border-bottom:1px solid #eef1f8;',
              )}
            >
              <span style={css(COL_LABEL)}>LC NUMBER</span>
              <span style={css(COL_LABEL)}>APPLICANT → BENEFICIARY</span>
              <span style={css(COL_LABEL)}>AMOUNT</span>
              <span style={css(COL_LABEL)}>STATUS</span>
              <span style={css(COL_LABEL)}>ACTIONS</span>
            </div>
            {bank.rows.map((r) => (
              <div
                key={r.id}
                style={css(
                  'display:grid; ' +
                    GRID +
                    ' align-items:center; padding:15px 22px; border-bottom:1px solid #f2f4fa;',
                )}
              >
                <span style={css('font-size:14px; font-weight:800; color:#141a2e;')}>{r.id}</span>
                <span style={css('min-width:0;')}>
                  <span
                    style={css('display:block; font-size:13.5px; font-weight:700; color:#141a2e;')}
                  >
                    {r.app}
                  </span>
                  <span
                    style={css('display:block; font-size:12px; color:#6b7290; margin-top:1px;')}
                  >
                    → {r.ben}
                  </span>
                </span>
                <span style={css('font-size:13.5px; font-weight:800; color:#141a2e;')}>
                  {r.amount}
                </span>
                <span style={css(r.chip)}>{r.status}</span>
                <span style={css('display:flex; gap:6px; flex-wrap:wrap;')}>
                  {r.actions.map((a) => (
                    <button key={a.label} onClick={a.go} disabled={a.blocked} style={css(a.style)}>
                      {a.label}
                    </button>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {bank.isExam && bank.examEmpty && (
        <div style={css(CARD + ' padding:56px 24px; text-align:center;')}>
          <div style={css('font-size:16px; font-weight:800; color:#141a2e;')}>
            No documents presented yet
          </div>
          <div style={css('font-size:13.5px; color:#6b7290; margin-top:6px;')}>
            The beneficiary presents documents for LC-2026-0419 from the LC Workspace.
          </div>
          <button
            onClick={bank.goLc}
            style={css(
              'height:46px; margin-top:18px; padding:0 22px; border:1px solid #d5dbef; border-radius:11px; background:#fff; color:#1e2a5a; font-size:14px; font-weight:800; cursor:pointer;',
            )}
          >
            Open LC Workspace
          </button>
        </div>
      )}

      {bank.isExam && bank.examReady && (
        <>
          <div
            className="v2-split"
            style={css(
              'display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:20px; align-items:start;',
            )}
          >
            <div style={css(CARD + ' padding:22px;')}>
              <div style={css(PANEL_LABEL)}>LC TERMS · LC-2026-0419</div>
              {bank.terms.map((t) => (
                <div key={t.k} style={css(DETAIL_ROW)}>
                  <span style={css('font-size:13px; color:#6b7290;')}>{t.k}</span>
                  <span
                    style={css('font-size:13px; font-weight:800; color:#141a2e; text-align:right;')}
                  >
                    {t.v}
                  </span>
                </div>
              ))}
            </div>

            <div style={css(CARD + ' padding:22px;')}>
              <div style={css(PANEL_LABEL)}>PRESENTED DOCUMENTS</div>
              {bank.docs.map((d) => (
                <div
                  key={d.k}
                  style={css(
                    'display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #f0f2f8;',
                  )}
                >
                  <span style={css(d.mark)}>
                    {d.ok ? <CheckGlyph strokeWidth={3.2} /> : '!'}
                  </span>
                  <span style={css('flex:1; min-width:0;')}>
                    <span
                      style={css('display:block; font-size:13.5px; font-weight:800; color:#141a2e;')}
                    >
                      {d.name}
                    </span>
                    <span
                      style={css(
                        'display:block; font-size:12px; color:' + d.valColor + '; margin-top:1px;',
                      )}
                    >
                      {d.val}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={css(
              CARD +
                ' padding:18px 22px; margin-top:20px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;',
            )}
          >
            <span style={css(bank.sumDot)} />
            <span
              style={css(
                'flex:1; min-width:220px; font-size:14.5px; font-weight:800; color:#141a2e;',
              )}
            >
              {bank.summary}
            </span>
            <button onClick={bank.refuse} disabled={bank.refuseBlocked} style={css(bank.refuseStyle)}>
              Refuse
            </button>
            <button
              className="v2-btn"
              onClick={bank.accept}
              disabled={bank.acceptBlocked}
              style={css(bank.acceptStyle)}
            >
              Accept
            </button>
            <button
              className="v2-btn"
              onClick={bank.release}
              disabled={bank.releaseBlocked}
              style={css(bank.releaseStyle)}
            >
              Release payment
            </button>
          </div>

          {bank.hasResult && (
            <div style={css(bank.resultStyle)}>
              <div style={css('font-size:15px; font-weight:800; color:#141a2e;')}>
                {bank.resultTitle}
              </div>
              <div style={css('font-size:13px; color:#3a4160; margin-top:4px; line-height:1.5;')}>
                {bank.resultBody}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
