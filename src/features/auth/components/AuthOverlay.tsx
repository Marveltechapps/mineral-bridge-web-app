import { useEffect } from 'react';
import { useAuthViewModel } from '@/features/auth/hooks/useAuthViewModel';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';
import logo from '@/assets/images/mb-logo.png';

/** Sign-in, sign-up and one-time-code overlay. */
export function AuthOverlay() {
  const vm = useAuthViewModel();

  useEffect(() => {
    if (!vm.open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (document.querySelector('[role="listbox"]')) return;
      vm.closeAuth();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [vm.open, vm.closeAuth]);

  if (!vm.open) return null;

  return (
    <div
      className="v2-ovl"
      role="dialog"
      aria-modal="true"
      aria-label={vm.isSignup ? 'Create your account' : 'Sign in'}
      style={css(
        'position:fixed; inset:0; z-index:120; background:rgba(11,15,30,.72); backdrop-filter:blur(7px); display:flex; align-items:center; justify-content:center; padding:24px; overflow-y:auto;',
      )}
    >
      <div
        className="v2-card v2-g2"
        style={css(
          'width:100%; max-width:940px; display:grid; grid-template-columns:.86fr 1.14fr; border-radius:26px; overflow:hidden; box-shadow:0 34px 90px rgba(0,0,0,.5); background:#fff;',
        )}
      >
        <div
          style={css(
            'position:relative; overflow:hidden; background:linear-gradient(158deg,#0e1430,#1e2a5a 60%,#3a2c14 145%); padding:40px 34px; display:flex; flex-direction:column; color:#fff;',
          )}
        >
          <div
            className="v2-glow"
            style={css(
              'position:absolute; top:-70px; right:-50px; width:300px; height:300px; background:radial-gradient(circle,rgba(243,210,122,.34),transparent 70%);',
            )}
          />
          <div style={css('position:relative; display:flex; align-items:center; gap:11px;')}>
            <img
              src={logo}
              alt=""
              style={css('width:42px; height:42px; border-radius:21px; object-fit:cover;')}
            />
            <span
              className="v2-shine"
              style={css(
                "font-family:'Poppins'; font-size:13.5px; font-weight:800; letter-spacing:1.6px;",
              )}
            >
              MINERAL BRIDGE
            </span>
          </div>
          <div style={css('position:relative; margin-top:auto;')}>
            <div
              className="v2-f1"
              style={css(
                "font-family:'Poppins'; font-size:27px; font-weight:800; line-height:1.16; letter-spacing:-.6px;",
              )}
            >
              {vm.headline}
            </div>
            <p
              className="v2-f2"
              style={css(
                'font-size:14px; line-height:1.65; color:rgba(255,255,255,.72); margin:13px 0 0;',
              )}
            >
              {vm.blurb}
            </p>
            <div style={css('display:flex; flex-direction:column; gap:12px; margin-top:26px;')}>
              {vm.perks.map((p) => (
                <span
                  key={p.v}
                  className="v2-f3"
                  style={css(
                    'display:flex; align-items:center; gap:11px; font-size:13.5px; color:rgba(255,255,255,.86);',
                  )}
                >
                  <span
                    style={css(
                      'width:23px; height:23px; border-radius:12px; background:rgba(247,221,142,.17); display:flex; align-items:center; justify-content:center; color:#f7dd8e; flex-shrink:0;',
                    )}
                  >
                    <CheckGlyph size={12} />
                  </span>
                  {p.v}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={css('position:relative; padding:34px 38px 38px;')}>
          <button
            onClick={vm.closeAuth}
            aria-label="Close"
            style={css(
              'position:absolute; top:20px; right:20px; width:36px; height:36px; border-radius:18px; border:none; background:#f2f4fa; color:#6b7290; cursor:pointer; display:flex; align-items:center; justify-content:center;',
            )}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <AuthForm vm={vm} />
        </div>
      </div>
    </div>
  );
}
