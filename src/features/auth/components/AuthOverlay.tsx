import { useAuthViewModel } from '@/features/auth/hooks/useAuthViewModel';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';
import logo from '@/assets/images/mb-logo.png';

const CHECK_BOX =
  'width:21px; height:21px; border-radius:6px; background:#1e2a5a; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;';
const DIAL_CODE =
  'display:flex; align-items:center; gap:6px; padding:0 15px; height:52px; border:1px solid #dde2f0; border-radius:13px; background:#f9fafd; font-size:14.5px; font-weight:700; color:#141a2e;';
const H3 = "font-family:'Poppins'; font-size:25px; font-weight:800; color:#141a2e; margin:0;";
const SWITCH_LINK =
  'background:none; border:none; padding:0; font-size:13.5px; font-weight:800; color:#1e2a5a; cursor:pointer;';

/** Sign-in, sign-up and one-time-code overlay. */
export function AuthOverlay() {
  const vm = useAuthViewModel();
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
        {/* brand side */}
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
            <div
              style={css('display:flex; flex-direction:column; gap:12px; margin-top:26px;')}
            >
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

        {/* form side */}
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

          {vm.showTabs && (
            <div
              style={css(
                'position:relative; display:flex; background:#f2f4fa; border-radius:13px; padding:5px; width:270px; margin-bottom:26px;',
              )}
            >
              <div style={css(vm.indicator)} />
              <button onClick={vm.showLogin} style={css(vm.loginTab)}>
                Log in
              </button>
              <button onClick={vm.showSignup} style={css(vm.signupTab)}>
                Sign up
              </button>
            </div>
          )}

          {vm.isLogin && (
            <div className="v2-pl">
              <h3 className="v2-f1" style={css(H3)}>
                Welcome back
              </h3>
              <p className="v2-f1" style={css('font-size:14px; color:#6b7290; margin:7px 0 0;')}>
                Verify with a one-time code to continue.
              </p>
              <div
                className="v2-f2"
                style={css(
                  'display:flex; gap:6px; background:#f2f4fa; padding:5px; border-radius:12px; margin-top:22px;',
                )}
              >
                {vm.methods.map((m) => (
                  <button key={m.id} onClick={m.select} style={css(m.style)}>
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="v2-f3" style={css(vm.lbl)}>
                {vm.fieldLabel}
              </div>
              {vm.isEmail ? (
                <input
                  className="v2-f3"
                  placeholder="you@company.com"
                  aria-label="Email address"
                  value={vm.identifier}
                  onChange={(e) => vm.setIdentifier(e.target.value)}
                  style={css(vm.inp)}
                />
              ) : (
                <div className="v2-f3" style={css('display:flex; gap:10px;')}>
                  <div style={css(DIAL_CODE)}>+27 ▾</div>
                  <input
                    placeholder="82 000 0000"
                    aria-label={vm.fieldLabel}
                    value={vm.identifier}
                    onChange={(e) => vm.setIdentifier(e.target.value)}
                    style={css(vm.inp + ' margin-bottom:0;')}
                  />
                </div>
              )}
              <label
                className="v2-f4"
                style={css(
                  'display:flex; align-items:flex-start; gap:11px; margin-top:18px; cursor:pointer;',
                )}
              >
                <span style={css(CHECK_BOX)}>
                  <CheckGlyph size={13} strokeWidth={3} />
                </span>
                <span style={css('font-size:12.5px; color:#5b638a; line-height:1.5;')}>
                  Keep me signed in on this device.
                </span>
              </label>
              {vm.authError ? (
                <p role="alert" style={css('color:#9b2335; font-size:13px; margin:14px 0 0;')}>
                  {vm.authError}
                </p>
              ) : null}
              <button
                className="v2-btn v2-f5"
                onClick={vm.sendOtp}
                style={css(
                  'width:100%; height:54px; margin-top:22px; border:none; border-radius:14px; background:#1e2a5a; color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;',
                )}
              >
                Send verification code
              </button>
              <div
                className="v2-f5"
                style={css(
                  'text-align:center; font-size:13.5px; color:#6b7290; margin-top:18px;',
                )}
              >
                New to Mineral Bridge?{' '}
                <button onClick={vm.showSignup} style={css(SWITCH_LINK)}>
                  Create an account
                </button>
              </div>
            </div>
          )}

          {vm.isSignup && (
            <div className="v2-pr">
              <h3 className="v2-f1" style={css(H3)}>
                Create your account
              </h3>
              <p className="v2-f1" style={css('font-size:14px; color:#6b7290; margin:7px 0 0;')}>
                Join the assured minerals marketplace.
              </p>
              <div className="v2-f2" style={css(vm.lbl)}>
                FULL NAME
              </div>
              <input
                className="v2-f2"
                placeholder="Your legal name"
                aria-label="Full name"
                value={vm.fullName}
                onChange={(e) => vm.setFullName(e.target.value)}
                style={css(vm.inp)}
              />
              <div className="v2-f3" style={css(vm.lbl)}>
                I AM A
              </div>
              <div
                className="v2-f3"
                style={css('display:flex; gap:8px; flex-wrap:wrap; margin-bottom:4px;')}
              >
                {vm.roles.map((r) => (
                  <button key={r.label} onClick={r.select} style={css(r.style)}>
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="v2-f4" style={css(vm.lbl)}>
                MOBILE NUMBER
              </div>
              <div className="v2-f4" style={css('display:flex; gap:10px;')}>
                <div style={css(DIAL_CODE)}>+27 ▾</div>
                <input
                  placeholder="82 000 0000"
                  aria-label="Mobile number"
                  value={vm.phone}
                  onChange={(e) => vm.setPhone(e.target.value)}
                  style={css(vm.inp + ' margin-bottom:0;')}
                />
              </div>
              <div className="v2-f4" style={css(vm.lbl)}>
                EMAIL ADDRESS
              </div>
              <input
                className="v2-f4"
                placeholder="you@company.com"
                aria-label="Email address"
                value={vm.email}
                onChange={(e) => vm.setEmail(e.target.value)}
                style={css(vm.inp)}
              />
              <label
                className="v2-f5"
                style={css(
                  'display:flex; align-items:flex-start; gap:11px; margin-top:6px; cursor:pointer;',
                )}
              >
                <span style={css(CHECK_BOX)}>
                  <CheckGlyph size={13} strokeWidth={3} />
                </span>
                <span style={css('font-size:12.5px; color:#5b638a; line-height:1.5;')}>
                  I agree to the <b style={css('color:#1e2a5a;')}>Terms of Service</b> and{' '}
                  <b style={css('color:#1e2a5a;')}>Privacy Policy</b>.
                </span>
              </label>
              {vm.authError ? (
                <p role="alert" style={css('color:#9b2335; font-size:13px; margin:14px 0 0;')}>
                  {vm.authError}
                </p>
              ) : null}
              <button
                className="v2-btn v2-f5"
                onClick={vm.sendOtp}
                style={css(
                  'width:100%; height:54px; margin-top:20px; border:none; border-radius:14px; background:linear-gradient(135deg,#f7dd8e,#c8962f); color:#141a2e; font-size:15.5px; font-weight:800; cursor:pointer;',
                )}
              >
                Create account
              </button>
              <div
                className="v2-f5"
                style={css(
                  'text-align:center; font-size:13.5px; color:#6b7290; margin-top:16px;',
                )}
              >
                Already registered?{' '}
                <button onClick={vm.showLogin} style={css(SWITCH_LINK)}>
                  Log in
                </button>
              </div>
            </div>
          )}

          {vm.isOtp && (
            <div className="v2-pr">
              <button
                onClick={vm.otpBack}
                style={css(
                  'display:flex; align-items:center; gap:7px; background:none; border:none; padding:0; font-size:13px; font-weight:700; color:#6b7290; cursor:pointer;',
                )}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <h3
                className="v2-f1"
                style={css(
                  "font-family:'Poppins'; font-size:25px; font-weight:800; color:#141a2e; margin:18px 0 0;",
                )}
              >
                Enter your code
              </h3>
              <p className="v2-f1" style={css('font-size:14px; color:#6b7290; margin:7px 0 0;')}>
                We sent a 4-digit code to {vm.target}.
              </p>
              <div style={css('display:flex; gap:13px; margin-top:24px;')}>
                {vm.authError ? <p style={css('color:#9b2335; font-size:13px; margin:8px 0 0;')}>{vm.authError}</p> : null}
                {vm.otpBoxes.map((b) => (
                  <input
                    key={b.i}
                    className="v2-otp"
                    aria-label={`Code digit ${b.i + 1}`}
                    inputMode="numeric"
                    value={b.val}
                    onChange={(e) => b.onChange(e.target.value)}
                    style={css(b.style)}
                  />
                ))}
              </div>
              {vm.verifying ? (
                <div style={css('display:flex; align-items:center; gap:12px; margin-top:24px;')}>
                  <span
                    style={css(
                      'width:26px; height:26px; border-radius:13px; border:2.5px solid #dde2f0; border-top-color:#1e2a5a; display:block; animation:v2Spin .7s linear infinite;',
                    )}
                  />
                  <span style={css('font-size:14px; font-weight:700; color:#6b7290;')}>
                    Verifying your code…
                  </span>
                </div>
              ) : (
                <>
                  <button
                    className="v2-btn"
                    onClick={vm.verifyOtp}
                    style={css(
                      'width:100%; height:54px; margin-top:24px; border:none; border-radius:14px; background:#1e2a5a; color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;',
                    )}
                  >
                    Verify &amp; continue
                  </button>
                  <div
                    style={css(
                      'text-align:center; font-size:13.5px; color:#6b7290; margin-top:18px;',
                    )}
                  >
                    Didn&apos;t get it?{' '}
                    <button
                      type="button"
                      onClick={vm.resendOtp}
                      disabled={vm.resendIn > 0}
                      style={css(
                        'background:none; border:none; padding:0; color:#1e2a5a; font-weight:800; cursor:pointer;',
                      )}
                    >
                      Resend
                    </button>{' '}
                    · {vm.resendHint}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
