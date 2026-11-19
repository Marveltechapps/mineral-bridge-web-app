// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';

export function AuctionWonScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', textAlign: 'center', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto' }}>
        <span style={{ position: 'absolute', inset: '-14px', borderRadius: '62px', border: '1px dashed rgba(217,180,86,.6)', animation: 'spinSlow 16s linear infinite' }} />
        <div style={{ width: '96px', height: '96px', borderRadius: '48px', background: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop .5s both' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D9B456" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
          </svg>
        </div>
      </div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '34px', lineHeight: '1.05', marginTop: '26px' }}>
        You won the auction
      </div>
      <div style={{ fontSize: '14px', color: '#6B6A70', marginTop: '10px', lineHeight: '1.5' }}>
        {vm.wonLine}
      </div>
      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginTop: '16px', padding: '9px 16px', borderRadius: '99px', background: '#fff', border: '1px solid #E4E2DB' }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
          WINNING BID
        </span>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '15px', fontWeight: '600' }}>
          {vm.wonPrice}
        </span>
      </div>
      <div>
        <div onClick={vm.openAucDoc} role="button" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#8A6A1C' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View auction result certificate
        </div>
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '4px 16px', marginTop: '22px', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #EFEDE7' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#121214', color: '#D9B456', fontFamily: "'Geist Mono', monospace", fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            1
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            Pay the winning bid to release the lot
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #EFEDE7' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#121214', color: '#D9B456', fontFamily: "'Geist Mono', monospace", fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            2
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            Track pickup, transit and delivery
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#121214', color: '#D9B456', fontFamily: "'Geist Mono', monospace", fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
