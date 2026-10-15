import { useAcademyViewModel } from '@/features/academy/hooks/useAcademyViewModel';
import { useActions } from '@/hooks/useActions';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

/** Course detail: lesson player, outcomes and the lesson list. */
export function CoursePage() {
  const vm = useAcademyViewModel();
  const h = useActions();
  const { course } = vm;

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <nav
        aria-label="Breadcrumb"
        style={css(
          'display:flex; align-items:center; gap:8px; font-size:13px; color:#5b638a; margin-bottom:18px;',
        )}
      >
        <button
          onClick={h.goAcademy}
          style={css(
            'background:none; border:none; padding:0; font-size:13px; color:#5b638a; cursor:pointer;',
          )}
        >
          ASM Academy
        </button>
        <span>/</span>
        <span style={css('color:#141a2e; font-weight:700;')}>{course.title}</span>
      </nav>

      <div
        className="v2-split"
        style={css('display:grid; grid-template-columns:1fr 340px; gap:30px; align-items:start;')}
      >
        <div>
          {/* lesson player */}
          <div
            style={css(
              'position:relative; overflow:hidden; border-radius:20px; background:' +
                course.grad +
                '; height:380px; display:flex; align-items:center; justify-content:center;',
            )}
          >
            <div
              style={css(
                'position:absolute; inset:0; background:linear-gradient(180deg,rgba(20,26,46,.15),rgba(20,26,46,.7));',
              )}
            />
            <button
              onClick={vm.togglePlay}
              aria-label={vm.playing ? 'Pause lesson' : 'Play lesson'}
              style={css(
                'position:relative; width:78px; height:78px; border-radius:39px; border:none; background:rgba(255,255,255,.92); color:#141a2e; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 30px rgba(0,0,0,.28);',
              )}
            >
              {vm.playing ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="7 4 20 12 7 20" />
                </svg>
              )}
            </button>
            <div style={css('position:absolute; left:22px; right:22px; bottom:20px;')}>
              <div style={css('font-size:16px; font-weight:800; color:#fff;')}>
                {course.currentLesson}
              </div>
              <div
                style={css(
                  'height:5px; border-radius:3px; background:rgba(255,255,255,.28); overflow:hidden; margin-top:11px;',
                )}
              >
                <div style={css('width:' + vm.playPos + '; height:100%; background:#f7dd8e;')} />
              </div>
              <div
                style={css(
                  'display:flex; justify-content:space-between; font-size:11.5px; color:rgba(255,255,255,.7); margin-top:7px;',
                )}
              >
                <span>{vm.playTime}</span>
                <span>{course.lessonLength}</span>
              </div>
            </div>
          </div>

          <h1
            style={css(
              "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:22px 0 0; letter-spacing:-.5px;",
            )}
          >
            {course.title}
          </h1>
          <p style={css('font-size:15.5px; line-height:1.7; color:#3a4160; margin:12px 0 0;')}>
            {course.desc}
          </p>

          <div
            style={css(
              'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin:28px 0 12px;',
            )}
          >
            WHAT YOU WILL LEARN
          </div>
          <div
            className="v2-g2"
            style={css('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}
          >
            {course.outcomes.map((o) => (
              <div
                key={o.v}
                style={css(
                  'display:flex; align-items:flex-start; gap:11px; background:#fff; border:1px solid #e7eaf3; border-radius:14px; padding:15px 17px;',
                )}
              >
                <span
                  style={css(
                    'width:24px; height:24px; border-radius:12px; background:#dcf3e8; color:#16a34a; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <CheckGlyph />
                </span>
                <span style={css('font-size:13.5px; color:#3a4160; line-height:1.5;')}>{o.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* lesson list */}
        <aside className="v2-sticky" style={css('position:sticky; top:96px;')} aria-label="Lessons">
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:20px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
            )}
          >
            <div
              style={css(
                'display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;',
              )}
            >
              <span
                style={css('font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;')}
              >
                LESSONS
              </span>
              <span style={css('font-size:12px; font-weight:800; color:#16a34a;')}>
                {course.progressLabel}
              </span>
            </div>
            <div
              style={css(
                'height:6px; border-radius:3px; background:#eef1f8; overflow:hidden; margin-bottom:14px;',
              )}
            >
              <div
                style={css(
                  'width:' +
                    course.progress +
                    '; height:100%; background:linear-gradient(90deg,#16a34a,#22c55e);',
                )}
              />
            </div>
            {course.lessons.map((l) => (
              <button key={l.i} onClick={l.select} style={css(l.rowStyle)}>
                <span style={css(l.dot)}>
                  {l.done && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span style={css('flex:1; min-width:0;')}>
                  <span
                    style={css(
                      'display:block; font-size:13.5px; font-weight:700; color:' + l.color + ';',
                    )}
                  >
                    {l.title}
                  </span>
                  <span
                    style={css('display:block; font-size:11.5px; color:#a3abc4; margin-top:2px;')}
                  >
                    {l.length}
                  </span>
                </span>
              </button>
            ))}
            <button
              className="v2-btn"
              onClick={vm.completeLesson}
              style={css(
                'width:100%; height:48px; margin-top:14px; border:none; border-radius:12px; background:#16a34a; color:#fff; font-size:14.5px; font-weight:800; cursor:pointer;',
              )}
            >
              Mark lesson complete
            </button>
            {course.canCertify && (
              <button
                onClick={vm.claimCert}
                style={css(
                  'width:100%; height:48px; margin-top:11px; border:1px solid #f0d089; border-radius:12px; background:#fdf7e6; color:#8a6410; font-size:14.5px; font-weight:800; cursor:pointer;',
                )}
              >
                Claim certificate
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
