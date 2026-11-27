import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

/** Verification code for a phone/email change (`POST /me/contact-change`). Styled like the sign-in OtpScreen. */
export function ContactOtpScreen({ vm }: { vm: ViewModel }) {
  const ct = vm.ct;
  if (!ct?.active) {
    return (
      <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
          This change expired. Go back and tap Change again.
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.3px', fontSize: '26.2px', lineHeight: '1.05' }}>
        Enter the 4-digit code
      </div>
      <div style={{ fontSize: '14px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
        {"Sent by "}{ct.via}{" to your new "}{ct.noun}{" "}
        <b style={{ color: '#1F2A44' }}>
          {ct.to}
        </b>
      </div>
      <div style={{ position: 'relative', marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {list(ct.boxes).map((b, index) => (
            <div key={index} style={{ flex: '1', height: '60px', borderRadius: '14px', background: '#fff', border: `1.5px solid ${b?.border ?? ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '24px' }}>
              <Val v={b?.v} />
            </div>
          ))}
        </div>
        <input aria-label="Verification code" inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={4} value={ct.code ?? ''} onChange={ct.setCode} style={{ position: 'absolute', inset: '0', opacity: '0', width: '100%', height: '60px', fontSize: '24px' }} />
      </div>
      {ct.err ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {ct.err}
        </div>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', fontSize: '13.5px' }}>
        <span style={{ color: '#5B6B82' }}>
          Didn’t get it?
        </span>
        <span onClick={ct.resend} role="button" aria-disabled={ct.resendOff} style={{ cursor: ct.resendOff ? 'default' : 'pointer', fontWeight: '600', color: str(ct.resendFg) }}>
          {ct.resendLabel}
        </span>
      </div>
      <div style={{ marginTop: '20px', padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
        {"Your current "}{ct.noun}{" stays active until you verify the new one."}
      </div>
      {ct.devOtp ? (
        <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
          {"Development build: the server returned the code "}{ct.devOtp}{". Production builds never show this."}
        </div>
      ) : null}
    </div>
  );
}
