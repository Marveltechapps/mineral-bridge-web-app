// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function CartScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.hasCart ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list(vm.cart).map((c, index) => (
              <div key={index} style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '10px', display: 'flex', gap: '12px' }}>
                <div style={{ width: '70px', height: '70px', flex: 'none', borderRadius: '13px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(c?.img) }} />
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
                    {c?.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#6B6A70', marginTop: '3px' }}>
                    {c?.qty}{" · "}{c?.grade}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12.5px', fontWeight: '600' }}>
                    <span onClick={c?.edit} style={{ cursor: 'pointer', color: '#8A6A1C' }}>
                      Change quantity
                    </span>
                    <span onClick={c?.remove} style={{ cursor: 'pointer', color: '#B42318' }}>
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '18px', background: '#121214', color: '#F4F2ED' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              No payment now
            </div>
            <div style={{ fontSize: '12.5px', color: '#C9C7C0', marginTop: '4px', lineHeight: '1.5' }}>
              Mineral Bridge reviews your order and sends a quotation. You pay only after the price is agreed and the e-contract is signed.
            </div>
          </div>
        </>
      ) : null}
      {vm.cartEmpty ? (
        <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '28px 20px', textAlign: 'center', marginTop: '10px' }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '26px' }}>
            Your cart is empty
          </div>
          <div style={{ fontSize: '13.5px', color: '#6B6A70', marginTop: '6px' }}>
            Browse verified lots and add the quantity you need.
          </div>
          <div onClick={vm.goBuy} style={{ cursor: 'pointer', margin: '16px auto 0', width: '180px', height: '46px', borderRadius: '14px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
            Browse minerals
          </div>
        </div>
      ) : null}
    </div>
  );
}
