// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function ShipmentScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '24px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
            {vm.sh?.id}
          </span>
          <span style={{ padding: '4px 10px', borderRadius: '99px', background: '#D9B456', color: '#121214', fontSize: '11px', fontWeight: '600' }}>
            {vm.sh?.status}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', gap: '10px', alignItems: 'center', marginTop: '16px' }}>
          <div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
              FROM
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px', lineHeight: '1.35' }}>
              {vm.sh?.from}
            </div>
          </div>
          <svg width="34" height="14" viewBox="0 0 34 14" fill="none" stroke="#D9B456" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 7h28M25 2l5 5-5 5" />
          </svg>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
              TO
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px', lineHeight: '1.35' }}>
              {vm.sh?.to}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
          {list(vm.shipSteps).map((p, index) => (
            <div key={index} style={{ flex: '1' }}>
              <div style={{ height: '4px', borderRadius: '2px', background: str(p?.bar) }} />
              <div style={{ fontSize: '10.5px', marginTop: '6px', color: str(p?.fg) }}>
                {p?.l}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        SHIPMENT
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
          <span style={{ color: '#6B6A70', flex: 'none' }}>
            Logistics partner
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.partner}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
          <span style={{ color: '#6B6A70', flex: 'none' }}>
            Contact
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.contact}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
          <span style={{ color: '#6B6A70', flex: 'none' }}>
            Mode
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.mode}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
          <span style={{ color: '#6B6A70', flex: 'none' }}>
            Pickup
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.pickup}
          </span>
        </div>
        {vm.sh?.vehicle ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70', flex: 'none' }}>
                Vehicle
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.sh?.vehicle}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70', flex: 'none' }}>
                Driver
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.sh?.driver}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70', flex: 'none' }}>
                Seals
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.sh?.seals}
              </span>
            </div>
          </>
        ) : null}
        {vm.sh?.eta ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
            <span style={{ color: '#6B6A70', flex: 'none' }}>
              Estimated arrival
            </span>
            <span style={{ fontWeight: '600', textAlign: 'right' }}>
              {vm.sh?.eta}
            </span>
          </div>
        ) : null}
        {vm.sh?.location ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
            <span style={{ color: '#6B6A70', flex: 'none' }}>
              Last location
            </span>
            <span style={{ fontWeight: '600', textAlign: 'right' }}>
              {vm.sh?.location}
            </span>
          </div>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', fontSize: '13.5px' }}>
          <span style={{ color: '#6B6A70' }}>
            Tracking no.
          </span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: '600' }}>
            {vm.sh?.id}
          </span>
        </div>
      </div>
      {vm.sh?.pod ? (
        <div style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '18px', background: '#E2F2E9', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ width: '28px', height: '28px', flex: 'none', borderRadius: '14px', background: '#17704C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <div style={{ flex: '1', minWidth: '0' }}>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#17704C' }}>
              Proof of delivery
            </div>
            <div style={{ fontSize: '12px', color: '#2B5F45', marginTop: '2px' }}>
              {vm.sh?.pod}
            </div>
          </div>
          <span onClick={vm.openPod} style={{ cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', color: '#17704C' }}>
            View
          </span>
        </div>
      ) : null}
      {vm.hasShipDocs ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            TRANSPORT DOCUMENTS
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            {list(vm.shipDocs).map((d, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: '1px solid #EFEDE7' }}>
                <span style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '11px', background: '#F1EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3A3940" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />
                  </svg>
                </span>
                <div onClick={d?.tap} role="button" style={{ cursor: 'pointer', flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d?.n}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#8B8A90', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d?.f}
                  </div>
                </div>
                <div onClick={d?.tap} role="button" aria-label="Preview" style={{ cursor: 'pointer', width: '34px', height: '34px', flex: 'none', borderRadius: '11px', border: '1px solid #E4E2DB', color: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div onClick={d?.dl} role="button" aria-label="Download" style={{ cursor: 'pointer', width: '34px', height: '34px', flex: 'none', borderRadius: '11px', background: '#121214', color: '#D9B456', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        TRACKING UPDATES
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px 16px 2px' }}>
        {list(vm.shipEvents).map((e, index) => (
          <div key={index} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '5px', marginTop: '4px', background: str(e?.dot) }} />
              <span style={{ width: '2px', flex: '1', minHeight: '14px', background: str(e?.line) }} />
            </div>
            <div style={{ flex: '1', paddingBottom: '14px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {e?.t}
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', color: '#8B8A90', marginTop: '3px' }}>
                {e?.at}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        CONTACT
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px' }}>
        <div onClick={vm.callDriver} role="button" style={{ cursor: 'pointer', height: '46px', borderRadius: '14px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
          Call logistics partner
        </div>
        <div onClick={vm.goChat} role="button" style={{ cursor: 'pointer', height: '46px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
          Chat with Mineral Bridge
        </div>
      </div>
    </div>
  );
}
