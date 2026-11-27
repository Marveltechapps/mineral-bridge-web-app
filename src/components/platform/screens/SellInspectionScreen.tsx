// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function SellInspectionScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
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
      <div style={{ position: 'relative', overflow: 'hidden', padding: '20px', borderRadius: '20px', background: '#1F2A44', color: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '110px', right: '-80px', top: '-100px', background: 'radial-gradient(circle, rgba(242,201,76,.35), rgba(242,201,76,0) 70%)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#F2C94C' }}>
            ON-SITE INSPECTION
          </span>
          <span style={{ padding: '3px 10px', borderRadius: '99px', background: '#F2C94C', color: '#1F2A44', fontSize: '11px', fontWeight: '800' }}>
            {vm.si?.status}
          </span>
        </div>
        <div style={{ position: 'relative', fontSize: '24px', fontWeight: '800', letterSpacing: '-.5px', marginTop: '10px' }}>
          {vm.si?.when}
        </div>
        <div style={{ position: 'relative', fontSize: '13px', color: '#CBD5E1', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
          <Val v={vm.si?.where} />
        </div>
      </div>
      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 4px 8px' }}>
        INSPECTION APPOINTMENT
      </div>
      <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 16px' }}>
        {list(vm.si?.rows).map((r, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '12px 0', borderBottom: `1px solid ${r?.line ?? ''}`, fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82', flex: 'none' }}>
              {r?.k}
            </span>
            <span style={{ fontWeight: '700', textAlign: 'right', minWidth: '0' }}>
              {r?.v}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 4px 8px' }}>
        RESULTS
      </div>
      {vm.si?.noResults ? (
        <div style={{ borderRadius: '16px', background: '#fff', border: '1px dashed #CBD5E1', padding: '18px', fontSize: '13.5px', color: '#5B6B82', lineHeight: '1.5' }}>
          The Mineral Bridge inspection report and the SGS test report appear here as soon as they are uploaded.
        </div>
      ) : null}
      <div className="g2">
        {vm.hasCompany ? (
          <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82' }}>
                MINERAL BRIDGE INSPECTION
              </span>
              <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: '#E2F2E9', color: '#17704C' }}>
                Done
              </span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', marginTop: '10px' }}>
              {vm.company?.result}
            </div>
            <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '4px' }}>
              {vm.company?.by}{" · "}{vm.company?.at}
            </div>
            <button onClick={vm.si?.viewCompany} style={{ marginTop: '12px', height: '40px', padding: '0 14px', borderRadius: '11px', border: '1.5px solid #E2E8F0', background: '#fff', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', color: '#1F2A44', cursor: 'pointer' }}>
              View inspection report
            </button>
          </div>
        ) : null}
        {vm.hasSgs ? (
          <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82' }}>
                {"SGS TEST REPORT · "}{vm.sgs?.no}
              </span>
              <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: '#E2F2E9', color: '#17704C' }}>
                {vm.sgs?.result}
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              {list(vm.sgsRows).map((r, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '6px 0', fontSize: '13px' }}>
                  <span style={{ color: '#5B6B82' }}>
                    {r?.k}
                  </span>
                  <span style={{ fontWeight: '700', textAlign: 'right' }}>
                    {r?.v}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={vm.si?.viewSgs} style={{ marginTop: '10px', height: '40px', padding: '0 14px', borderRadius: '11px', border: '1.5px solid #E2E8F0', background: '#fff', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', color: '#1F2A44', cursor: 'pointer' }}>
              View SGS report
            </button>
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 4px 8px' }}>
        PREPARE FOR INSPECTION DAY
      </div>
      <div className="g2">
        {list(vm.si?.prep).map((t, index) => (
          <div key={index} style={{ borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '14px', display: 'flex', gap: '11px' }}>
            <span aria-hidden="true" style={{ width: '24px', height: '24px', flex: 'none', borderRadius: '12px', background: '#FEF7E0', color: '#8A6508', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700' }}>
                {t?.t}
              </div>
              <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.45' }}>
                {t?.b}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
