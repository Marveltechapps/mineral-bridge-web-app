// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function ShipmentScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.sx?.on ? (
        <section aria-label="Sell journey" style={{ marginBottom: '16px', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82' }}>
              {"SELL JOURNEY · "}{vm.sx?.ref}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: str(vm.sx?.pillBg), color: str(vm.sx?.pillFg) }}>
              {vm.sx?.status}
            </span>
          </div>
          <div className="hs" style={{ display: 'flex', overflowX: 'auto', padding: '14px 8px 12px', scrollbarWidth: 'none' }}>
            {list(vm.sx?.steps).map((t, index) => (
              <button key={index} onClick={t?.tap} aria-current={t?.cur} title={t?.l} style={{ flex: '1 0 92px', minWidth: '92px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', border: 'none', background: 'none', padding: '0 4px', position: 'relative', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '13px', left: 'calc(50% + 16px)', right: 'calc(-50% + 16px)', height: '2px', background: str(t?.line) }} />
                <span style={{ width: '28px', height: '28px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11.5px', fontWeight: '800', background: str(t?.dotBg), color: str(t?.dotFg), border: `2px solid ${t?.dotBd ?? ''}`, position: 'relative', zIndex: '1' }}>
                  <Val v={t?.n} />
                </span>
                <span style={{ fontSize: '11px', fontWeight: str(t?.fw), color: str(t?.fg), textAlign: 'center', lineHeight: '1.25' }}>
                  {t?.l}
                </span>
              </button>
            ))}
          </div>
          <div style={{ padding: '14px 16px 16px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span aria-hidden="true" style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '17px', background: str(vm.sx?.iconBg), color: str(vm.sx?.iconFg), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={vm.sx?.icon} />
                </svg>
              </span>
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>
                  {vm.sx?.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '3px', lineHeight: '1.5' }}>
                  {vm.sx?.note}
                </div>
              </div>
            </div>
            {vm.sx?.hasSub ? (
              <div style={{ marginTop: '12px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 14px' }}>
                {list(vm.sx?.sub).map((b, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: `1px solid ${b?.line ?? ''}` }}>
                    <span aria-hidden="true" style={{ width: '20px', height: '20px', flex: 'none', borderRadius: '10px', background: str(b?.bg), border: `1.5px solid ${b?.bd ?? ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {b?.done ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : null}
                    </span>
                    <span style={{ flex: '1', minWidth: '0', fontSize: '13px', fontWeight: str(b?.fw), color: str(b?.fg) }}>
                      {b?.l}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#5B6B82', flex: 'none' }}>
                      {b?.who}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              {vm.sx?.you ? (
                <button className="authBtn" onClick={vm.sx?.youTap} style={{ height: '46px', padding: '0 18px', borderRadius: '13px', border: 'none', background: '#F2C94C', color: '#1F2A44', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                  {vm.sx?.youLabel}{" →"}
                </button>
              ) : null}
              {vm.sx?.cont ? (
                <button className="authBtn" onClick={vm.sx?.contTap} style={{ height: '46px', padding: '0 18px', borderRadius: '13px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                  {vm.sx?.contLabel}{" →"}
                </button>
              ) : null}
              {vm.sx?.openCur ? (
                <button className="authBtn" onClick={vm.sx?.openCurTap} style={{ height: '46px', padding: '0 18px', borderRadius: '13px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                  {vm.sx?.openCurLabel}{" →"}
                </button>
              ) : null}
            </div>
            {vm.sx?.demo ? (
              <div style={{ marginTop: '12px', padding: '12px', borderRadius: '14px', border: '1px dashed #CBD5E1', background: '#fff' }}>
                <div style={{ fontSize: '10.5px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82' }}>
                  {"DEMO · STEP OWNED BY "}{vm.sx?.demoWho}
                </div>
                <button onClick={vm.runDemo} style={{ marginTop: '8px', width: '100%', height: '42px', borderRadius: '12px', border: 'none', background: '#F1F5F9', fontFamily: 'inherit', fontWeight: '700', fontSize: '13px', color: '#1F2A44', cursor: 'pointer' }}>
                  {vm.sx?.demoLabel}
                </button>
                {vm.sx?.canChanges ? (
                  <button onClick={vm.demoChanges} style={{ marginTop: '6px', width: '100%', height: '36px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '700', color: '#8A5A06', cursor: 'pointer' }}>
                    Simulate: changes requested
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
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
      <div style={{ padding: '18px', borderRadius: '24px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
            {vm.sh?.id}
          </span>
          <span style={{ padding: '4px 10px', borderRadius: '99px', background: '#F2C94C', color: '#1F2A44', fontSize: '11px', fontWeight: '600' }}>
            {vm.sh?.status}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', gap: '10px', alignItems: 'center', marginTop: '16px' }}>
          <div>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
              FROM
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px', lineHeight: '1.35' }}>
              {vm.sh?.from}
            </div>
          </div>
          <svg width="34" height="14" viewBox="0 0 34 14" fill="none" stroke="#F2C94C" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 7h28M25 2l5 5-5 5" />
          </svg>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
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
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        SHIPMENT
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
          <span style={{ color: '#5B6B82', flex: 'none' }}>
            Logistics partner
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.partner}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
          <span style={{ color: '#5B6B82', flex: 'none' }}>
            Contact
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.contact}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
          <span style={{ color: '#5B6B82', flex: 'none' }}>
            Mode
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.mode}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
          <span style={{ color: '#5B6B82', flex: 'none' }}>
            Pickup
          </span>
          <span style={{ fontWeight: '600', textAlign: 'right' }}>
            {vm.sh?.pickup}
          </span>
        </div>
        {vm.sh?.vehicle ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
              <span style={{ color: '#5B6B82', flex: 'none' }}>
                Vehicle
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.sh?.vehicle}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
              <span style={{ color: '#5B6B82', flex: 'none' }}>
                Driver
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.sh?.driver}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
              <span style={{ color: '#5B6B82', flex: 'none' }}>
                Seals
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.sh?.seals}
              </span>
            </div>
          </>
        ) : null}
        {vm.sh?.eta ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82', flex: 'none' }}>
              Estimated arrival
            </span>
            <span style={{ fontWeight: '600', textAlign: 'right' }}>
              {vm.sh?.eta}
            </span>
          </div>
        ) : null}
        {vm.sh?.location ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82', flex: 'none' }}>
              Last location
            </span>
            <span style={{ fontWeight: '600', textAlign: 'right' }}>
              {vm.sh?.location}
            </span>
          </div>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', fontSize: '13.5px' }}>
          <span style={{ color: '#5B6B82' }}>
            Tracking no.
          </span>
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
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
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
            TRANSPORT DOCUMENTS
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
            {list(vm.shipDocs).map((d, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '11px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />
                  </svg>
                </span>
                <div onClick={d?.tap} role="button" style={{ cursor: 'pointer', flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d?.n}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d?.f}
                  </div>
                </div>
                <div onClick={d?.tap} role="button" aria-label="Preview" style={{ cursor: 'pointer', width: '34px', height: '34px', flex: 'none', borderRadius: '11px', border: '1px solid #E2E8F0', color: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div onClick={d?.dl} role="button" aria-label="Download" style={{ cursor: 'pointer', width: '34px', height: '34px', flex: 'none', borderRadius: '11px', background: '#1F2A44', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        TRACKING UPDATES
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '14px 16px 2px' }}>
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
              <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', color: '#5B6B82', marginTop: '3px' }}>
                {e?.at}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        CONTACT
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px' }}>
        <div onClick={vm.callDriver} role="button" style={{ cursor: 'pointer', height: '46px', borderRadius: '14px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
          Call logistics partner
        </div>
        <div onClick={vm.goChat} role="button" style={{ cursor: 'pointer', height: '46px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
          Chat with Mineral Bridge
        </div>
      </div>
    </div>
  );
}
