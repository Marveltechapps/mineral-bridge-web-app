// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AuctionsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ position: 'relative', overflow: 'hidden', padding: '16px 18px', borderRadius: '22px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '100px', right: '-70px', top: '-90px', background: 'radial-gradient(circle, rgba(217,180,86,.4), rgba(217,180,86,0) 70%)', animation: 'drift1 10s ease-in-out infinite' }} />
        <div style={{ position: 'relative', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#D9B456' }}>
          VERIFIED LOTS · LIVE BIDDING
        </div>
        <div style={{ position: 'relative', fontFamily: "'Instrument Serif', serif", fontSize: '26px', lineHeight: '1.1', marginTop: '6px' }}>
          Bid on inspected lots
        </div>
        <div style={{ position: 'relative', fontSize: '12.5px', color: '#C9C7C0', marginTop: '6px', lineHeight: '1.45' }}>
          Bids rise in steps of $500. The highest bid when the timer ends wins, then you pay to release the lot.
        </div>
      </div>
      <div className="hs" style={{ display: 'flex', gap: '3px', padding: '4px', borderRadius: '16px', background: '#E7E5DF', marginTop: '14px' }}>
        {list(vm.aucTabs).map((t, index) => (
          <div key={index} onClick={t?.tap} role="tab" style={{ cursor: 'pointer', flex: '1', minWidth: '0', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '12.5px', fontWeight: '600', whiteSpace: 'nowrap', transition: 'background .2s', background: str(t?.bg), color: str(t?.fg) }}>
            <Val v={t?.label} />
            {t?.n ? (
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', opacity: '.7' }}>
                {t?.n}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '12px', marginTop: '14px' }}>
        {list(vm.aucList).map((a, index) => (
          <div key={index} className="mb-press-3" onClick={a?.tap} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '10px', display: 'flex', gap: '12px', animation: 'rise .35s ease-out both' }}>
            <div style={{ position: 'relative', width: '96px', height: '96px', flex: 'none', borderRadius: '14px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(a?.img) }}>
              <span style={{ position: 'absolute', left: '6px', top: '6px', display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: '700', letterSpacing: '.3px', background: str(a?.pillBg), color: str(a?.pillFg) }}>
                {a?.live ? (
                  <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#fff', animation: 'pulse 1.2s ease-in-out infinite' }} />
                ) : null}
                <Val v={a?.pill} />
              </span>
            </div>
            <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', color: '#8B8A90' }}>
                {a?.id}{" · "}{a?.qty}
              </span>
              <div style={{ fontSize: '14.5px', fontWeight: '600', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {a?.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px', marginTop: 'auto' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6B6A70' }}>
                    {a?.priceLabel}
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '16px', fontWeight: '600' }}>
                    {a?.price}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6B6A70' }}>
                    {a?.timeLabel}
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12.5px', fontWeight: '600', color: str(a?.timeFg) }}>
                    {a?.time}
                  </div>
                </div>
              </div>
              {a?.myTag ? (
                <span style={{ alignSelf: 'flex-start', marginTop: '6px', padding: '2px 8px', borderRadius: '99px', fontSize: '10.5px', fontWeight: '600', background: str(a?.myBg), color: str(a?.myFg) }}>
                  {a?.myTag}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {vm.aucEmpty ? (
        <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            {vm.aucEmptyText}
          </div>
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>
            Live auctions are listed here as they open.
          </div>
        </div>
      ) : null}
    </div>
  );
}
