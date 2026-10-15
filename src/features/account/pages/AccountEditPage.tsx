import { useAccountEditViewModel } from '@/features/account/hooks/useAccountEditViewModel';
import { useActions } from '@/hooks/useActions';
import { css } from '@/utils/css';

const Tick = ({ size = 13, stroke = '#fff', width = 3.4 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LockNote = ({ children }: { children: React.ReactNode }) => (
  <div
    style={css(
      'display:flex; gap:12px; align-items:flex-start; background:#eff4ff; border:1px solid #dbe4ff; border-radius:14px; padding:16px 18px;',
    )}
  >
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563eb"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={css('flex-shrink:0;')}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
    <div style={css('font-size:13px; color:#1e3a6a; line-height:1.55;')}>{children}</div>
  </div>
);

/** Account edit sheets: profile, document upload, payout, password and sessions. */
export function AccountEditPage() {
  const vm = useAccountEditViewModel();
  const h = useActions();
  const { acc } = vm;

  return (
    <div style={css('max-width:720px; margin:0 auto; padding:32px 32px 72px;')}>
      <nav
        aria-label="Breadcrumb"
        style={css(
          'display:flex; align-items:center; gap:8px; font-size:13px; color:#5b638a; margin-bottom:18px;',
        )}
      >
        <button
          onClick={h.goAccount}
          style={css(
            'background:none; border:none; padding:0; font-size:13px; color:#5b638a; cursor:pointer;',
          )}
        >
          Account
        </button>
        <span>/</span>
        <span style={css('color:#141a2e; font-weight:700;')}>{acc.title}</span>
      </nav>

      <h1
        style={css(
          "font-family:'Poppins'; font-size:27px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
        )}
      >
        {acc.title}
      </h1>
      <p style={css('font-size:15px; color:#525a78; margin:9px 0 24px;')}>{acc.sub}</p>

      <div
        style={css(
          'background:#fff; border:1px solid #e7eaf3; border-radius:20px; padding:28px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
        )}
      >
        {acc.isProfile && (
          <>
            <div
              style={css(
                'display:flex; align-items:center; gap:18px; padding-bottom:22px; border-bottom:1px solid #f2f4fa; margin-bottom:6px;',
              )}
            >
              <span
                style={css(
                  "width:76px; height:76px; border-radius:38px; background:linear-gradient(135deg,#f0a04b,#c8962f); color:#fff; font-family:'Poppins'; font-size:26px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0;",
                )}
              >
                {acc.initials}
              </span>
              <div style={css('flex:1;')}>
                <div style={css('font-size:15px; font-weight:800; color:#141a2e;')}>
                  Profile photo
                </div>
                <div style={css('font-size:13px; color:#5b638a; margin-top:3px;')}>
                  PNG or JPG, up to 5 MB.
                </div>
                <button
                  onClick={vm.accPhoto}
                  style={css(
                    'height:38px; margin-top:10px; padding:0 16px; border:1px solid #d5dbef; border-radius:10px; background:#fff; color:#1e2a5a; font-size:13px; font-weight:800; cursor:pointer;',
                  )}
                >
                  Upload photo
                </button>
              </div>
            </div>

            <div style={css(vm.lbl)}>Full name</div>
            <input
              value={acc.f.name}
              disabled
              aria-label="Full name"
              style={css(vm.inp + ' background:#f7f8fc; color:#6b7290;')}
            />
            <div style={css('font-size:12.5px; color:#5b638a; margin:-6px 0 4px; line-height:1.5;')}>
              Locked to your verified KYC document. Contact support if it is incorrect.
            </div>

            <div
              className="v2-g2"
              style={css('display:grid; grid-template-columns:1fr 1fr; gap:18px;')}
            >
              <div>
                <div style={css(vm.lbl)}>Email address</div>
                <input
                  value={acc.f.email}
                  onChange={vm.accEmail}
                  placeholder="you@company.com"
                  aria-label="Email address"
                  style={css(vm.inp)}
                />
              </div>
              <div>
                <div style={css(vm.lbl)}>Mobile number</div>
                <input
                  value={acc.f.mobile}
                  onChange={vm.accMobile}
                  placeholder="+27 82 000 0000"
                  aria-label="Mobile number"
                  style={css(vm.inp)}
                />
              </div>
              <div>
                <div style={css(vm.lbl)}>Country</div>
                <input
                  value={acc.f.country}
                  onChange={vm.accCountry}
                  placeholder="Country"
                  aria-label="Country"
                  style={css(vm.inp)}
                />
              </div>
              <div>
                <div style={css(vm.lbl)}>Company</div>
                <input
                  value={acc.f.company}
                  onChange={vm.accCompany}
                  placeholder="Company or cooperative"
                  aria-label="Company"
                  style={css(vm.inp)}
                />
              </div>
            </div>

            <div style={css(vm.lbl)}>Account type</div>
            <div style={css('display:flex; gap:9px; flex-wrap:wrap;')}>
              {acc.roles.map((r) => (
                <button key={r.label} onClick={r.select} style={css(r.style)}>
                  {r.label}
                </button>
              ))}
            </div>
          </>
        )}

        {acc.isDoc && (
          <>
            <div style={css(vm.lbl)}>Document</div>
            <div
              style={css(
                'border:1.5px dashed #cdd4e6; border-radius:16px; padding:34px; text-align:center; background:#f9fafd;',
              )}
            >
              {acc.docUploaded ? (
                <>
                  <div
                    style={css(
                      'width:56px; height:56px; border-radius:28px; background:#dcf3e8; color:#16a34a; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;',
                    )}
                  >
                    <Tick size={26} stroke="currentColor" width={3} />
                  </div>
                  <div style={css('font-size:15px; font-weight:800; color:#141a2e;')}>
                    {acc.docFile}
                  </div>
                  <div style={css('font-size:12.5px; color:#5b638a; margin-top:4px;')}>
                    Ready to submit
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={css(
                      'display:flex; justify-content:center; color:#8b95b4; margin-bottom:10px;',
                    )}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div style={css('font-size:15px; font-weight:800; color:#1e2a5a;')}>
                    Choose a file to upload
                  </div>
                  <div style={css('font-size:12.5px; color:#5b638a; margin-top:4px;')}>
                    PDF, PNG or JPG · up to 10 MB
                  </div>
                </>
              )}
              <button
                onClick={vm.accDocPick}
                style={css(
                  'height:42px; margin-top:16px; padding:0 20px; border:1px solid #d5dbef; border-radius:11px; background:#fff; color:#1e2a5a; font-size:13.5px; font-weight:800; cursor:pointer;',
                )}
              >
                {acc.docCta}
              </button>
            </div>

            <div style={css(vm.lbl)}>Reference number</div>
            <input
              value={acc.f.docRef}
              onChange={vm.accDocRef}
              placeholder="Certificate or licence number"
              aria-label="Reference number"
              style={css(vm.inp)}
            />
            <div style={css(vm.lbl)}>Expiry date</div>
            <input
              type="date"
              value={acc.f.docExp}
              onChange={vm.accDocExp}
              aria-label="Expiry date"
              style={css(vm.inp)}
            />
            <LockNote>
              Documents are encrypted at rest and reviewed only by our compliance desk.
            </LockNote>
          </>
        )}

        {acc.isPayout && (
          <>
            <div style={css(vm.lbl)}>Method type</div>
            <div style={css('display:flex; gap:9px; flex-wrap:wrap; margin-bottom:6px;')}>
              {acc.payTypes.map((p) => (
                <button key={p.label} onClick={p.select} style={css(p.style)}>
                  {p.label}
                </button>
              ))}
            </div>
            <div style={css(vm.lbl)}>{acc.payFieldLabel}</div>
            <input
              value={acc.f.payAccount}
              onChange={vm.accPayAccount}
              placeholder={acc.payPlaceholder}
              aria-label={acc.payFieldLabel}
              style={css(vm.inp)}
            />
            {acc.payIsCrypto && (
              <>
                <div style={css(vm.lbl)}>Network</div>
                <div style={css('display:flex; gap:9px; flex-wrap:wrap; margin-bottom:6px;')}>
                  {acc.networks.map((n) => (
                    <button key={n.label} onClick={n.select} style={css(n.style)}>
                      {n.label}
                    </button>
                  ))}
                </div>
              </>
            )}
            {acc.payIsBank && (
              <div
                className="v2-g2"
                style={css('display:grid; grid-template-columns:1fr 1fr; gap:18px;')}
              >
                <div>
                  <div style={css(vm.lbl)}>Bank name</div>
                  <input
                    value={acc.f.payBank}
                    onChange={vm.accPayBank}
                    placeholder="e.g. Standard Bank"
                    aria-label="Bank name"
                    style={css(vm.inp)}
                  />
                </div>
                <div>
                  <div style={css(vm.lbl)}>SWIFT / BIC</div>
                  <input
                    value={acc.f.paySwift}
                    onChange={vm.accPaySwift}
                    placeholder="SBZAZAJJ"
                    aria-label="SWIFT or BIC"
                    style={css(vm.inp)}
                  />
                </div>
              </div>
            )}
            <label
              style={css(
                'display:flex; align-items:center; gap:12px; cursor:pointer; margin-top:4px;',
              )}
            >
              <button
                onClick={vm.accPayDefault}
                role="checkbox"
                aria-checked={acc.f.payDefault}
                aria-label="Use as my primary payout method"
                style={css(acc.defaultBox)}
              >
                {acc.f.payDefault && <Tick />}
              </button>
              <span style={css('font-size:13.5px; font-weight:700; color:#3a4160;')}>
                Use as my primary payout method
              </span>
            </label>
          </>
        )}

        {acc.isPassword && (
          <>
            <div style={css(vm.lbl)}>Current password</div>
            <input
              type="password"
              placeholder="••••••••"
              aria-label="Current password"
              style={css(vm.inp)}
            />
            <div style={css(vm.lbl)}>New password</div>
            <input
              type="password"
              value={acc.f.pw}
              onChange={vm.accPw}
              placeholder="At least 10 characters"
              aria-label="New password"
              style={css(vm.inp)}
            />
            <div
              style={css(
                'height:6px; border-radius:3px; background:#eef1f8; overflow:hidden; margin:-6px 0 8px;',
              )}
            >
              <div
                style={css(
                  'width:' +
                    acc.pwPct +
                    '; height:100%; background:' +
                    acc.pwColor +
                    '; transition:width .25s ease;',
                )}
              />
            </div>
            <div
              style={css(
                'font-size:12.5px; font-weight:700; color:' + acc.pwColor + '; margin-bottom:10px;',
              )}
            >
              {acc.pwLabel}
            </div>
            <div style={css(vm.lbl)}>Confirm new password</div>
            <input
              type="password"
              placeholder="Re-enter new password"
              aria-label="Confirm new password"
              style={css(vm.inp)}
            />
            <div style={css('display:flex; flex-direction:column; gap:8px;')}>
              {acc.pwRules.map((r) => (
                <span
                  key={r.v}
                  style={css(
                    'display:flex; align-items:center; gap:10px; font-size:13px; color:' +
                      r.color +
                      ';',
                  )}
                >
                  <span
                    style={css(
                      'width:19px; height:19px; border-radius:10px; background:' +
                        r.bg +
                        '; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                    )}
                  >
                    <Tick size={11} stroke="currentColor" width={3.6} />
                  </span>
                  {r.v}
                </span>
              ))}
            </div>
          </>
        )}

        {acc.isSessions && (
          <div style={css('display:flex; flex-direction:column; gap:12px;')}>
            {acc.sessions.map((s) => (
              <div
                key={s.id}
                style={css(
                  'display:flex; align-items:center; gap:15px; padding:17px 19px; border:1px solid #e7eaf3; border-radius:15px;',
                )}
              >
                <span
                  style={css(
                    'width:42px; height:42px; border-radius:12px; background:#eef1fb; color:#1e2a5a; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                  </svg>
                </span>
                <span style={css('flex:1; min-width:0;')}>
                  <span style={css('display:block; font-size:15px; font-weight:800; color:#141a2e;')}>
                    {s.device}
                  </span>
                  <span
                    style={css('display:block; font-size:12.5px; color:#5b638a; margin-top:2px;')}
                  >
                    {s.meta}
                  </span>
                </span>
                {s.current ? (
                  <span
                    style={css(
                      'font-size:11.5px; font-weight:800; color:#0f7034; background:#dcf3e8; padding:6px 13px; border-radius:9px; white-space:nowrap;',
                    )}
                  >
                    THIS DEVICE
                  </span>
                ) : (
                  <button
                    onClick={s.revoke}
                    style={css(
                      'height:38px; padding:0 15px; border:1px solid #f3c8c8; border-radius:10px; background:#fff; color:#dc2626; font-size:13px; font-weight:800; cursor:pointer;',
                    )}
                  >
                    Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={css('display:flex; gap:12px; margin-top:24px;')}>
        <button
          onClick={h.goAccount}
          style={css(
            'height:54px; padding:0 24px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:15px; font-weight:800; cursor:pointer;',
          )}
        >
          Cancel
        </button>
        <div style={css('flex:1;')} />
        <button
          className="v2-btn"
          onClick={vm.accSave}
          disabled={acc.saveBlocked}
          style={css(acc.saveStyle)}
        >
          {acc.saveLabel}
        </button>
      </div>
    </div>
  );
}
