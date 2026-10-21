import { useAuthViewModel } from '@/features/auth/hooks/useAuthViewModel';
import { CountryDialField } from '@/features/auth/components/CountryDialField';
import { CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const CHECK_BOX =
  'width:21px; height:21px; border-radius:6px; background:#1e2a5a; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;';
const CHECK_OFF =
  'width:21px; height:21px; border-radius:6px; background:#fff; border:1.5px solid #c5cbe0; display:flex; align-items:center; justify-content:center; flex-shrink:0;';
const H3 = "font-family:'Poppins'; font-size:25px; font-weight:800; color:#141a2e; margin:0;";
const SWITCH_LINK =
  'background:none; border:none; padding:0; font-size:13.5px; font-weight:800; color:#1e2a5a; cursor:pointer;';

type AuthVm = ReturnType<typeof useAuthViewModel>;

/** Sign-in, sign-up and code entry shared by the overlay and the /auth page. */
export function AuthForm({ vm }: { vm: AuthVm }) {
  return (
    <>
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
              autoComplete="email"
              value={vm.loginEmail}
              onChange={(e) => vm.setLoginEmail(e.target.value)}
              style={css(vm.inp)}
            />
          ) : (
            <div className="v2-f3" style={css('display:flex; gap:10px;')}>
              <CountryDialField country={vm.dialCountry} onChange={vm.changeCountry} />
              <input
                placeholder="82 000 0000"
                aria-label={vm.fieldLabel}
                inputMode="tel"
                autoComplete="tel-national"
                value={vm.phone}
                onChange={(e) => vm.changePhone(e.target.value)}
                style={css(vm.inp + ' margin-bottom:0; flex:1; min-width:0; width:auto;')}
              />
            </div>
          )}
          <button
            type="button"
            className="v2-f4"
            role="checkbox"
            aria-checked={vm.rememberDevice}
            onClick={vm.toggleRemember}
            style={css(
              'display:flex; align-items:flex-start; gap:11px; margin-top:18px; cursor:pointer; background:none; border:none; padding:0; text-align:left;',
            )}
          >
            <span style={css(vm.rememberDevice ? CHECK_BOX : CHECK_OFF)}>
              {vm.rememberDevice ? <CheckGlyph size={13} strokeWidth={3} /> : null}
            </span>
            <span style={css('font-size:12.5px; color:#5b638a; line-height:1.5;')}>
              Keep me signed in on this device.
            </span>
          </button>
          {vm.authError ? (
            <p role="alert" style={css('color:#9b2335; font-size:13px; margin:14px 0 0;')}>
              {vm.authError}{' '}
              {vm.accountMissing ? (
                <button type="button" onClick={vm.createAccount} style={css(SWITCH_LINK)}>
                  Create an account
                </button>
              ) : null}
            </p>
          ) : null}
          <button
            className="v2-btn v2-f5"
            type="button"
            onClick={vm.sendOtp}
            disabled={vm.submitting}
            style={css(
              'width:100%; height:54px; margin-top:22px; border:none; border-radius:14px; background:#1e2a5a; color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;' +
                (vm.submitting ? ' opacity:.7; cursor:default;' : ''),
            )}
          >
            {vm.submitting ? 'Sending…' : 'Send verification code'}
          </button>
          {vm.devLoginAvailable ? (
            <button type="button" onClick={vm.showDeveloperLogin} style={css(SWITCH_LINK + ' margin-top:14px;')}>
              Developer login
            </button>
          ) : null}
          <div
            className="v2-f5"
            style={css('text-align:center; font-size:13.5px; color:#6b7290; margin-top:18px;')}
          >
            New to Mineral Bridge?{' '}
            <button onClick={vm.showSignup} style={css(SWITCH_LINK)}>
              Create an account
            </button>
          </div>
        </div>
      )}

      {vm.isDevLogin && (
        <div className="v2-pl">
          <h3 className="v2-f1" style={css(H3)}>
            Developer login
          </h3>
          <p className="v2-f1" style={css('font-size:14px; color:#6b7290; margin:7px 0 0;')}>
            Local development only. The server must confirm this option, then show a one-time code on this screen.
          </p>
          <div className="v2-f3" style={css(vm.lbl)}>
            DEVELOPER EMAIL
          </div>
          <input
            className="v2-f3"
            placeholder="developer@example.com"
            aria-label="Developer email"
            autoComplete="username"
            value={vm.loginEmail}
            onChange={(e) => vm.setLoginEmail(e.target.value)}
            style={css(vm.inp)}
          />
          <div className="v2-f3" style={css(vm.lbl)}>
            PASSWORD
          </div>
          <input
            className="v2-f3"
            placeholder="Development password"
            aria-label="Developer password"
            type="password"
            autoComplete="current-password"
            value={vm.devPassword}
            onChange={(e) => vm.setDevPassword(e.target.value)}
            style={css(vm.inp)}
          />
          {vm.authError ? (
            <p role="alert" style={css('color:#9b2335; font-size:13px; margin:14px 0 0;')}>
              {vm.authError}
            </p>
          ) : null}
          <button
            className="v2-btn v2-f5"
            type="button"
            onClick={vm.startDeveloperLogin}
            disabled={vm.submitting}
            style={css(
              'width:100%; height:54px; margin-top:22px; border:none; border-radius:14px; background:#1e2a5a; color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;' +
                (vm.submitting ? ' opacity:.7; cursor:default;' : ''),
            )}
          >
            {vm.submitting ? 'Checking…' : 'Continue'}
          </button>
          <div style={css('text-align:center; font-size:13.5px; color:#6b7290; margin-top:16px;')}>
            <button type="button" onClick={vm.showLogin} style={css(SWITCH_LINK)}>
              Use customer login
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
          <div className="v2-f3" style={css('display:flex; gap:8px; flex-wrap:wrap; margin-bottom:4px;')}>
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
            <CountryDialField country={vm.dialCountry} onChange={vm.changeCountry} />
            <input
              placeholder="82 000 0000"
              aria-label="Mobile number"
              inputMode="tel"
              autoComplete="tel-national"
              value={vm.phone}
              onChange={(e) => vm.changePhone(e.target.value)}
              style={css(vm.inp + ' margin-bottom:0; flex:1; min-width:0; width:auto;')}
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
            style={css('display:flex; align-items:flex-start; gap:11px; margin-top:6px; cursor:pointer;')}
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
            type="button"
            onClick={vm.sendOtp}
            disabled={vm.submitting}
            style={css(
              'width:100%; height:54px; margin-top:20px; border:none; border-radius:14px; background:linear-gradient(135deg,#f7dd8e,#c8962f); color:#141a2e; font-size:15.5px; font-weight:800; cursor:pointer;' +
                (vm.submitting ? ' opacity:.7; cursor:default;' : ''),
            )}
          >
            {vm.submitting ? 'Please wait…' : 'Continue'}
          </button>
          <div className="v2-f5" style={css('text-align:center; font-size:13.5px; color:#6b7290; margin-top:16px;')}>
            Already registered?{' '}
            <button onClick={vm.showLogin} style={css(SWITCH_LINK)}>
              Log in
            </button>
          </div>
        </div>
      )}

      {vm.isVerifyMethod && (
        <div className="v2-pr">
          <button
            onClick={vm.showSignup}
            style={css(
              'display:flex; align-items:center; gap:7px; background:none; border:none; padding:0; font-size:13px; font-weight:700; color:#6b7290; cursor:pointer;',
            )}
          >
            Back
          </button>
          <h3 className="v2-f1" style={css(H3 + ' margin-top:18px;')}>
            How would you like to verify your account?
          </h3>
          <p className="v2-f1" style={css('font-size:14px; color:#6b7290; margin:7px 0 0;')}>
            Choose a method for the contact details you entered. The account is created after the code is accepted.
          </p>
          {vm.authError ? (
            <p role="alert" style={css('color:#9b2335; font-size:13px; margin:14px 0 0;')}>
              {vm.authError}
            </p>
          ) : null}
          {!vm.providersReady ? (
            <p style={css('font-size:14px; color:#6b7290; margin-top:22px;')}>Checking verification options…</p>
          ) : vm.verificationUnavailable ? (
            <div style={css('margin-top:22px;')}>
              <p role="alert" style={css('color:#9b2335; font-size:13.5px; margin:0;')}>
                Verification is temporarily unavailable. Please try again.
              </p>
              <button
                type="button"
                onClick={vm.retryVerificationOptions}
                style={css(
                  'width:100%; height:54px; margin-top:16px; border:none; border-radius:14px; background:#1e2a5a; color:#fff; font-size:15px; font-weight:800; cursor:pointer;',
                )}
              >
                Try again
              </button>
            </div>
          ) : (
            <div style={css('display:flex; flex-direction:column; gap:10px; margin-top:22px;')}>
              {vm.verificationChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  disabled={vm.submitting}
                  onClick={() => vm.chooseVerification(choice.id)}
                  style={css(
                    'text-align:left; padding:14px 16px; border-radius:14px; border:1px solid #dde2f0; background:#fff; cursor:pointer;' +
                      (vm.submitting ? ' opacity:.7; cursor:default;' : ''),
                  )}
                >
                  <span style={css('display:block; font-size:14.5px; font-weight:800; color:#141a2e;')}>
                    {choice.label}
                  </span>
                  {choice.detail ? (
                    <span style={css('display:block; margin-top:4px; font-size:12.5px; color:#6b7290;')}>
                      {choice.detail}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
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
            Back
          </button>
          <h3 className="v2-f1" style={css(H3 + ' margin-top:18px;')}>
            Enter your code
          </h3>
          <p className="v2-f1" style={css('font-size:14px; color:#6b7290; margin:7px 0 0;')}>
            {vm.otpNotice}
          </p>
          {vm.developmentOtp ? (
            <p
              style={css(
                'margin:16px 0 0; padding:12px 14px; border-radius:12px; background:#f7f4ea; border:1px solid #e4d7b0; font-size:14px; color:#141a2e;',
              )}
            >
              Development-only code:{' '}
              <strong style={css('letter-spacing:2px;')}>{vm.developmentOtp}</strong>
            </p>
          ) : null}
          {vm.authError ? (
            <p role="alert" style={css('color:#9b2335; font-size:13px; margin:14px 0 0;')}>
              {vm.authError}
            </p>
          ) : null}
          <div style={css('display:flex; gap:13px; margin-top:24px;')}>
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
              <span style={css('font-size:14px; font-weight:700; color:#6b7290;')}>Verifying your code…</span>
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
              <div style={css('text-align:center; font-size:13.5px; color:#6b7290; margin-top:18px;')}>
                {vm.isDeveloperOtp ? (
                  'This code expires shortly. Go back to request another.'
                ) : vm.developmentOtp ? (
                  <>
                    Need another development code?{' '}
                    <button
                      type="button"
                      onClick={vm.resendOtp}
                      disabled={vm.resendIn > 0}
                      style={css('background:none; border:none; padding:0; color:#1e2a5a; font-weight:800; cursor:pointer;')}
                    >
                      Resend
                    </button>{' '}
                    · {vm.resendHint}
                  </>
                ) : (
                  <>
                    Didn&apos;t get it?{' '}
                    <button
                      type="button"
                      onClick={vm.resendOtp}
                      disabled={vm.resendIn > 0}
                      style={css('background:none; border:none; padding:0; color:#1e2a5a; font-weight:800; cursor:pointer;')}
                    >
                      Resend
                    </button>{' '}
                    · {vm.resendHint}
                  </>
                )}
              </div>
              {vm.inSignup && vm.verificationChoices.length > 1 ? (
                <div style={css('display:flex; flex-direction:column; gap:8px; margin-top:14px;')}>
                  {vm.verificationChoices
                    .filter((choice) => choice.id !== (vm.isEmail ? 'email' : 'mobile'))
                    .map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => vm.chooseVerification(choice.id)}
                        disabled={vm.submitting}
                        style={css(SWITCH_LINK + ' font-size:13px;')}
                      >
                        {choice.id === 'email' ? 'Verify using email instead' : 'Verify using SMS instead'}
                      </button>
                    ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </>
  );
}
