import { useNegotiationViewModel } from '@/features/trade/hooks/useNegotiationViewModel';
import { ChainGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const AVATAR =
  'width:40px; height:40px; border-radius:20px; background:#141a2e; color:#f7dd8e; font-size:13px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0;';
const FIELD_LABEL = 'font-size:10.5px; font-weight:800; letter-spacing:.6px; color:#8b95b4;';
const FIELD_VALUE = 'font-size:13.5px; font-weight:700; color:#141a2e; margin-top:2px;';

/** Negotiation Room: conversations, offer cards and the contract summary. */
export function NegotiationPage() {
  const neg = useNegotiationViewModel();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <h1
        style={css(
          "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
        )}
      >
        Negotiation Room
      </h1>
      <p style={css('font-size:14px; color:#6b7290; margin:6px 0 22px;')}>
        Agree terms with verified counterparties, then turn them into a signed contract.
      </p>

      <div
        className="v2-split"
        style={css(
          'display:grid; grid-template-columns:280px minmax(0,1fr) 330px; gap:20px; align-items:start;',
        )}
      >
        <aside
          aria-label="Conversations"
          style={css(
            'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); overflow:hidden;',
          )}
        >
          <div
            style={css(
              'padding:16px 18px; border-bottom:1px solid #eef1f8; font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;',
            )}
          >
            CONVERSATIONS
          </div>
          {neg.convs.map((c) => (
            <button key={c.id} onClick={c.select} style={css(c.style)}>
              <span style={css(AVATAR)}>{c.initials}</span>
              <span style={css('flex:1; min-width:0; text-align:left;')}>
                <span style={css('display:block; font-size:14px; font-weight:800; color:#141a2e;')}>
                  {c.party}
                </span>
                <span style={css('display:block; font-size:12px; color:#6b7290; margin-top:2px;')}>
                  {c.lot}
                </span>
                <span style={css(c.chip)}>{c.status}</span>
              </span>
            </button>
          ))}
        </aside>

        <section
          style={css(
            'background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); overflow:hidden; display:flex; flex-direction:column; height:660px;',
          )}
        >
          <div
            style={css(
              'display:flex; align-items:center; gap:13px; padding:16px 20px; border-bottom:1px solid #eef1f8; flex-wrap:wrap;',
            )}
          >
            <span style={css(AVATAR)}>{neg.conv.initials}</span>
            <div style={css('flex:1; min-width:0;')}>
              <div style={css('font-size:15.5px; font-weight:800; color:#141a2e;')}>
                {neg.conv.party}
              </div>
              <div style={css('font-size:12.5px; color:#6b7290; margin-top:2px;')}>
                {neg.conv.lot} · {neg.conv.grade}
              </div>
            </div>
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
              'flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:14px; background:#f9fafd;',
            )}
          >
            {neg.msgs.map((m) => (
              <div key={m.key} style={css(m.wrap)}>
                {m.isSystem && (
                  <span
                    style={css(
                      'font-size:12px; font-weight:700; color:#15803d; background:#dcf3e8; padding:7px 14px; border-radius:20px;',
                    )}
                  >
                    {m.text}
                  </span>
                )}
                {m.isText && (
                  <div style={css(m.bubble)}>
                    {m.text}
                    <div style={css('font-size:11px; margin-top:5px; color:' + m.timeColor + ';')}>
                      {m.time}
                    </div>
                  </div>
                )}
                {m.isOffer && (
                  <div style={css(m.cardStyle)}>
                    <div
                      style={css(
                        'display:flex; align-items:center; justify-content:space-between; gap:10px; padding:11px 16px; background:#f4f5f9; border-bottom:1px solid #eef1f8;',
                      )}
                    >
                      <span
                        style={css(
                          'font-size:11px; font-weight:800; letter-spacing:.7px; color:#5b638a;',
                        )}
                      >
                        {m.from}
                      </span>
                      <span style={css(m.statusStyle)}>{m.statusLabel}</span>
                    </div>
                    <div style={css('padding:14px 16px;')}>
                      <div
                        style={css(
                          "font-family:'Poppins'; font-size:21px; font-weight:800; color:#141a2e;",
                        )}
                      >
                        {m.price}
                      </div>
                      <div
                        style={css(
                          'display:grid; grid-template-columns:1fr 1fr; gap:10px 16px; margin-top:11px;',
                        )}
                      >
                        <div>
                          <div style={css(FIELD_LABEL)}>QUANTITY</div>
                          <div style={css(FIELD_VALUE)}>{m.qty}</div>
                        </div>
                        <div>
                          <div style={css(FIELD_LABEL)}>INCOTERM</div>
                          <div style={css(FIELD_VALUE)}>{m.inc}</div>
                        </div>
                        <div>
                          <div style={css(FIELD_LABEL)}>SHIPMENT</div>
                          <div style={css(FIELD_VALUE)}>{m.win}</div>
                        </div>
                        <div>
                          <div style={css(FIELD_LABEL)}>TOTAL</div>
                          <div style={css(FIELD_VALUE)}>{m.total}</div>
                        </div>
                      </div>
                      {m.canAct && (
                        <div style={css('display:flex; gap:9px; margin-top:14px;')}>
                          <button
                            className="v2-btn"
                            onClick={m.accept}
                            style={css(
                              'flex:1; height:40px; border:none; border-radius:10px; background:#16a34a; color:#fff; font-size:13px; font-weight:800; cursor:pointer;',
                            )}
                          >
                            Accept
                          </button>
                          <button
                            onClick={m.counter}
                            style={css(
                              'flex:1; height:40px; border:1px solid #d5dbef; border-radius:10px; background:#fff; color:#1e2a5a; font-size:13px; font-weight:800; cursor:pointer;',
                            )}
                          >
                            Counter
                          </button>
                        </div>
                      )}
                      <div style={css('font-size:11px; color:#8b95b4; margin-top:10px;')}>
                        {m.time}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={css(
              'display:flex; align-items:center; gap:10px; padding:14px 16px; border-top:1px solid #eef1f8;',
            )}
          >
            <input
              value={neg.draft}
              onChange={neg.onDraft}
              onKeyDown={(e) => {
                if (e.key === 'Enter') neg.send();
              }}
              placeholder="Write a message…"
              aria-label="Message"
              style={css(
                'flex:1; min-width:0; height:46px; border:1px solid #dde2f0; border-radius:12px; padding:0 14px; font-size:14px; color:#141a2e; outline:none;',
              )}
            />
            <button onClick={neg.makeOffer} disabled={neg.offerBlocked} style={css(neg.offerStyle)}>
              Counter-offer
            </button>
            <button
              className="v2-btn"
              onClick={neg.send}
              style={css(
                'height:46px; padding:0 20px; border:none; border-radius:12px; background:#1e2a5a; color:#fff; font-size:13.5px; font-weight:800; cursor:pointer;',
              )}
            >
              Send
            </button>
          </div>
        </section>

        <aside
          className="v2-sticky"
          aria-label="Contract summary"
          style={css(
            'position:sticky; top:96px; background:#fff; border:1px solid #e7eaf3; border-radius:18px; box-shadow:0 4px 14px rgba(20,26,46,.05); padding:22px;',
          )}
        >
          <div
            style={css('display:flex; align-items:center; justify-content:space-between; gap:10px;')}
          >
            <span
              style={css('font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;')}
            >
              CONTRACT SUMMARY
            </span>
            <span style={css(neg.sum.statusStyle)}>{neg.sum.statusLabel}</span>
          </div>
          <div style={css('font-size:16px; font-weight:800; color:#141a2e; margin-top:14px;')}>
            {neg.sum.lot}
          </div>
          <div style={css('font-size:12.5px; color:#6b7290; margin-top:3px;')}>
            Seller · {neg.sum.party}
          </div>
          <div style={css('margin-top:12px; border-top:1px solid #f0f2f8;')}>
            {neg.sum.rows.map((r) => (
              <div
                key={r.k}
                style={css(
                  'display:flex; justify-content:space-between; gap:14px; padding:12px 0; border-bottom:1px solid #f0f2f8;',
                )}
              >
                <span style={css('font-size:13px; color:#6b7290;')}>{r.k}</span>
                <span
                  style={css('font-size:13px; font-weight:800; color:#141a2e; text-align:right;')}
                >
                  {r.v}
                </span>
              </div>
            ))}
          </div>
          <div
            style={css(
              'display:flex; justify-content:space-between; align-items:baseline; gap:10px; margin-top:14px;',
            )}
          >
            <span style={css('font-size:13.5px; font-weight:800; color:#141a2e;')}>
              Contract value
            </span>
            <span
              style={css("font-family:'Poppins'; font-size:20px; font-weight:800; color:#141a2e;")}
            >
              {neg.sum.total}
            </span>
          </div>
          <div style={css('margin-top:18px; display:flex; flex-direction:column; gap:10px;')}>
            {neg.sum.steps.map((s) => (
              <div key={s.label} style={css('display:flex; align-items:center; gap:10px;')}>
                <span style={css(s.dot)} />
                <span style={css('font-size:13px; font-weight:700; color:' + s.color + ';')}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <button
            className="v2-btn"
            onClick={neg.sum.openContract}
            disabled={neg.sum.notAgreed}
            style={css(neg.sum.ctaStyle)}
          >
            {neg.sum.ctaLabel}
          </button>
          <div style={css('font-size:12px; color:#6b7290; margin-top:10px; line-height:1.5;')}>
            {neg.sum.hint}
          </div>
        </aside>
      </div>
    </div>
  );
}
