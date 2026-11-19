// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function DocumentScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ borderRadius: '6px', background: '#fff', boxShadow: '0 1px 2px rgba(18,18,20,.06), 0 12px 32px rgba(18,18,20,.10)', border: '1px solid #E4E2DB', overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 14px', background: '#121214', color: '#F4F2ED', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '19px', lineHeight: '1' }}>
              Mineral Bridge
            </div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8.5px', letterSpacing: '.8px', color: '#D9B456', marginTop: '4px' }}>
              VERIFIED MINERAL TRADING
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', letterSpacing: '.6px', color: '#9C9AA0' }}>
              {vm.dc?.issuer}
            </div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', marginTop: '3px' }}>
              {vm.dc?.no}
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 18px 6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '24px', lineHeight: '1.1' }}>
              {vm.dc?.title}
            </div>
            {vm.dc?.status ? (
              <span style={{ flex: 'none', padding: '3px 9px', borderRadius: '99px', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.3px', background: str(vm.dc?.stBg), color: str(vm.dc?.stFg) }}>
                {vm.dc?.status}
              </span>
            ) : null}
          </div>
          <div style={{ fontSize: '11.5px', color: '#6B6A70', marginTop: '4px' }}>
            {"Issued "}{vm.dc?.date}
          </div>
          {vm.dc?.hasParties ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px', marginTop: '14px', padding: '11px 12px', borderRadius: '10px', background: '#F7F6F2' }}>
              {list(vm.dc?.parties).map((pt, index) => (
                <div key={index} style={{ minWidth: '0' }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8.5px', letterSpacing: '.6px', color: '#8B8A90' }}>
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
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', letterSpacing: '.7px', color: '#8A6A1C', paddingBottom: '5px', borderBottom: '1.5px solid #121214' }}>
                {sec?.h}
              </div>
              {list(sec?.rows).map((r, index2) => (
                <div key={index2} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '8px 0', borderBottom: '1px solid #EFEDE7', fontSize: '12px' }}>
                  <span style={{ color: '#6B6A70' }}>
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
            <div style={{ fontSize: '11px', color: '#6B6A70', marginTop: '12px', lineHeight: '1.5' }}>
              {vm.dc?.note}
            </div>
          ) : null}
        </div>
        <div style={{ margin: '14px 18px 16px', paddingTop: '12px', borderTop: '1px dashed #D5D3CC', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '10px' }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '18px', fontStyle: 'italic' }}>
              {vm.dc?.signer}
            </div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8.5px', letterSpacing: '.6px', color: '#8B8A90', marginTop: '2px' }}>
              {vm.dc?.signerRole}
            </div>
          </div>
          <div style={{ width: '58px', height: '58px', flex: 'none', borderRadius: '29px', border: '1.5px solid #D9B456', color: '#8A6A1C', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'Geist Mono', monospace", fontSize: '7.5px', letterSpacing: '.4px', lineHeight: '1.2', transform: 'rotate(-12deg)' }}>
            MB
            <br />
            VERIFIED
          </div>
        </div>
      </div>
      <div style={{ fontSize: '11.5px', color: '#8B8A90', textAlign: 'center', marginTop: '12px' }}>
        {"Preview · "}{vm.dc?.file}
      </div>
    </div>
  );
}
