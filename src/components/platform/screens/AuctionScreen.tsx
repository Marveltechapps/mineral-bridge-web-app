// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AuctionScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.au?.outbid ? (
        <div role="alert" style={{ marginBottom: '12px', padding: '13px 15px', borderRadius: '16px', background: '#FDECEA', border: '1px solid #F2CFCB', display: 'flex', gap: '10px', alignItems: 'center', animation: 'rise .3s ease-out both' }}>
          <span style={{ flex: '1', fontSize: '13.5px', fontWeight: '600', color: '#B42318' }}>
            {"You have been outbid. Current bid "}{vm.au?.price}.
          </span>
          <span onClick={vm.bidAgain} style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#B42318', textDecoration: 'underline' }}>
            Bid again
          </span>
        </div>
      ) : null}
      <div style={{ position: 'relative', height: '200px', borderRadius: '24px', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(vm.au?.img) }}>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(18,18,20,0) 35%,rgba(18,18,20,.85))' }} />
        <span style={{ position: 'absolute', left: '12px', top: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', background: str(vm.au?.pillBg), color: str(vm.au?.pillFg) }}>
          {vm.au?.live ? (
            <span style={{ width: '7px', height: '7px', borderRadius: '4px', background: '#fff', animation: 'pulse 1.2s ease-in-out infinite' }} />
          ) : null}
          <Val v={vm.au?.pill} />
        </span>
        <div style={{ position: 'absolute', left: '16px', right: '16px', bottom: '14px', color: '#F4F2ED' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#D9B456' }}>
            {vm.au?.id}{" · "}{vm.au?.form}
          </div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '26px', lineHeight: '1.1', marginTop: '4px' }}>
            {vm.au?.name}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', marginTop: '12px' }}>
        <div style={{ padding: '14px', borderRadius: '18px', background: '#121214', color: '#F4F2ED' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
            {vm.au?.priceLabel}
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '21px', fontWeight: '600', color: '#D9B456', marginTop: '6px' }}>
            {vm.au?.price}
          </div>
          <div style={{ fontSize: '11.5px', color: '#C9C7C0', marginTop: '3px' }}>
            {vm.au?.bidCount}
          </div>
        </div>
        <div style={{ padding: '14px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            {vm.au?.timeLabel}
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '21px', fontWeight: '600', marginTop: '6px', color: str(vm.au?.timeFg) }}>
            {vm.au?.time}
          </div>
          <div style={{ fontSize: '11.5px', color: '#6B6A70', marginTop: '3px' }}>
            {vm.au?.timeSub}
          </div>
        </div>
      </div>
      {vm.au?.leading ? (
        <div style={{ marginTop: '10px', padding: '12px 14px', borderRadius: '16px', background: '#E2F2E9', display: 'flex', alignItems: 'center', gap: '10px', animation: 'rise .3s ease-out both' }}>
          <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '11px', background: '#17704C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#17704C' }}>
            You are the highest bidder{vm.au?.autoNote}
          </span>
        </div>
      ) : null}
      {vm.au?.lost ? (
        <div style={{ marginTop: '10px', padding: '14px 15px', borderRadius: '16px', background: '#F1EFE9' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {"This lot sold for "}{vm.au?.price}
          </div>
          <div style={{ fontSize: '12.5px', color: '#3A3940', marginTop: '4px', lineHeight: '1.45' }}>
            {vm.au?.lostNote}
          </div>
          <div onClick={vm.browseSimilar} style={{ cursor: 'pointer', marginTop: '10px', fontSize: '13px', fontWeight: '600', color: '#8A6A1C' }}>
            Browse similar lots →
          </div>
        </div>
      ) : null}
      {vm.au?.won ? (
        <div style={{ marginTop: '10px', padding: '14px 15px', borderRadius: '16px', background: '#E2F2E9' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#17704C' }}>
            {"You won this lot at "}{vm.au?.price}
          </div>
          <div style={{ fontSize: '12.5px', color: '#2B5F45', marginTop: '4px' }}>
            Next: pay the winning bid to release it for dispatch.
          </div>
        </div>
      ) : null}
      {vm.au?.canBid ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            {"YOUR BID · MINIMUM "}{vm.au?.min}
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div onClick={vm.bidDown} role="button" aria-label="Lower bid" style={{ cursor: 'pointer', width: '46px', height: '46px', flex: 'none', borderRadius: '14px', background: '#F1EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                −
              </div>
              <div style={{ flex: '1', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Geist Mono', monospace", fontSize: '18px', color: '#8B8A90' }}>
                  $
                </span>
                <input className="authIn" aria-label="Bid amount" inputMode="numeric" value={vm.bidAmt ?? ''} onChange={vm.setBidAmt} style={{ width: '100%', height: '52px', borderRadius: '14px', border: '1px solid #E4E2DB', padding: '0 14px 0 30px', fontFamily: "'Geist Mono', monospace", fontSize: '20px', fontWeight: '600', textAlign: 'center' }} />
              </div>
              <div onClick={vm.bidUp} role="button" aria-label="Raise bid" style={{ cursor: 'pointer', width: '46px', height: '46px', flex: 'none', borderRadius: '14px', background: '#121214', color: '#D9B456', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                +
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginTop: '10px' }}>
              {list(vm.bidQuick).map((q, index) => (
                <div key={index} onClick={q?.tap} role="button" style={{ cursor: 'pointer', height: '36px', borderRadius: '11px', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono', monospace", fontSize: '12.5px', fontWeight: '600' }}>
                  <Val v={q?.label} />
                </div>
              ))}
            </div>
            <div onClick={vm.toggleAuto} role="switch" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #EFEDE7' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
                  Auto-bid
                </div>
                <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '2px' }}>
                  We bid for you in $500 steps up to your limit
                </div>
              </div>
              <span style={{ width: '44px', height: '26px', flex: 'none', borderRadius: '13px', position: 'relative', transition: 'background .2s', background: str(vm.autoBg) }}>
                <span style={{ position: 'absolute', top: '2px', width: '22px', height: '22px', borderRadius: '11px', background: '#fff', transition: 'left .25s', left: str(vm.autoX) }} />
              </span>
            </div>
            {vm.autoOn ? (
              <div style={{ position: 'relative', marginTop: '10px', animation: 'rise .25s ease-out both' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#8B8A90' }}>
                  Max $
                </span>
                <input className="authIn" aria-label="Auto-bid limit" inputMode="numeric" value={vm.autoMax ?? ''} onChange={vm.setAutoMax} style={{ width: '100%', height: '46px', borderRadius: '12px', border: '1px solid #E4E2DB', padding: '0 14px 0 52px', fontFamily: "'Geist Mono', monospace", fontSize: '15px', fontWeight: '600' }} />
              </div>
            ) : null}
          </div>
          {vm.bidErr ? (
            <div role="alert" style={{ marginTop: '10px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
              {vm.bidErr}
            </div>
          ) : null}
        </>
      ) : null}
      {vm.au?.upcoming ? (
        <div style={{ marginTop: '12px', padding: '13px 15px', borderRadius: '16px', background: '#F1EFE9', fontSize: '13px', color: '#3A3940', lineHeight: '1.5' }}>
          {"Bidding opens "}{vm.au?.opens}{". Starting bid "}{vm.au?.startBid}. Turn on a reminder and we will message you when it opens.
        </div>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        LOT
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        {list(vm.au?.rows).map((r, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${r?.line ?? ''}`, fontSize: '13.5px' }}>
            <span style={{ color: '#6B6A70' }}>
              {r?.k}
            </span>
            <span style={{ fontWeight: '600', textAlign: 'right' }}>
              {r?.v}
            </span>
          </div>
        ))}
      </div>
      {vm.au?.hasBids ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            BID HISTORY
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            {list(vm.au?.bids).map((b, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: `1px solid ${b?.line ?? ''}` }}>
                <span style={{ width: '30px', height: '30px', flex: 'none', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', fontWeight: '600', background: str(b?.bg), color: str(b?.fg) }}>
                  <Val v={b?.ini} />
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
                    {b?.who}
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', color: '#8B8A90', marginTop: '2px' }}>
                    {b?.at}
                  </div>
                </div>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '14px', fontWeight: '600' }}>
                  {b?.amt}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {vm.devTools && vm.au?.live ? (
        <div style={{ marginTop: '12px', padding: '12px', borderRadius: '18px', border: '1px dashed #D5D3CC' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            DEMO · OTHER BIDDERS AND THE AUCTION CLOCK
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '6px', marginTop: '8px' }}>
            <div onClick={vm.simOutbid} style={{ cursor: 'pointer', height: '40px', borderRadius: '12px', background: '#F1EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600' }}>
              Another bidder bids
            </div>
            <div onClick={vm.simEnd} style={{ cursor: 'pointer', height: '40px', borderRadius: '12px', background: '#F1EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600' }}>
              End auction now
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
