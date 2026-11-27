// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function DocumentScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ borderRadius: '6px', background: '#fff', boxShadow: '0 1px 2px rgba(15,23,42,.06), 0 12px 32px rgba(15,23,42,.10)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 14px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '15.6px', lineHeight: '1' }}>
              Mineral Bridge
            </div>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '8.5px', letterSpacing: '.8px', color: '#F2C94C', marginTop: '4px' }}>
              VERIFIED MINERAL TRADING
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9px', letterSpacing: '.6px', color: '#94A3B8' }}>
              {vm.dc?.issuer}
            </div>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', marginTop: '3px' }}>
              {vm.dc?.no}
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 18px 6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '19.7px', lineHeight: '1.1' }}>
              {vm.dc?.title}
            </div>
            {vm.dc?.status ? (
              <span style={{ flex: 'none', padding: '3px 9px', borderRadius: '99px', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.3px', background: str(vm.dc?.stBg), color: str(vm.dc?.stFg) }}>
                {vm.dc?.status}
              </span>
            ) : null}
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '4px' }}>
            {"Issued "}{vm.dc?.date}
          </div>
          {vm.dc?.hasParties ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px', marginTop: '14px', padding: '11px 12px', borderRadius: '10px', background: '#F7F6F2' }}>
              {list(vm.dc?.parties).map((pt, index) => (
                <div key={index} style={{ minWidth: '0' }}>
                  <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '8.5px', letterSpacing: '.6px', color: '#5B6B82' }}>
                    {pt?.k}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '3px', lineHeight: '1.35' }}>
                    {pt?.v}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {list(vm.dc?.sections).map((sec, index) => (
            <div key={index} style={{ marginTop: '14px' }}>
              <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9px', letterSpacing: '.7px', color: '#8A6508', paddingBottom: '5px', borderBottom: '1.5px solid #1F2A44' }}>
                {sec?.h}
              </div>
              {list(sec?.rows).map((r, index2) => (
                <div key={index2} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '12px' }}>
                  <span style={{ color: '#5B6B82' }}>
                    {r?.k}
                  </span>
                  <span style={{ textAlign: 'right', fontWeight: str(r?.w), fontFamily: str(r?.ff) }}>
                    {r?.v}
                  </span>
                </div>
              ))}
            </div>
          ))}
          {vm.dc?.note ? (
            <div style={{ fontSize: '11px', color: '#5B6B82', marginTop: '12px', lineHeight: '1.5' }}>
              {vm.dc?.note}
            </div>
          ) : null}
        </div>
        <div style={{ margin: '14px 18px 16px', paddingTop: '12px', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '10px' }}>
          <div>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '18px', fontStyle: 'italic' }}>
              {vm.dc?.signer}
            </div>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '8.5px', letterSpacing: '.6px', color: '#5B6B82', marginTop: '2px' }}>
              {vm.dc?.signerRole}
            </div>
          </div>
          <div style={{ width: '58px', height: '58px', flex: 'none', borderRadius: '29px', border: '1.5px solid #F2C94C', color: '#8A6508', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '7.5px', letterSpacing: '.4px', lineHeight: '1.2', transform: 'rotate(-12deg)' }}>
            MB
            <br />
            VERIFIED
          </div>
        </div>
      </div>
      <div style={{ fontSize: '11.5px', color: '#5B6B82', textAlign: 'center', marginTop: '12px' }}>
        {"Preview · "}{vm.dc?.file}
      </div>
    </div>
  );
}
