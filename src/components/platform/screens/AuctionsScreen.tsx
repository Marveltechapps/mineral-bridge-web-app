// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AuctionsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ position: 'relative', overflow: 'hidden', padding: '16px 18px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '100px', right: '-70px', top: '-90px', background: 'radial-gradient(circle, rgba(242,201,76,.4), rgba(242,201,76,0) 70%)', animation: 'drift1 10s ease-in-out infinite' }} />
        <div style={{ position: 'relative', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#F2C94C' }}>
          VERIFIED LOTS · LIVE BIDDING
        </div>
        <div style={{ position: 'relative', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '21.3px', lineHeight: '1.1', marginTop: '6px' }}>
          Bid on inspected lots
        </div>
        <div style={{ position: 'relative', fontSize: '12.5px', color: '#CBD5E1', marginTop: '6px', lineHeight: '1.45' }}>
          Bids rise in steps of $500. The highest bid when the timer ends wins, then you pay to release the lot.
        </div>
      </div>
      <div role="list" aria-label="How auctions work" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '8px', marginTop: '12px' }}>
        <div role="listitem" style={{ borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#1F2A44', color: '#F2C94C', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            1
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '8px' }}>
            Browse lots
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
            Live and upcoming inspected lots
          </div>
        </div>
        <div role="listitem" style={{ borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#1F2A44', color: '#F2C94C', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            2
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '8px' }}>
            Bid or auto-bid
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
            Steps of $500, up to your limit
          </div>
        </div>
        <div role="listitem" style={{ borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#1F2A44', color: '#F2C94C', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            3
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '8px' }}>
            Win the lot
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
            Highest bid when the timer ends
          </div>
        </div>
        <div role="listitem" style={{ borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#1F2A44', color: '#F2C94C', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            4
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '8px' }}>
            Pay the winning bid
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
            UPI, bank, net banking or Bitcoin
          </div>
        </div>
        <div role="listitem" style={{ borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#1F2A44', color: '#F2C94C', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            5
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '8px' }}>
            {"Dispatch & track"}
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
            Insured, sealed transport
          </div>
        </div>
        <div role="listitem" style={{ borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#1F2A44', color: '#F2C94C', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            6
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '8px' }}>
            Confirm receipt
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
            Accept delivery or raise an issue
          </div>
        </div>
      </div>
      <div className="hs" style={{ display: 'flex', gap: '3px', padding: '4px', borderRadius: '16px', background: '#E2E8F0', marginTop: '14px' }}>
        {list(vm.aucTabs).map((t, index) => (
          <div key={index} onClick={t?.tap} role="tab" style={{ cursor: 'pointer', flex: '1', minWidth: '0', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '12.5px', fontWeight: '600', whiteSpace: 'nowrap', transition: 'background .2s', background: str(t?.bg), color: str(t?.fg) }}>
            <Val v={t?.label} />
            {t?.n ? (
              <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', opacity: '.7' }}>
                {t?.n}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '12px', marginTop: '14px' }}>
        {list(vm.aucList).map((a, index) => (
          <div key={index} className="mb-press-3" onClick={a?.tap} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '10px', display: 'flex', gap: '12px', animation: 'rise .35s ease-out both' }}>
            <div style={{ position: 'relative', width: '96px', height: '96px', flex: 'none', borderRadius: '14px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(a?.img) }}>
              <span style={{ position: 'absolute', left: '6px', top: '6px', display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: '700', letterSpacing: '.3px', background: str(a?.pillBg), color: str(a?.pillFg) }}>
                {a?.live ? (
                  <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#fff', animation: 'pulse 1.2s ease-in-out infinite' }} />
                ) : null}
                <Val v={a?.pill} />
              </span>
            </div>
            <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10px', color: '#5B6B82' }}>
                {a?.id}{" · "}{a?.qty}
              </span>
              <div style={{ fontSize: '14.5px', fontWeight: '600', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {a?.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px', marginTop: 'auto' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#5B6B82' }}>
                    {a?.priceLabel}
                  </div>
                  <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '16px' }}>
                    {a?.price}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#5B6B82' }}>
                    {a?.timeLabel}
                  </div>
                  <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '12.5px', color: str(a?.timeFg) }}>
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
        <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            {vm.aucEmptyText}
          </div>
          <div style={{ fontSize: '13px', color: '#5B6B82', marginTop: '6px' }}>
            Live auctions are listed here as they open.
          </div>
        </div>
      ) : null}
    </div>
  );
}
