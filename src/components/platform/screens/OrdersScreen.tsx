// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function OrdersScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ display: 'flex', gap: '3px', padding: '4px', borderRadius: '16px', background: '#E7E5DF' }}>
        {list(vm.orderTabs).map((t, index) => (
          <div key={index} onClick={t?.tap} role="tab" style={{ cursor: 'pointer', flex: '1', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600', transition: 'background .2s', background: str(t?.bg), color: str(t?.fg) }}>
            <Val v={t?.label} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '13px', color: '#6B6A70' }}>
          {vm.listCount}
        </div>
        <div role="tablist" aria-label="View" style={{ display: 'flex', gap: '2px', padding: '3px', borderRadius: '12px', background: '#E7E5DF' }}>
          <button onClick={vm.setCards} style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '32px', padding: '0 12px', border: 'none', borderRadius: '9px', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', background: str(vm.cardsBg), color: '#121214' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            </svg>
            Cards
          </button>
          <button onClick={vm.setTable} style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '32px', padding: '0 12px', border: 'none', borderRadius: '9px', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', background: str(vm.tableBg), color: '#121214' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5h18M3 12h18M3 19h18" />
            </svg>
            Table
          </button>
        </div>
      </div>
      {vm.isTable ? (
        <div style={{ marginTop: '12px', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', overflowX: 'auto' }}>
          <div style={{ minWidth: '820px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px,1.1fr) minmax(180px,1.6fr) minmax(130px,1fr) minmax(150px,1fr) minmax(120px,.9fr)', gap: '16px', padding: '12px 18px', borderBottom: '1px solid #E4E2DB' }}>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                ORDER
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                ITEM
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                QTY · VALUE
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                STATUS
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                PROGRESS
              </div>
            </div>
            {list(vm.orderList).map((v, index) => (
              <div key={index} className="w5-tr" onClick={v?.tap} role="button" style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: 'minmax(150px,1.1fr) minmax(180px,1.6fr) minmax(130px,1fr) minmax(150px,1fr) minmax(120px,.9fr)', gap: '16px', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #EFEDE7' }}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px' }}>
                  {v?.id}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '0' }}>
                  <div style={{ width: '36px', height: '36px', flex: 'none', borderRadius: '9px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(v?.img) }} />
                  <div style={{ minWidth: '0' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v?.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B6A70', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v?.headline}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '13px' }}>
                  {v?.qtyLine}
                  <div style={{ color: '#6B6A70', fontSize: '12px' }}>
                    {v?.value}
                  </div>
                </div>
                <div>
                  <span style={{ display: 'inline-block', whiteSpace: 'nowrap', padding: '3px 9px', borderRadius: '99px', fontSize: '11.5px', fontWeight: '600', background: str(v?.pillBg), color: str(v?.pillFg) }}>
                    {v?.status}
                  </span>
                </div>
                <div>
                  <div style={{ height: '4px', borderRadius: '2px', background: '#EFEDE7', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#121214', width: str(v?.pct) }} />
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', color: '#8B8A90', marginTop: '5px' }}>
                    {v?.step}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {vm.isCards ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '12px', marginTop: '12px' }}>
          {list(vm.orderList).map((v, index) => (
            <div key={index} className="mb-press-3" onClick={v?.tap} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '58px', height: '58px', flex: 'none', borderRadius: '13px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(v?.img) }} />
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: '#8B8A90' }}>
                      {v?.id}
                    </span>
                    <span style={{ padding: '3px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', background: str(v?.pillBg), color: str(v?.pillFg) }}>
                      {v?.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: '600', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v?.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '2px' }}>
                    {v?.qtyLine}{" · "}{v?.value}
                  </div>
                </div>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: '#EFEDE7', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '2px', background: '#121214', width: str(v?.pct) }} />
              </div>
              <div style={{ fontSize: '12.5px', color: '#3A3940', marginTop: '8px', lineHeight: '1.4' }}>
                {v?.next}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {vm.noOrders ? (
        <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '26px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            Nothing here yet
          </div>
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>
            Orders and sell requests appear here with full tracking.
          </div>
          <div onClick={vm.ordersEmptyTap} style={{ cursor: 'pointer', margin: '14px auto 0', width: '170px', height: '44px', borderRadius: '14px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
            <Val v={vm.ordersEmptyCta} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
