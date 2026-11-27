// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AuctionScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.aj?.on ? (
        <section aria-label="Auction journey" style={{ marginBottom: '16px', borderRadius: '18px', background: '#1F2A44', color: '#fff', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#F2C94C' }}>
              {"AUCTION JOURNEY · "}{vm.aj?.ref}
            </span>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
              {vm.aj?.note}
            </span>
          </div>
          <div className="hs" style={{ display: 'flex', overflowX: 'auto', marginTop: '12px', scrollbarWidth: 'none' }}>
            {list(vm.aj?.steps).map((t, index) => (
              <div key={index} style={{ flex: '1 0 84px', minWidth: '84px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '12px', left: 'calc(50% + 14px)', right: 'calc(-50% + 14px)', height: '2px', background: str(t?.line) }} />
                <span style={{ width: '26px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', background: str(t?.dotBg), color: str(t?.dotFg), border: `2px solid ${t?.dotBd ?? ''}`, position: 'relative', zIndex: '1' }}>
                  <Val v={t?.n} />
                </span>
                <span style={{ fontSize: '11px', fontWeight: str(t?.fw), color: str(t?.fg), textAlign: 'center', lineHeight: '1.25' }}>
                  {t?.l}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
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
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(15,23,42,0) 35%,rgba(15,23,42,.85))' }} />
        <span style={{ position: 'absolute', left: '12px', top: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', background: str(vm.au?.pillBg), color: str(vm.au?.pillFg) }}>
          {vm.au?.live ? (
            <span style={{ width: '7px', height: '7px', borderRadius: '4px', background: '#fff', animation: 'pulse 1.2s ease-in-out infinite' }} />
          ) : null}
          <Val v={vm.au?.pill} />
        </span>
        <div style={{ position: 'absolute', left: '16px', right: '16px', bottom: '14px', color: '#F8FAFC' }}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#F2C94C' }}>
            {vm.au?.id}{" · "}{vm.au?.form}
          </div>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '21.3px', lineHeight: '1.1', marginTop: '4px' }}>
            {vm.au?.name}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', marginTop: '12px' }}>
        <div style={{ padding: '14px', borderRadius: '18px', background: '#1F2A44', color: '#F8FAFC' }}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
            {vm.au?.priceLabel}
          </div>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '21px', color: '#F2C94C', marginTop: '6px' }}>
            {vm.au?.price}
          </div>
          <div style={{ fontSize: '11.5px', color: '#CBD5E1', marginTop: '3px' }}>
            {vm.au?.bidCount}
          </div>
        </div>
        <div style={{ padding: '14px', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0' }}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
            {vm.au?.timeLabel}
          </div>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '21px', marginTop: '6px', color: str(vm.au?.timeFg) }}>
            {vm.au?.time}
          </div>
          <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '3px' }}>
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
        <div style={{ marginTop: '10px', padding: '14px 15px', borderRadius: '16px', background: '#F1F5F9' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {"This lot sold for "}{vm.au?.price}
          </div>
          <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '4px', lineHeight: '1.45' }}>
            {vm.au?.lostNote}
          </div>
          <div onClick={vm.browseSimilar} style={{ cursor: 'pointer', marginTop: '10px', fontSize: '13px', fontWeight: '600', color: '#8A6508' }}>
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
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
            {"YOUR BID · MINIMUM "}{vm.au?.min}
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div onClick={vm.bidDown} role="button" aria-label="Lower bid" style={{ cursor: 'pointer', width: '46px', height: '46px', flex: 'none', borderRadius: '14px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                −
              </div>
              <div style={{ flex: '1', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '18px', color: '#5B6B82' }}>
                  $
                </span>
                <input className="authIn" aria-label="Bid amount" inputMode="numeric" value={vm.bidAmt ?? ''} onChange={vm.setBidAmt} style={{ width: '100%', height: '52px', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '0 14px 0 30px', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '20px', textAlign: 'center' }} />
              </div>
              <div onClick={vm.bidUp} role="button" aria-label="Raise bid" style={{ cursor: 'pointer', width: '46px', height: '46px', flex: 'none', borderRadius: '14px', background: '#1F2A44', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                +
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginTop: '10px' }}>
              {list(vm.bidQuick).map((q, index) => (
                <div key={index} onClick={q?.tap} role="button" style={{ cursor: 'pointer', height: '36px', borderRadius: '11px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '12.5px' }}>
                  <Val v={q?.label} />
                </div>
              ))}
            </div>
            <div onClick={vm.toggleAuto} role="switch" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
                  Auto-bid
                </div>
                <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '2px' }}>
                  We bid for you in $500 steps up to your limit
                </div>
              </div>
              <span style={{ width: '44px', height: '26px', flex: 'none', borderRadius: '13px', position: 'relative', transition: 'background .2s', background: str(vm.autoBg) }}>
                <span style={{ position: 'absolute', top: '2px', width: '22px', height: '22px', borderRadius: '11px', background: '#fff', transition: 'left .25s', left: str(vm.autoX) }} />
              </span>
            </div>
            {vm.autoOn ? (
              <div style={{ position: 'relative', marginTop: '10px', animation: 'rise .25s ease-out both' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#5B6B82' }}>
                  Max $
                </span>
                <input className="authIn" aria-label="Auto-bid limit" inputMode="numeric" value={vm.autoMax ?? ''} onChange={vm.setAutoMax} onBlur={vm.commitAutoMax} style={{ width: '100%', height: '46px', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '0 14px 0 52px', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '15px' }} />
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
        <div style={{ marginTop: '12px', padding: '13px 15px', borderRadius: '16px', background: '#F1F5F9', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
          {"Bidding opens "}{vm.au?.opens}{". Starting bid "}{vm.au?.startBid}. Turn on a reminder and we will message you when it opens.
        </div>
      ) : null}
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        LOT
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        {list(vm.au?.rows).map((r, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${r?.line ?? ''}`, fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82' }}>
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
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
            BID HISTORY
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
            {list(vm.au?.bids).map((b, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: `1px solid ${b?.line ?? ''}` }}>
                <span style={{ width: '30px', height: '30px', flex: 'none', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', background: str(b?.bg), color: str(b?.fg) }}>
                  <Val v={b?.ini} />
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
                    {b?.who}
                  </div>
                  <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', color: '#5B6B82', marginTop: '2px' }}>
                    {b?.at}
                  </div>
                </div>
                <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '14px' }}>
                  {b?.amt}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {vm.devTools && vm.au?.live ? (
        <div style={{ marginTop: '12px', padding: '12px', borderRadius: '18px', border: '1px dashed #CBD5E1' }}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
            DEMO · OTHER BIDDERS AND THE AUCTION CLOCK
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '6px', marginTop: '8px' }}>
            <div onClick={vm.simOutbid} style={{ cursor: 'pointer', height: '40px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600' }}>
              Another bidder bids
            </div>
            <div onClick={vm.simEnd} style={{ cursor: 'pointer', height: '40px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600' }}>
              End auction now
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
