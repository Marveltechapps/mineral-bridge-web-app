// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AuctionWonScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', textAlign: 'center', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
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
      <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto' }}>
        <span style={{ position: 'absolute', inset: '-14px', borderRadius: '62px', border: '1px dashed rgba(242,201,76,.6)', animation: 'spinSlow 16s linear infinite' }} />
        <div style={{ width: '96px', height: '96px', borderRadius: '48px', background: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop .5s both' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
          </svg>
        </div>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '27.9px', lineHeight: '1.05', marginTop: '26px' }}>
        You won the auction
      </div>
      <div style={{ fontSize: '14px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
        {vm.wonLine}
      </div>
      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginTop: '16px', padding: '9px 16px', borderRadius: '99px', background: '#fff', border: '1px solid #E2E8F0' }}>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
          WINNING BID
        </span>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '15px' }}>
          {vm.wonPrice}
        </span>
      </div>
      <div>
        <div onClick={vm.openAucDoc} role="button" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#8A6508' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View auction result certificate
        </div>
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '4px 16px', marginTop: '22px', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#1F2A44', color: '#F2C94C', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            1
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            Pay the winning bid to release the lot
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#1F2A44', color: '#F2C94C', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            2
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            Track pickup, transit and delivery
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#1F2A44', color: '#F2C94C', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            3
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            Confirm receipt to complete the order
          </span>
        </div>
      </div>
    </div>
  );
}
