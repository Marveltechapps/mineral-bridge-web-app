import { useAuthViewModel } from '@/features/auth/hooks/useAuthViewModel';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';
import logo from '@/assets/images/mb-logo.png';

/**
 * Full-page sign-in, shown at its own URL. The same form also appears as an
 * overlay above any screen — see `AuthOverlay`.
 */
export function AuthPage() {
  const vm = useAuthViewModel();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:56px 32px 80px;')}>
      <div
        className="v2-g2"
        style={css(
          'display:grid; grid-template-columns:1.05fr .95fr; gap:0; border-radius:24px; overflow:hidden; box-shadow:0 20px 56px rgba(20,26,46,.14); min-height:560px;',
        )}
      >
        <div
          style={css(
            'position:relative; overflow:hidden; background:linear-gradient(150deg,#141a2e,#1e2a5a 62%,#3a2c14 140%); padding:52px 48px; display:flex; flex-direction:column; justify-content:center; color:#fff;',
          )}
        >
          <div
            style={css(
              'position:absolute; top:-80px; right:-60px; width:340px; height:340px; background:radial-gradient(circle,rgba(243,210,122,.2),transparent 70%);',
            )}
          />
          <img
            src={logo}
            alt=""
            style={css(
              'position:relative; width:70px; height:70px; border-radius:35px; object-fit:cover; margin-bottom:26px;',
            )}
          />
          <div
            className="v2-gold"
            style={css(
              "position:relative; font-family:'Poppins'; font-size:15px; font-weight:800; letter-spacing:2px;",
            )}
          >
            MINERAL BRIDGE
          </div>
          <h2
            style={css(
              "position:relative; font-family:'Poppins'; font-size:32px; font-weight:800; line-height:1.15; margin:16px 0 0; letter-spacing:-.6px;",
            )}
          >
            {vm.headline}
          </h2>
          <p
            style={css(
              'position:relative; font-size:15px; line-height:1.65; color:rgba(255,255,255,.72); max-width:380px; margin:14px 0 0;',
            )}
          >
            {vm.blurb}
          </p>
          <div style={css('position:relative; display:flex; flex-direction:column; gap:13px; margin-top:30px;')}>
            {vm.perks.map((a) => (
              <span
                key={a.v}
                style={css(
                  'display:flex; align-items:center; gap:11px; font-size:14px; color:rgba(255,255,255,.86);',
                )}
              >
                <span
                  style={css(
                    'width:24px; height:24px; border-radius:12px; background:rgba(247,221,142,.16); display:flex; align-items:center; justify-content:center; color:#f7dd8e; flex-shrink:0;',
                  )}
                >
                  <CheckGlyph size={13} strokeWidth={3} />
                </span>
                {a.v}
              </span>
            ))}
          </div>
        </div>

        <div
          style={css(
            'background:#fff; padding:52px 48px; display:flex; flex-direction:column; justify-content:center;',
          )}
        >
          <AuthForm vm={vm} />
        </div>
      </div>
    </div>
  );
}
