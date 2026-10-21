import { useEffect } from 'react';
import { useHowItWorksViewModel } from '@/features/howItWorks/hooks/useHowItWorksViewModel';
import { useActions } from '@/hooks/useActions';
import { Icon } from '@/components/common/Icon';
import { css } from '@/utils/css';

/** First-run explainer: a chaptered player plus the four topic cards. */
export function HowItWorksOverlay() {
  const { hiw, hiwTopics, overlayOpen } = useHowItWorksViewModel();
  const h = useActions();

  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') h.closeHiw();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [overlayOpen, h]);

  if (!overlayOpen) return null;

  return (
    <div
      className="v2-ovl"
      role="dialog"
      aria-modal="true"
      aria-label="How Mineral Bridge works"
      style={css(
        'position:fixed; inset:0; z-index:115; background:rgba(11,15,30,.74); backdrop-filter:blur(7px); display:flex; align-items:flex-start; justify-content:center; padding:28px 24px; overflow-y:auto;',
      )}
    >
      <div
        className="v2-card"
        style={css(
          'width:100%; max-width:900px; background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 34px 90px rgba(0,0,0,.5);',
        )}
      >
        {/* player */}
        <div style={css('position:relative; background:#0b0f1e;')}>
          <div style={css('position:relative; height:360px; overflow:hidden;')}>
            <div style={css(hiw.frameStyle)} />
            <div
              style={css(
                'position:absolute; inset:0; background:linear-gradient(180deg,rgba(11,15,30,.16),rgba(11,15,30,.84));',
              )}
            />
            <button
              onClick={h.closeHiw}
              style={css(
                'position:absolute; top:18px; right:18px; height:36px; padding:0 16px; border-radius:18px; border:none; background:rgba(255,255,255,.16); color:#fff; font-size:13px; font-weight:800; cursor:pointer; backdrop-filter:blur(4px);',
              )}
            >
              Skip
            </button>
            <div style={css('position:absolute; left:28px; right:28px; bottom:78px;')}>
              <div
                style={css(
                  'font-size:11px; font-weight:800; letter-spacing:1.3px; color:#f7dd8e;',
                )}
              >
                CHAPTER {hiw.chapterNo} OF 5 · {hiw.chapterTitle}
              </div>
              <div
                style={css(
                  "font-family:'Poppins'; font-size:23px; font-weight:800; color:#fff; margin-top:8px; max-width:560px; line-height:1.25;",
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
                  'position:absolute; top:44%; left:50%; transform:translate(-50%,-50%); width:74px; height:74px; border-radius:37px; border:none; background:rgba(255,255,255,.93); color:#141a2e; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 34px rgba(0,0,0,.34);',
                )}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="7 4 20 12 7 20" />
                </svg>
              </button>
            )}
          </div>

          <div style={css('padding:0 22px 18px;')}>
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
                'position:relative; height:6px; border-radius:3px; background:rgba(255,255,255,.18); cursor:pointer; margin-bottom:13px;',
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
            <div style={css('display:flex; align-items:center; gap:14px;')}>
              <button
                onClick={hiw.play}
                aria-label={hiw.playing ? 'Pause' : 'Play'}
                style={css(
                  'width:40px; height:40px; border-radius:20px; border:none; background:rgba(255,255,255,.14); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                )}
              >
                {hiw.playing ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="7 4 20 12 7 20" />
                  </svg>
                )}
              </button>
              <span
                style={css(
                  'font-size:12.5px; font-weight:700; color:rgba(255,255,255,.8); font-variant-numeric:tabular-nums;',
                )}
              >
                {hiw.clock}
              </span>
              <div style={css('flex:1; display:flex; gap:6px; justify-content:flex-end;')}>
                {hiw.chapters.map((c) => (
                  <button key={c.label} onClick={c.select} style={css(c.style)}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* body */}
        <div style={css('padding:26px 30px 30px;')}>
          <h2
            style={css(
              "font-family:'Poppins'; font-size:24px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
            )}
          >
            How Mineral Bridge works
          </h2>
          <p style={css('font-size:14.5px; color:#6b7290; margin:8px 0 20px; line-height:1.6;')}>
            We sit in the middle of the bridge — we buy minerals from verified sellers, assay and assure them, then sell them on to buyers.
          </p>
          <div
            className="v2-g2"
            style={css('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}
          >
            {hiwTopics.map((t) => (
              <div
                key={t.k}
                style={css(
                  'display:flex; align-items:flex-start; gap:13px; background:#fff; border:1px solid #e7eaf3; border-radius:15px; padding:16px 17px;',
                )}
              >
                <span
                  style={css(
                    'width:40px; height:40px; border-radius:12px; background:' +
                      t.bg +
                      '; color:' +
                      t.color +
                      '; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <Icon name={t.ic} size={23} />
                </span>
                <span style={css('min-width:0;')}>
                  <span
                    style={css('display:block; font-size:14.5px; font-weight:800; color:#141a2e;')}
                  >
                    {t.title}
                  </span>
                  <span
                    style={css(
                      'display:block; font-size:12.5px; color:#6b7290; margin-top:3px; line-height:1.5;',
                    )}
                  >
                    {t.sub}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div style={css('display:flex; gap:12px; margin-top:24px; flex-wrap:wrap;')}>
            <button
              className="v2-btn"
              onClick={h.exploreMarketplace}
              style={css(
                'flex:1; min-width:200px; height:54px; border:none; border-radius:14px; background:#1e2a5a; color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;',
              )}
            >
              Explore the marketplace
            </button>
            <button
              onClick={h.hiwFullPage}
              style={css(
                'height:54px; padding:0 24px; border:1px solid #d5dbef; border-radius:14px; background:#fff; color:#1e2a5a; font-size:14.5px; font-weight:800; cursor:pointer;',
              )}
            >
              Read in detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
