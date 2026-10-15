import { useAccountViewModel } from '@/features/account/hooks/useAccountViewModel';
import { useActions } from '@/hooks/useActions';
import { Icon } from '@/components/common/Icon';
import { css } from '@/utils/css';

/** Account screen: profile, documents, payouts, security and support panels. */
export function AccountPage() {
  const vm = useAccountViewModel();
  const h = useActions();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <h1
        style={css(
          "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:0 0 24px; letter-spacing:-.5px;",
        )}
      >
        Account
      </h1>
      <div
        className="v2-split"
        style={css('display:grid; grid-template-columns:264px 1fr; gap:28px; align-items:start;')}
      >
        <aside
          className="v2-sticky"
          aria-label="Account sections"
          style={css(
            'position:sticky; top:96px; background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:14px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
          )}
        >
          {vm.accountNav.map((a) => (
            <button key={a.k} onClick={a.select} style={css(a.style)}>
              <span
                style={css(
                  'width:20px; height:20px; display:flex; align-items:center; justify-content:center;',
                )}
              >
                <Icon name={a.ic} size={18} />
              </span>
              <span style={css('flex:1; text-align:left;')}>{a.label}</span>
            </button>
          ))}
        </aside>

        <div
          style={css(
            'background:#fff; border:1px solid #e7eaf3; border-radius:20px; padding:28px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
          )}
        >
          <h2
            style={css(
              "font-family:'Poppins'; font-size:21px; font-weight:800; color:#141a2e; margin:0 0 20px;",
            )}
          >
            {vm.accountTitle}
          </h2>

          {vm.accountRows.map((r) => (
            <div
              key={r.label}
              style={css(
                'display:flex; align-items:center; gap:16px; padding:16px 0; border-bottom:1px solid #f2f4fa;',
              )}
            >
              <span style={css('flex:1; min-width:0;')}>
                <span
                  style={css('display:block; font-size:14.5px; font-weight:700; color:#141a2e;')}
                >
                  {r.label}
                </span>
                {r.sub && (
                  <span
                    style={css('display:block; font-size:12.5px; color:#5b638a; margin-top:2px;')}
                  >
                    {r.sub}
                  </span>
                )}
              </span>

              {r.isToggle && (
                <button
                  onClick={r.action}
                  role="switch"
                  aria-checked={(r.toggleStyle || '').includes('#16a34a')}
                  aria-label={r.label}
                  style={css(r.toggleStyle)}
                >
                  <span style={css(r.knobStyle)} />
                </button>
              )}
              {r.isBadge && <span style={css(r.badgeStyle)}>{r.value}</span>}
              {r.isAction && (
                <button
                  onClick={r.action}
                  style={css(
                    'height:38px; padding:0 16px; border:1px solid #d5dbef; border-radius:10px; background:#fff; color:#1e2a5a; font-size:13px; font-weight:800; cursor:pointer; white-space:nowrap;',
                  )}
                >
                  {r.value}
                </button>
              )}
              {r.isText && (
                <span
                  style={css('font-size:14px; font-weight:700; color:#6b7290; text-align:right;')}
                >
                  {r.value}
                </span>
              )}
            </div>
          ))}

          {vm.accountFooter && (
            <div style={css('display:flex; gap:12px; margin-top:22px; flex-wrap:wrap;')}>
              <button
                className="v2-btn"
                onClick={vm.accountPrimary}
                style={css(
                  'height:50px; padding:0 26px; border:none; border-radius:12px; background:#1e2a5a; color:#fff; font-size:14.5px; font-weight:800; cursor:pointer;',
                )}
              >
                {vm.accountPrimaryLabel}
              </button>
              {vm.accountHasDanger && (
                <>
                  <div style={css('flex:1;')} />
                  <button
                    onClick={vm.confirmLogout}
                    style={css(
                      'height:50px; padding:0 22px; border:1px solid #d5dbef; border-radius:12px; background:#fff; color:#1e2a5a; font-size:14.5px; font-weight:800; cursor:pointer;',
                    )}
                  >
                    Log out
                  </button>
                  <button
                    onClick={vm.confirmDelete}
                    style={css(
                      'height:50px; padding:0 22px; border:1px solid #f3c8c8; border-radius:12px; background:#fff; color:#dc2626; font-size:14.5px; font-weight:800; cursor:pointer;',
                    )}
                  >
                    Delete account
                  </button>
                </>
              )}
            </div>
          )}

          {vm.notAuthed && (
            <div
              style={css(
                'display:flex; align-items:center; gap:16px; background:#eff4ff; border:1px solid #dbe4ff; border-radius:14px; padding:18px 20px; margin-top:22px;',
              )}
            >
              <div style={css('flex:1; font-size:13.5px; color:#3a4160; line-height:1.55;')}>
                Sign in to manage your profile, documents and payout methods.
              </div>
              <button
                className="v2-btn"
                onClick={h.signIn}
                style={css(
                  'height:44px; padding:0 22px; border:none; border-radius:11px; background:#1e2a5a; color:#fff; font-size:14px; font-weight:800; cursor:pointer;',
                )}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
