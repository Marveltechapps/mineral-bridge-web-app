// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function AccountTypeScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '10px 22px 24px', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.3px', fontSize: '26.2px', lineHeight: '1.05' }}>
        {vm.typeTitle}
      </div>
      <div style={{ fontSize: '14px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
        Choose Both to buy and sell from one account. Pick one buyer type and one seller type.
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 2px 8px' }}>
        I WANT TO
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list(vm.roleOpts).map((o, index) => (
          <div key={index} className="mb-press-3" onClick={o?.tap} role="radio" style={{ transition: 'transform .12s, border-color .2s, box-shadow .2s', cursor: 'pointer', padding: '13px 15px', borderRadius: '18px', background: '#fff', display: 'flex', gap: '12px', alignItems: 'center', border: `1.5px solid ${o?.border ?? ''}`, boxShadow: str(o?.shadow) }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
                {o?.name}
              </div>
              <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
                {o?.sub}
              </div>
            </div>
            <div style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '11px', transition: 'border .2s', border: str(o?.radio) }} />
          </div>
        ))}
      </div>
      {vm.showBuyer ? (
        <>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 2px 8px' }}>
            BUYER TYPE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list(vm.buyerOpts).map((o, index) => (
              <div key={index} className="mb-press-3" onClick={o?.tap} role="radio" style={{ transition: 'transform .12s, border-color .2s, box-shadow .2s', cursor: 'pointer', padding: '13px 15px', borderRadius: '18px', background: '#fff', display: 'flex', gap: '12px', alignItems: 'center', border: `1.5px solid ${o?.border ?? ''}`, boxShadow: str(o?.shadow) }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
                    {o?.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
                    {o?.sub}
                  </div>
                </div>
                <div style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '11px', transition: 'border .2s', border: str(o?.radio) }} />
              </div>
            ))}
          </div>
        </>
      ) : null}
      {vm.showSeller ? (
        <>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 2px 8px' }}>
            SELLER TYPE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list(vm.sellerOpts).map((o, index) => (
              <div key={index} className="mb-press-3" onClick={o?.tap} role="radio" style={{ transition: 'transform .12s, border-color .2s, box-shadow .2s', cursor: 'pointer', padding: '13px 15px', borderRadius: '18px', background: '#fff', display: 'flex', gap: '12px', alignItems: 'center', border: `1.5px solid ${o?.border ?? ''}`, boxShadow: str(o?.shadow) }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
                    {o?.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
                    {o?.sub}
                  </div>
                </div>
                <div style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '11px', transition: 'border .2s', border: str(o?.radio) }} />
              </div>
            ))}
          </div>
        </>
      ) : null}
      {vm.regErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.regErr}
        </div>
      ) : null}
    </div>
  );
}
