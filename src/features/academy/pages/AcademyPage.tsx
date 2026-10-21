import { useAcademyViewModel } from '@/features/academy/hooks/useAcademyViewModel';
import { Icon } from '@/components/common/Icon';
import { css } from '@/utils/css';

/** ASM Academy: free certified training plus platform courses. */
export function AcademyPage() {
  const vm = useAcademyViewModel();

  return (
    <div>
      <section
        style={css(
          "position:relative; overflow:hidden; background:linear-gradient(115deg,rgba(20,26,46,.93),rgba(30,42,90,.84) 62%,rgba(26,77,51,.88) 140%), url('https://commons.wikimedia.org/wiki/Special:FilePath/Gold%20mine.jpg?width=1400') center/cover; color:#fff;",
        )}
      >
        <div
          style={css(
            'position:absolute; top:-110px; right:-70px; width:440px; height:440px; background:radial-gradient(circle,rgba(127,227,161,.16),transparent 68%);',
          )}
        />
        <div
          style={css('position:relative; max-width:1440px; margin:0 auto; padding:56px 32px 60px;')}
        >
          <span
            style={css(
              'display:inline-block; padding:7px 15px; border-radius:9px; background:rgba(127,227,161,.14); border:1px solid rgba(127,227,161,.34); font-size:11.5px; font-weight:800; letter-spacing:1.2px; color:#7fe3a1;',
            )}
          >
            ASM ACADEMY
          </span>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:42px; font-weight:800; line-height:1.08; letter-spacing:-1px; margin:20px 0 0; max-width:640px;",
            )}
          >
            Learn safe mining. Trade with confidence.
          </h1>
          <p
            style={css(
              'font-size:16px; line-height:1.65; color:rgba(255,255,255,.76); max-width:580px; margin:16px 0 0;',
            )}
          >
            Free certified training for artisanal and small-scale miners — plus platform courses on assay, pricing and compliance.
          </p>
          <div style={css('display:flex; gap:34px; margin-top:34px; flex-wrap:wrap;')}>
            {vm.academyStats.map((s) => (
              <div key={s.label}>
                <div
                  className="v2-gold"
                  style={css("font-family:'Poppins'; font-size:26px; font-weight:800;")}
                >
                  {s.value}
                </div>
                <div
                  style={css('font-size:12.5px; color:rgba(255,255,255,.6); margin-top:3px;')}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={css('max-width:1440px; margin:0 auto; padding:34px 32px 0;')}>
        <div style={css('display:flex; gap:8px; margin-bottom:22px; flex-wrap:wrap;')}>
          {vm.academyTracks.map((t) => (
            <button key={t.k} className="v2-chip" onClick={t.select} style={css(t.style)}>
              {t.label}
            </button>
          ))}
        </div>
        <div
          className="v2-g3"
          style={css('display:grid; grid-template-columns:repeat(3,1fr); gap:18px;')}
        >
          {vm.courses.map((c) => (
            <div
              key={c.id}
              className="v2-lift"
              style={css(
                'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 4px 14px rgba(20,26,46,.05); display:flex; flex-direction:column;',
              )}
            >
              <div
                style={css(
                  'height:132px; background:' +
                    c.grad +
                    '; position:relative; display:flex; align-items:center; justify-content:center;',
                )}
              >
                <span
                  style={css(
                    'width:56px; height:56px; border-radius:28px; background:rgba(255,255,255,.22); display:flex; align-items:center; justify-content:center; color:#fff;',
                  )}
                >
                  <Icon name={c.ic} size={26} />
                </span>
                <span
                  style={css(
                    'position:absolute; top:12px; left:12px; background:rgba(255,255,255,.94); color:#141a2e; font-size:10px; font-weight:800; letter-spacing:.4px; padding:5px 10px; border-radius:8px;',
                  )}
                >
                  {c.level}
                </span>
                {c.certified && (
                  <span
                    style={css(
                      'position:absolute; top:12px; right:12px; background:rgba(20,26,46,.75); color:#7fe3a1; font-size:10px; font-weight:800; padding:5px 9px; border-radius:8px;',
                    )}
                  >
                    CERTIFIED
                  </span>
                )}
              </div>
              <div
                style={css('padding:17px 18px 18px; display:flex; flex-direction:column; flex:1;')}
              >
                <div style={css('font-size:16px; font-weight:800; color:#141a2e;')}>{c.title}</div>
                <div
                  style={css('font-size:13px; color:#6b7290; margin-top:5px; line-height:1.5; flex:1;')}
                >
                  {c.sub}
                </div>
                <div
                  style={css(
                    'display:flex; align-items:center; gap:14px; font-size:12.5px; color:#8b95b4; margin-top:13px;',
                  )}
                >
                  <span>{c.lessons} lessons</span>
                  <span>·</span>
                  <span>{c.duration}</span>
                </div>
                <div
                  style={css(
                    'height:6px; border-radius:3px; background:#eef1f8; overflow:hidden; margin-top:12px;',
                  )}
                >
                  <div
                    style={css(
                      'width:' +
                        c.progress +
                        '; height:100%; background:linear-gradient(90deg,#16a34a,#22c55e);',
                    )}
                  />
                </div>
                <div style={css('font-size:12px; font-weight:700; color:#6b7290; margin-top:7px;')}>
                  {c.progressLabel}
                </div>
                <button
                  className="v2-btn"
                  onClick={c.open}
                  style={css(
                    'width:100%; height:44px; margin-top:14px; border:none; border-radius:11px; background:#1e2a5a; color:#fff; font-size:14px; font-weight:800; cursor:pointer;',
                  )}
                >
                  {c.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        {vm.coursesEmpty && (
          <div>
            <h2 style={css("font-family:'Poppins'; font-size:20px; margin:8px 0 0;")}>No courses in this topic</h2>
            <p style={css('color:#6b7290;')}>Courses appear here once they are published.</p>
          </div>
        )}
      </section>
      <div style={css('height:64px;')} />
    </div>
  );
}
