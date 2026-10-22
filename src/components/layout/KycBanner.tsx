import { useQuery } from '@tanstack/react-query';
import { useKycState, useNavigationState, useSessionState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { http } from '@/lib/api/client';
import { isApiConfigured } from '@/lib/api/config';
import { css } from '@/utils/css';

/**
 * Verification reminder shown to signed-in users until KYC is approved.
 * Hidden on the KYC screen itself, exactly as the design specifies.
 */
export function KycBanner() {
  const { authed, sessionReady } = useSessionState();
  const { kycStatus } = useKycState();
  const { route } = useNavigationState();
  const h = useActions();
  const api = isApiConfigured();
  const kycQuery = useQuery({
    queryKey: ['kyc'],
    queryFn: ({ signal }) =>
      http.get<{ status?: string; rejectionReason?: string | null; resubmissionRequired?: boolean }>('/kyc', { signal }),
    enabled: api && authed && sessionReady,
  });
  const rejectionReason = kycQuery.data?.rejectionReason?.trim() ?? '';

  const show = sessionReady && authed && kycStatus !== 'verified' && route !== 'kyc';
  if (!show) return null;

  const pend = kycStatus === 'pending';
  const rejected = Boolean(rejectionReason);
  const warn = pend || rejected;
  const tone = warn ? '#7c5010' : '#1e3a6a';
  const message = rejected
    ? `${kycQuery.data?.resubmissionRequired ? 'Please correct your documents' : 'Your verification was not accepted'} — ${rejectionReason}`
    : pend
      ? 'Verification under review — you can browse, but buying, selling and bidding unlock once approved.'
      : 'Verify your identity to unlock buying, selling and bidding. Takes about two minutes.';

  return (
    <div
      style={css(
        'border-bottom:1px solid ' +
          (warn ? '#fcd9a8' : '#dbe4ff') +
          '; background:' +
          (warn ? '#fff7ed' : '#eff4ff') +
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
              (warn ? '#b45309' : '#2563eb') +
              ';',
          )}
        />
        <span
          style={css(
          'flex:1; font-size:13.5px; font-weight:700; color:' + tone + ';',
        )}
      >
          {message}
        </span>
        <button
          onClick={h.goKycFromBanner}
          style={css(
            'height:34px; padding:0 16px; border:none; border-radius:9px; cursor:pointer; font-size:12.5px; font-weight:800; white-space:nowrap; background:' +
              (warn ? '#b45309' : '#1e2a5a') +
              '; color:#fff;',
          )}
        >
          {rejected ? 'Review documents' : pend ? 'View status' : 'Verify now'}
        </button>
      </div>
    </div>
  );
}
