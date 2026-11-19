// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function CheckoutScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '4px 4px 8px' }}>
        BUYER
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px 15px' }}>
        <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
          {vm.buyerLine}
        </div>
        <div style={{ fontSize: '12.5px', color: '#6B6A70', marginTop: '3px' }}>
          {vm.buyerContact}{" · KYC verified"}
        </div>
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        ITEMS
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        {list(vm.cart).map((c, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
            <span style={{ fontWeight: '600' }}>
              {c?.name}
            </span>
            <span style={{ fontFamily: "'Geist Mono', monospace" }}>
              {c?.qty}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13.5px' }}>
          <span style={{ color: '#6B6A70' }}>
            Price
          </span>
          <span style={{ fontWeight: '600' }}>
            By quotation
          </span>
        </div>
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        DELIVERY ADDRESS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {list(vm.shipFields).map((f, index) => (
          <div key={index}>
            <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '0 4px 5px' }}>
              {f?.l}
            </label>
            <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', borderColor: str(f?.border) }} />
            {f?.err ? (
              <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                {f?.err}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
