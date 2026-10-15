import { useHowItWorksViewModel } from '@/features/howItWorks/hooks/useHowItWorksViewModel';
import { useActions } from '@/hooks/useActions';
import { Icon } from '@/components/common/Icon';
import { css } from '@/utils/css';

/** The full "How Mineral Bridge works" article, with player and topic accordions. */
export function HowItWorksPage() {
  const { hiw, hiwTopics } = useHowItWorksViewModel();
  const h = useActions();

  return (
    <div style={css('max-width:1080px; margin:0 auto; padding:32px 32px 72px;')}>
      <div
        style={css(
          'display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap;',
        )}
      >
        <h1
          style={css(
            "font-family:'Poppins'; font-size:32px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.7px;",
          )}
        >
          How Mineral Bridge works
        </h1>
        <button
          onClick={h.goHowItWorks}
          style={css(
            'height:44px; padding:0 20px; border:1px solid #d5dbef; border-radius:12px; background:#fff; color:#1e2a5a; font-size:13.5px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:9px; flex-shrink:0;',
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Replay intro
        </button>
      </div>
      <p
        style={css(
          'font-size:15.5px; color:#6b7290; margin:9px 0 24px; max-width:660px; line-height:1.6;',
        )}
      >
        We sit in the middle of the bridge: we buy minerals from verified sellers, assay and assure them, then sell them on to buyers. Here&apos;s the whole journey in 47 seconds.
      </p>

      {/* video player */}
      <div
        style={css(
          'position:relative; overflow:hidden; border-radius:22px; background:#0b0f1e; box-shadow:0 20px 50px rgba(11,15,30,.3);',
        )}
      >
        <div style={css('position:relative; height:440px; overflow:hidden;')}>
          <div style={css(hiw.frameStyle)} />
          <div
            style={css(
              'position:absolute; inset:0; background:linear-gradient(180deg,rgba(11,15,30,.18),rgba(11,15,30,.82));',
            )}
          />
          <div style={css('position:absolute; left:30px; right:30px; bottom:86px;')}>
            <div
              style={css('font-size:11.5px; font-weight:800; letter-spacing:1.3px; color:#f7dd8e;')}
            >
              CHAPTER {hiw.chapterNo} · {hiw.chapterTitle}
            </div>
            <div
              style={css(
                "font-family:'Poppins'; font-size:26px; font-weight:800; color:#fff; margin-top:9px; max-width:620px; line-height:1.25;",
              )}
            >
              {hiw.caption}
            </div>
          </div>
          {hiw.showBigPlay && (
            <button
              onClick={hiw.play}
              aria-label="Play"
              style={css(
                'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:82px; height:82px; border-radius:41px; border:none; background:rgba(255,255,255,.93); color:#141a2e; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 34px rgba(0,0,0,.34);',
              )}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="7 4 20 12 7 20" />
              </svg>
            </button>
          )}
        </div>

        {/* controls */}
        <div style={css('padding:0 24px 20px;')}>
          <div
            onClick={hiw.seek}
            role="slider"
            tabIndex={0}
            aria-label="Chapter position"
            aria-valuenow={Number(hiw.pos.replace('%', ''))}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                e.preventDefault();
                hiw.seek();
              }
            }}
            style={css(
              'position:relative; height:6px; border-radius:3px; background:rgba(255,255,255,.18); cursor:pointer; margin-bottom:14px;',
            )}
          >
            <div
              style={css(
                'width:' +
                  hiw.pos +
                  '; height:100%; border-radius:3px; background:linear-gradient(90deg,#f7dd8e,#c8962f);',
              )}
            />
            <div
              style={css(
                'position:absolute; top:-4px; left:' +
                  hiw.pos +
                  '; width:14px; height:14px; margin-left:-7px; border-radius:7px; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,.4);',
              )}
            />
          </div>
          <div style={css('display:flex; align-items:center; gap:16px;')}>
            <button
              onClick={hiw.play}
              aria-label={hiw.playing ? 'Pause' : 'Play'}
              style={css(
                'width:42px; height:42px; border-radius:21px; border:none; background:rgba(255,255,255,.14); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
              )}
            >
              {hiw.playing ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="7 4 20 12 7 20" />
                </svg>
              )}
            </button>
            <span
              style={css(
                'font-size:13px; font-weight:700; color:rgba(255,255,255,.8); font-variant-numeric:tabular-nums;',
              )}
            >
              {hiw.clock}
            </span>
            <div
              style={css('flex:1; display:flex; gap:7px; flex-wrap:wrap; justify-content:flex-end;')}
            >
              {hiw.chapters.map((c) => (
                <button key={c.label} onClick={c.select} style={css(c.style)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* topic cards */}
      <div
        style={css(
          'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin:34px 0 14px;',
        )}
      >
        EXPLORE IN DETAIL
      </div>
      <div style={css('display:flex; flex-direction:column; gap:14px;')}>
        {hiwTopics.map((t) => (
          <div key={t.k} style={css(t.cardStyle)}>
            <button
              onClick={t.toggle}
              aria-expanded={t.open}
              style={css(
                'display:flex; align-items:center; gap:16px; width:100%; padding:22px 24px; border:none; background:none; cursor:pointer; text-align:left;',
              )}
            >
              <span
                style={css(
                  'width:48px; height:48px; border-radius:14px; background:' +
                    t.bg +
                    '; color:' +
                    t.color +
                    '; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                )}
              >
                <Icon name={t.ic} size={23} />
              </span>
              <span style={css('flex:1; min-width:0;')}>
                <span
                  style={css(
                    "display:block; font-family:'Poppins'; font-size:18px; font-weight:800; color:#141a2e;",
                  )}
                >
                  {t.title}
                </span>
                <span
                  style={css('display:block; font-size:13.5px; color:#6b7290; margin-top:3px;')}
                >
                  {t.sub}
                </span>
              </span>
              <span style={css(t.caret)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8b95b4"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            {t.open && (
              <div style={css('padding:0 24px 24px 88px;')}>
                {t.points.map((p) => (
                  <div
                    key={p.n}
                    style={css('display:flex; align-items:flex-start; gap:12px; padding:9px 0;')}
                  >
                    <span
                      style={css(
                        'width:22px; height:22px; border-radius:11px; background:' +
                          t.bg +
                          '; color:' +
                          t.color +
                          '; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;',
                      )}
                    >
                      {p.n}
                    </span>
                    <span style={css('font-size:14.5px; color:#3a4160; line-height:1.6;')}>
                      {p.v}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
