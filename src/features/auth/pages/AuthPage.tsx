import { useAuthViewModel } from '@/features/auth/hooks/useAuthViewModel';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';
import logo from '@/assets/images/mb-logo.png';

const H3 = "font-family:'Poppins'; font-size:26px; font-weight:800; color:#141a2e; margin:0;";
const TALL_INPUT =
  'width:100%; height:54px; border:1px solid #dde2f0; border-radius:13px; padding:0 16px; font-size:15px; outline:none;';
const PRIMARY =
  'width:100%; height:56px; margin-top:24px; border:none; border-radius:14px; background:#1e2a5a; color:#fff; font-size:16px; font-weight:800; cursor:pointer;';

/**
 * Full-page sign-in, shown at its own URL. The same flow also appears as an
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
            Sign in to complete your trade.
          </h2>
          <p
            style={css(
              'position:relative; font-size:15px; line-height:1.65; color:rgba(255,255,255,.72); max-width:380px; margin:14px 0 0;',
            )}
          >
            Browsing is open to everyone. We verify identity only at the point of purchase or listing, to keep the marketplace compliant.
          </p>
          <div
            style={css(
              'position:relative; display:flex; flex-direction:column; gap:13px; margin-top:30px;',
            )}
          >
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
          {!vm.isOtp && (
            <>
              <h3 style={css(H3)}>Welcome back</h3>
              <p style={css('font-size:14px; color:#6b7290; margin:8px 0 0;')}>
                Verify with a one-time code to continue.
              </p>
              <div
                style={css(
                  'display:flex; gap:6px; background:#f2f4fa; padding:5px; border-radius:12px; margin-top:26px;',
                )}
              >
                {vm.methods.map((m) => (
                  <button key={m.id} onClick={m.select} style={css(m.style)}>
                    {m.label}
                  </button>
                ))}
              </div>
              <div
                style={css(
                  'font-size:12px; font-weight:800; letter-spacing:.5px; color:#5b638a; margin:22px 0 9px;',
                )}
              >
                {vm.fieldLabel}
              </div>
              {vm.isEmail ? (
                <input
                  placeholder="you@company.com"
                  aria-label="Email address"
                  style={css(TALL_INPUT)}
                />
              ) : (
                <div style={css('display:flex; gap:10px;')}>
                  <div
                    style={css(
                      'display:flex; align-items:center; gap:6px; padding:0 15px; height:54px; border:1px solid #dde2f0; border-radius:13px; background:#f9fafd; font-size:14.5px; font-weight:700; color:#141a2e;',
                    )}
                  >
                    +27 ▾
                  </div>
                  <input
                    placeholder="82 000 0000"
                    aria-label={vm.fieldLabel}
                    style={css(
                      'flex:1; height:54px; border:1px solid #dde2f0; border-radius:13px; padding:0 16px; font-size:15px; outline:none;',
                    )}
                  />
                </div>
              )}
              <label
                style={css(
                  'display:flex; align-items:flex-start; gap:11px; margin-top:18px; cursor:pointer;',
                )}
              >
                <span
                  style={css(
                    'width:21px; height:21px; border-radius:6px; background:#1e2a5a; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;',
                  )}
                >
                  <CheckGlyph size={13} strokeWidth={3} />
                </span>
                <span style={css('font-size:12.5px; color:#5b638a; line-height:1.5;')}>
                  I agree to the <b style={css('color:#1e2a5a;')}>Terms of Service</b> and{' '}
                  <b style={css('color:#1e2a5a;')}>Privacy Policy</b>.
                </span>
              </label>
              <button className="v2-btn" onClick={vm.sendOtp} style={css(PRIMARY)}>
                Send verification code
              </button>
            </>
          )}

          {vm.isOtp && (
            <>
              <h3 style={css(H3)}>Enter your code</h3>
              <p style={css('font-size:14px; color:#6b7290; margin:8px 0 0;')}>
                We sent a 4-digit code to your number.
              </p>
              <div style={css('display:flex; gap:13px; margin-top:26px;')}>
                {vm.otpBoxes.map((b) => (
                  <div key={b.i} style={css(b.style)}>
                    {b.val}
                  </div>
                ))}
              </div>
              <button
                className="v2-btn"
                onClick={vm.verifyOtp}
                style={css(PRIMARY + ' margin-top:26px;')}
              >
                Verify &amp; continue
              </button>
              <div
                style={css('text-align:center; font-size:13.5px; color:#6b7290; margin-top:18px;')}
              >
                Didn&apos;t get it? <b style={css('color:#1e2a5a; cursor:pointer;')}>Resend</b> · 02:58
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
