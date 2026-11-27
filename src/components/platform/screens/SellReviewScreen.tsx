// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function SellReviewScreen({ vm }: { vm: ViewModel }) {
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
      <div style={{ padding: '18px', borderRadius: '20px', background: '#1F2A44', color: '#fff', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div role="img" aria-label={vm.sr?.title} style={{ width: '76px', height: '76px', flex: 'none', borderRadius: '14px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(vm.ov?.img) }} />
        <div style={{ flex: '1', minWidth: '0' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#F2C94C' }}>
            {"SELL REQUEST · "}{vm.ov?.id}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-.4px', marginTop: '4px' }}>
            {vm.sr?.title}
          </div>
          <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>
            {"Submitted "}{vm.sr?.at}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 4px 8px' }}>
        WHAT YOU SUBMITTED
      </div>
      <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 16px' }}>
        {list(vm.sr?.rows).map((r, index) => (
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
        {"PHOTOS · "}{vm.sr?.photoCount}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: '10px' }}>
        {list(vm.sr?.photos).map((ph, index) => (
          <div key={index} role="img" aria-label={ph?.label} style={{ aspectRatio: '1', borderRadius: '14px', border: '1px solid #E2E8F0', backgroundColor: '#EFF6FF', backgroundSize: str(ph?.size), backgroundPosition: str(ph?.pos), backgroundImage: str(vm.ov?.img) }} />
        ))}
      </div>
      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 4px 8px' }}>
        DOCUMENTS
      </div>
      <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 16px' }}>
        {list(vm.sr?.docs).map((d, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: `1px solid ${d?.line ?? ''}` }}>
            <span aria-hidden="true" style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '11px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />
              </svg>
            </span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '700' }}>
                {d?.n}
              </div>
              <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px' }}>
                {d?.f}
              </div>
            </div>
          </div>
        ))}
        {vm.sr?.noDocs ? (
          <div style={{ padding: '14px 0', fontSize: '13px', color: '#5B6B82' }}>
            No certificates attached. Mineral Bridge may ask for an assay report during review.
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 4px 8px' }}>
        WHAT OPERATIONS CHECKS
      </div>
      <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 16px' }}>
        {list(vm.sr?.checks).map((c, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${c?.line ?? ''}` }}>
            <span style={{ flex: '1', minWidth: '0', fontSize: '13.5px', fontWeight: '600' }}>
              {c?.l}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: str(c?.bg), color: str(c?.fg) }}>
              {c?.st}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', margin: '22px 4px 8px' }}>
        CONTACT MINERAL BRIDGE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '6px' }}>
        {list(vm.contact).map((c, index) => (
          <button key={index} onClick={c?.tap} style={{ cursor: 'pointer', height: '44px', borderRadius: '12px', background: '#fff', border: '1px solid #E2E8F0', fontFamily: 'inherit', fontSize: '12px', fontWeight: '700', color: '#1F2A44' }}>
            {c?.l}
          </button>
        ))}
      </div>
    </div>
  );
}
