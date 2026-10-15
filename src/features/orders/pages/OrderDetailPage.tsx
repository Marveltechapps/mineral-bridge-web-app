import { useOrderDetailViewModel } from '@/features/orders/hooks/useOrderDetailViewModel';
import { useActions } from '@/hooks/useActions';
import { ChainGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const SECTION_LABEL = 'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;';

const Tick = ({ size = 13, width = 3.4 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Order tracking: pipeline history, live route and the document set. */
export function OrderDetailPage() {
  const { track } = useOrderDetailViewModel();
  const h = useActions();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <nav
        aria-label="Breadcrumb"
        style={css(
          'display:flex; align-items:center; gap:8px; font-size:13px; color:#5b638a; margin-bottom:18px;',
        )}
      >
        <button
          onClick={h.goOrders}
          style={css(
            'background:none; border:none; padding:0; font-size:13px; color:#5b638a; cursor:pointer;',
          )}
        >
          My Orders
        </button>
        <span>/</span>
        <span style={css('color:#141a2e; font-weight:700;')}>{track.id}</span>
      </nav>

      <div
        style={css(
          'position:relative; overflow:hidden; border-radius:20px; background:linear-gradient(115deg,#141a2e,#1e2a5a 65%,#3a2c14 140%); padding:30px 32px; color:#fff;',
        )}
      >
        <div
          style={css(
            'position:absolute; top:-90px; right:-50px; width:320px; height:320px; background:radial-gradient(circle,rgba(243,210,122,.18),transparent 70%);',
          )}
        />
        <div
          style={css('position:relative; display:flex; align-items:center; gap:18px; flex-wrap:wrap;')}
        >
          <span
            style={css(
              'width:56px; height:56px; border-radius:16px; background:' +
                track.grad +
                '; flex-shrink:0;',
            )}
          />
          <div style={css('flex:1; min-width:0;')}>
            <div style={css('display:flex; align-items:center; gap:10px; flex-wrap:wrap;')}>
              <span
                style={css(
                  "font-family:'Poppins'; font-size:24px; font-weight:800; letter-spacing:-.5px;",
                )}
              >
                {track.mineral}
              </span>
              <span style={css(track.sideStyle)}>{track.side}</span>
            </div>
            <div style={css('font-size:13px; color:rgba(255,255,255,.66); margin-top:4px;')}>
              {track.id} · {track.qty} · {track.date}
            </div>
          </div>
          <div style={css('text-align:right;')}>
            <div className="v2-gold" style={css("font-family:'Poppins'; font-size:22px; font-weight:800;")}>
              {track.progress}
            </div>
            <div style={css('font-size:12px; color:rgba(255,255,255,.6);')}>complete</div>
          </div>
        </div>
        <div
          style={css(
            'position:relative; height:8px; border-radius:4px; background:rgba(255,255,255,.14); overflow:hidden; margin-top:22px;',
          )}
        >
          <div
            style={css('width:' + track.progress + '; height:100%; background:' + track.progressBg + ';')}
          />
        </div>
        <div
          style={css(
            'position:relative; font-size:12.5px; font-weight:700; color:' +
              track.stageColor +
              '; margin-top:10px;',
          )}
        >
          Current stage · {track.stage}
        </div>
      </div>

      {track.isRejected && (
        <div
          style={css(
            'display:flex; gap:15px; align-items:flex-start; background:#fdecec; border:1px solid #f3c8c8; border-left:4px solid #dc2626; border-radius:16px; padding:20px 22px; margin-top:22px;',
          )}
        >
          <span
            style={css(
              'width:40px; height:40px; border-radius:20px; background:#fbdada; color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </span>
          <div style={css('flex:1;')}>
            <div style={css('font-size:16px; font-weight:800; color:#141a2e;')}>
              Order rejected at verification
            </div>
            <div style={css('font-size:13.5px; color:#7a3b3b; margin-top:5px; line-height:1.6;')}>
              {track.reason}
            </div>
            <div style={css('display:flex; gap:11px; margin-top:16px; flex-wrap:wrap;')}>
              <button
                className="v2-btn"
                onClick={h.goBuy}
                style={css(
                  'height:44px; padding:0 20px; border:none; border-radius:11px; background:#1e2a5a; color:#fff; font-size:13.5px; font-weight:800; cursor:pointer;',
                )}
              >
                Find a similar lot
              </button>
              <button
                onClick={h.goAccount}
                style={css(
                  'height:44px; padding:0 20px; border:1px solid #e0b4b4; border-radius:11px; background:#fff; color:#b91c1c; font-size:13.5px; font-weight:800; cursor:pointer;',
                )}
              >
                Contact support
              </button>
            </div>
          </div>
        </div>
      )}

      {track.notRejected && (
        <>
          <div style={css(SECTION_LABEL + ' margin:28px 0 12px;')}>LIVE ROUTE</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:26px 28px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
            )}
          >
            <div style={css('display:flex; align-items:center;')}>
              {track.route.map((r) => (
                <div key={r.label} style={css(r.wrap)}>
                  <div style={css('display:flex; align-items:center;')}>
                    <span style={css(r.dot)}>{r.done && <Tick />}</span>
                    {r.hasLine && <span style={css(r.line)} />}
                  </div>
                  <div
                    style={css(
                      'font-size:13px; font-weight:800; color:' + r.color + '; margin-top:11px;',
                    )}
                  >
                    {r.label}
                  </div>
                  <div style={css('font-size:11.5px; color:#8b95b4; margin-top:2px;')}>{r.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div
        className="v2-split"
        style={css(
          'display:grid; grid-template-columns:1fr 386px; gap:28px; align-items:start; margin-top:28px;',
        )}
      >
        <div>
          <div style={css(SECTION_LABEL + ' margin-bottom:12px;')}>{track.pipelineLabel}</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:26px 28px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
            )}
          >
            {track.history.map((hst) => (
              <div key={hst.title} style={css('display:flex; gap:18px;')}>
                <div style={css('display:flex; flex-direction:column; align-items:center;')}>
                  <span style={css(hst.dot)}>{hst.done && <Tick size={14} width={3.2} />}</span>
                  {hst.hasLine && <span style={css(hst.line)} />}
                </div>
                <div style={css('padding-bottom:22px; flex:1;')}>
                  <div style={css('display:flex; align-items:center; gap:10px; flex-wrap:wrap;')}>
                    <span
                      style={css('font-size:15.5px; font-weight:800; color:' + hst.color + ';')}
                    >
                      {hst.title}
                    </span>
                    {hst.current && (
                      <span
                        style={css(
                          'font-size:10.5px; font-weight:800; letter-spacing:.6px; color:#b45309; background:#fdecd6; padding:4px 10px; border-radius:8px;',
                        )}
                      >
                        CURRENT
                      </span>
                    )}
                    {hst.terminated && (
                      <span
                        style={css(
                          'font-size:10.5px; font-weight:800; letter-spacing:.6px; color:#dc2626; background:#fdecec; padding:4px 10px; border-radius:8px;',
                        )}
                      >
                        REJECTED HERE
                      </span>
                    )}
                  </div>
                  <div
                    style={css('font-size:13.5px; color:#6b7290; margin-top:4px; line-height:1.5;')}
                  >
                    {hst.sub}
                  </div>
                  {hst.time && (
                    <div style={css('font-size:12px; color:#a3abc4; margin-top:5px;')}>
                      {hst.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="v2-sticky" style={css('position:sticky; top:96px;')} aria-label="Documents">
          <div style={css(SECTION_LABEL + ' margin-bottom:12px;')}>DOCUMENTS</div>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:14px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
            )}
          >
            {track.docs.map((d) => (
              <button
                key={d.name}
                className="v2-row"
                onClick={d.download}
                style={css(
                  'display:flex; align-items:center; gap:13px; width:100%; padding:14px; border:none; background:none; border-radius:12px; cursor:' +
                    d.cursor +
                    '; text-align:left;',
                )}
              >
                <span
                  style={css(
                    'width:38px; height:38px; border-radius:11px; background:' +
                      d.bg +
                      '; color:' +
                      d.color +
                      '; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <span style={css('flex:1; min-width:0;')}>
                  <span style={css('display:block; font-size:14px; font-weight:800; color:#141a2e;')}>
                    {d.name}
                  </span>
                  <span style={css('display:block; font-size:12px; color:#8b95b4; margin-top:1px;')}>
                    {d.meta}
                  </span>
                  {d.ready && (
                    <span style={css('display:block; margin-top:6px;')}>
                      <span
                        style={css(
                          'display:inline-flex; align-items:center; gap:6px; background:#dcf3e8; color:#15803d; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 10px; border-radius:8px; white-space:nowrap;',
                        )}
                      >
                        <ChainGlyph />
                        VERIFIED ON BLOCKCHAIN
                      </span>
                    </span>
                  )}
                </span>
                {d.ready && (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1e2a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={h.goAccount}
            style={css(
              'width:100%; height:48px; margin-top:14px; border:1px solid #d5dbef; border-radius:12px; background:#fff; color:#1e2a5a; font-size:14px; font-weight:800; cursor:pointer;',
            )}
          >
            Contact support
          </button>
        </aside>
      </div>
    </div>
  );
}
