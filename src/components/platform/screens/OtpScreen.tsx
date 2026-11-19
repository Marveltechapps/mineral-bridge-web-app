// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function OtpScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '32px', lineHeight: '1.05', letterSpacing: '-.3px' }}>
        Enter the 4-digit code
      </div>
      <div style={{ fontSize: '14px', color: '#6B6A70', marginTop: '10px', lineHeight: '1.5' }}>
        {"Sent by "}{vm.otpVia}{" to "}
        <b style={{ color: '#121214' }}>
          {vm.otpTo}
        </b>
      </div>
      <div style={{ position: 'relative', marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {list(vm.otpBoxes).map((b, index) => (
            <div key={index} style={{ flex: '1', height: '60px', borderRadius: '14px', background: '#fff', border: `1.5px solid ${b?.border ?? ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono', monospace", fontSize: '24px', fontWeight: '600' }}>
              <Val v={b?.v} />
            </div>
          ))}
        </div>
        <input aria-label="Verification code" inputMode="numeric" autoComplete="one-time-code" value={vm.otp ?? ''} onChange={vm.setOtp} style={{ position: 'absolute', inset: '0', opacity: '0', width: '100%', height: '60px', fontSize: '24px' }} />
      </div>
      {vm.otpErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.otpErr}
        </div>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', fontSize: '13.5px' }}>
        <span style={{ color: '#6B6A70' }}>
          Didn’t get it?
        </span>
        <span onClick={vm.resendOtp} style={{ cursor: 'pointer', fontWeight: '600', color: '#8A6A1C' }}>
          Resend code
        </span>
      </div>
      {vm.devOtp ? (
        <div style={{ marginTop: '20px', padding: '12px 14px', borderRadius: '14px', background: '#F1EFE9', fontSize: '12.5px', color: '#3A3940', lineHeight: '1.5' }}>
          {"Development sign-in code: "}{vm.devOtp}
        </div>
      ) : null}
    </div>
  );
}
