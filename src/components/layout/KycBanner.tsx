import { useAppState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { css } from '@/utils/css';

/**
 * Verification reminder shown to signed-in users until KYC is approved.
 * Hidden on the KYC screen itself, exactly as the design specifies.
 */
export function KycBanner() {
  const { state } = useAppState();
  const h = useActions();

  const show = state.authed && state.kycStatus !== 'verified' && state.route !== 'kyc';
  if (!show) return null;

  const pend = state.kycStatus === 'pending';

  return (
    <div
      style={css(
        'border-bottom:1px solid ' +
          (pend ? '#fcd9a8' : '#dbe4ff') +
          '; background:' +
          (pend ? '#fff7ed' : '#eff4ff') +
          ';',
      )}
    >
      <div
        style={css(
          'max-width:1440px; margin:0 auto; padding:12px 32px; display:flex; align-items:center; gap:14px;',
        )}
      >
        <span
          style={css(
            'width:8px; height:8px; border-radius:4px; flex-shrink:0; background:' +
              (pend ? '#b45309' : '#2563eb') +
              ';',
          )}
        />
        <span
          style={css(
            'flex:1; font-size:13.5px; font-weight:700; color:' + (pend ? '#7c5010' : '#1e3a6a') + ';',
          )}
        >
          {pend
            ? 'Verification under review — you can browse, but buying, selling and bidding unlock once approved.'
            : 'Verify your identity to unlock buying, selling and bidding. Takes about two minutes.'}
        </span>
        <button
          onClick={h.goKycFromBanner}
          style={css(
            'height:34px; padding:0 16px; border:none; border-radius:9px; cursor:pointer; font-size:12.5px; font-weight:800; white-space:nowrap; background:' +
              (pend ? '#b45309' : '#1e2a5a') +
              '; color:#fff;',
          )}
        >
          {pend ? 'View status' : 'Verify now'}
        </button>
      </div>
    </div>
  );
}
