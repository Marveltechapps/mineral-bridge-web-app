// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function RefundsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
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
        <div style={{ borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', overflowX: 'auto', marginBottom: '12px' }}>
          <div style={{ minWidth: '800px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px,1fr) minmax(200px,1.6fr) minmax(110px,.8fr) minmax(160px,1.2fr) minmax(120px,.8fr)', gap: '16px', padding: '12px 18px', borderBottom: '1px solid #E4E2DB' }}>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                REFUND
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                ORDER
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                AMOUNT
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                REASON
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.7px', color: '#8B8A90' }}>
                STATUS
              </div>
            </div>
            {list(vm.refundList).map((r, index) => (
              <div key={index} className="w5-tr" onClick={r?.tap} role="button" style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: 'minmax(140px,1fr) minmax(200px,1.6fr) minmax(110px,.8fr) minmax(160px,1.2fr) minmax(120px,.8fr)', gap: '16px', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #EFEDE7' }}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px' }}>
                  {r?.ref}
                  <div style={{ color: '#8B8A90', fontSize: '11px', marginTop: '2px' }}>
                    {r?.at}
                  </div>
                </div>
                <div style={{ minWidth: '0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r?.title}
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: '#6B6A70' }}>
                    {r?.oid}
                  </div>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
                  {r?.amount}
                </div>
                <div style={{ fontSize: '12.5px', color: '#3A3940' }}>
                  {r?.reason}
                </div>
                <div>
                  <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '99px', fontSize: '11.5px', fontWeight: '600', background: str(r?.pillBg), color: str(r?.pillFg) }}>
                    {r?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {vm.isCards ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '12px' }}>
          {list(vm.refundList).map((r, index) => (
            <div key={index} onClick={r?.tap} role="button" style={{ cursor: 'pointer', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px 15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: '#8B8A90' }}>
                  {r?.ref}{" · "}{r?.oid}
                </span>
                <span style={{ padding: '3px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', background: str(r?.pillBg), color: str(r?.pillFg) }}>
                  {r?.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {r?.title}
                </span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '15px', fontWeight: '600' }}>
                  {r?.amount}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '3px' }}>
                {r?.reason}{" · "}{r?.at}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {vm.noRefunds ? (
        <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '26px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            No refund requests
          </div>
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>
            You can request a refund from any paid order that is not yet completed.
          </div>
        </div>
      ) : null}
    </div>
  );
}
