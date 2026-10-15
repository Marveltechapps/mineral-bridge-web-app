import { useMiningViewModel } from '@/features/mining/hooks/useMiningViewModel';
import { useActions } from '@/hooks/useActions';
import { Icon } from '@/components/common/Icon';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

/** Artisanal & small-scale mining hub: programme overview and registration CTA. */
export function MiningPage() {
  const vm = useMiningViewModel();
  const h = useActions();

  return (
    <div>
      <section
        style={css(
          "position:relative; overflow:hidden; background:linear-gradient(115deg,rgba(20,26,46,.93),rgba(30,42,90,.84) 60%,rgba(26,77,51,.88) 135%), url('https://commons.wikimedia.org/wiki/Special:FilePath/Open%20pit%20mine.jpg?width=1400') center/cover; color:#fff;",
        )}
      >
        <div
          style={css(
            'position:absolute; top:-110px; right:-70px; width:460px; height:460px; background:radial-gradient(circle,rgba(127,227,161,.16),transparent 68%);',
          )}
        />
        <div
          style={css('position:relative; max-width:1440px; margin:0 auto; padding:60px 32px 66px;')}
        >
          <span
            style={css(
              'display:inline-block; padding:7px 15px; border-radius:9px; background:rgba(127,227,161,.14); border:1px solid rgba(127,227,161,.34); font-size:11.5px; font-weight:800; letter-spacing:1.2px; color:#7fe3a1;',
            )}
          >
            ARTISANAL &amp; SMALL-SCALE MINING
          </span>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:44px; font-weight:800; line-height:1.08; letter-spacing:-1px; margin:20px 0 0; max-width:680px;",
            )}
          >
            Fair access to global markets for small-scale miners.
          </h1>
          <p
            style={css(
              'font-size:16.5px; line-height:1.65; color:rgba(255,255,255,.76); max-width:600px; margin:18px 0 0;',
            )}
          >
            Join the ASM programme for verified site registration, free safety training, equipment access and direct buyer connections — no middlemen.
          </p>
          <button
            className="v2-btn"
            onClick={h.goAsm}
            style={css(
              'height:54px; margin-top:30px; padding:0 30px; border:none; border-radius:13px; background:linear-gradient(135deg,#7fe3a1,#16a34a); color:#0b2417; font-size:15.5px; font-weight:800; cursor:pointer;',
            )}
          >
            Register your site
          </button>
        </div>
      </section>

      <section
        className="v2-g3"
        style={css(
          'max-width:1440px; margin:0 auto; padding:48px 32px 0; display:grid; grid-template-columns:repeat(4,1fr); gap:18px;',
        )}
      >
        {vm.asmModules.map((m) => (
          <div
            key={m.title}
            className="v2-lift"
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:24px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
            )}
          >
            <span
              style={css(
                'width:48px; height:48px; border-radius:14px; background:' +
                  m.bg +
                  '; color:' +
                  m.color +
                  '; display:flex; align-items:center; justify-content:center;',
              )}
            >
              <Icon name={m.ic} size={23} />
            </span>
            <div style={css('font-size:16px; font-weight:800; color:#141a2e; margin-top:15px;')}>
              {m.title}
            </div>
            <div style={css('font-size:13.5px; color:#6b7290; margin-top:6px; line-height:1.55;')}>
              {m.sub}
            </div>
          </div>
        ))}
      </section>

      <section style={css('max-width:1440px; margin:0 auto; padding:48px 32px 72px;')}>
        <div
          className="v2-split"
          style={css('display:grid; grid-template-columns:1fr 386px; gap:28px; align-items:start;')}
        >
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:20px; padding:28px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
            )}
          >
            <h2
              style={css(
                "font-family:'Poppins'; font-size:21px; font-weight:800; color:#141a2e; margin:0 0 4px;",
              )}
            >
              Programme requirements
            </h2>
            <p style={css('font-size:13.5px; color:#6b7290; margin:0 0 18px;')}>
              What you&apos;ll need to complete registration.
            </p>
            {vm.asmReqs.map((r) => (
              <div
                key={r.v}
                style={css(
                  'display:flex; align-items:center; gap:13px; padding:13px 0; border-top:1px solid #f2f4fa;',
                )}
              >
                <span
                  style={css(
                    'width:26px; height:26px; border-radius:13px; background:#dcf3e8; color:#16a34a; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <CheckGlyph size={14} strokeWidth={3} />
                </span>
                <span style={css('font-size:14.5px; color:#3a4160;')}>{r.v}</span>
              </div>
            ))}
          </div>

          <div
            className="v2-sticky"
            style={css(
              'position:sticky; top:96px; background:#141a2e; border-radius:20px; padding:26px; color:#fff;',
            )}
          >
            <div style={css('font-size:12px; font-weight:800; letter-spacing:1px; color:#f7dd8e;')}>
              WHY JOIN
            </div>
            <div style={css('display:flex; flex-direction:column; gap:16px; margin-top:18px;')}>
              {vm.asmBenefits.map((b) => (
                <div key={b.label}>
                  <div
                    className="v2-gold"
                    style={css("font-family:'Poppins'; font-size:24px; font-weight:800;")}
                  >
                    {b.big}
                  </div>
                  <div style={css('font-size:13px; color:rgba(255,255,255,.66); margin-top:2px;')}>
                    {b.label}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="v2-btn"
              onClick={h.goAsm}
              style={css(
                'width:100%; height:50px; margin-top:22px; border:none; border-radius:12px; background:linear-gradient(135deg,#f7dd8e,#c8962f); color:#141a2e; font-size:15px; font-weight:800; cursor:pointer;',
              )}
            >
              Get started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
