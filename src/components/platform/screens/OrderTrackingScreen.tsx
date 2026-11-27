// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function OrderTrackingScreen({ vm }: { vm: ViewModel }) {
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
            {vm.ov?.step}
          </span>
          <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', background: str(vm.ov?.pillBg), color: str(vm.ov?.pillFg) }}>
            {vm.ov?.status}
          </span>
        </div>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '23.0px', lineHeight: '1.1', marginTop: '10px' }}>
          {vm.ov?.headline}
        </div>
        <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '6px', lineHeight: '1.45' }}>
          {vm.ov?.next}
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', marginTop: '14px', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '2px', background: '#F2C94C', transition: 'width .4s', width: str(vm.ov?.pct) }} />
        </div>
        <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '8px' }}>
          {"Updated "}{vm.ov?.updated}
        </div>
      </div>
      {vm.ov?.you ? (
        <div className="mb-press-1" onClick={vm.goAction} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', marginTop: '10px', height: '54px', borderRadius: '18px', background: '#F2C94C', color: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', fontWeight: '600' }}>
          <Val v={vm.ov?.actionLabel} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1F2A44" strokeWidth="2.4" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      ) : null}
      {vm.showTrack ? (
        <div className="mb-press-1" onClick={vm.goShipment} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', marginTop: '10px', height: '50px', borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', fontSize: '14px', fontWeight: '600' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 7h13v10H1zM14 10h4l3 3v4h-7M5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
          </svg>
          {"Track shipment · "}<Val v={vm.sh?.status} />
        </div>
      ) : null}
      {vm.hasDisc ? (
        <div style={{ marginTop: '12px', borderRadius: '20px', background: '#fff', border: '1px solid #F2CFCB', padding: '15px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#B42318' }}>
              DELIVERY DISCREPANCY
            </span>
            <span style={{ padding: '3px 9px', borderRadius: '99px', background: '#FDECEA', color: '#B42318', fontSize: '11px', fontWeight: '600' }}>
              {vm.disc?.status}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
            {vm.disc?.line}
          </div>
          <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '4px', lineHeight: '1.5' }}>
            “{vm.disc?.note}”
          </div>
          <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '8px', lineHeight: '1.5' }}>
            Mineral Bridge reviews the delivery photos and carrier records, then either ships the missing quantity or you can ask for money back for the difference.
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <div onClick={vm.discRefund} role="button" style={{ cursor: 'pointer', flex: '1', height: '44px', borderRadius: '14px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
              Refund the difference
            </div>
            <div onClick={vm.goChat} role="button" style={{ cursor: 'pointer', flex: '1', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
              Discuss in chat
            </div>
          </div>
        </div>
      ) : null}
      {vm.canRefundBtn ? (
        <div className="mb-press-1" onClick={vm.goRefund} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', marginTop: '10px', height: '48px', borderRadius: '16px', background: '#fff', border: '1px solid #F2CFCB', color: '#B42318', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
          </svg>
          Request a refund
        </div>
      ) : null}
      {vm.cxCan ? (
        <div className="mb-press-1" onClick={vm.goCancel} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', marginTop: '8px', height: '46px', borderRadius: '16px', background: 'transparent', border: '1px solid #E2E8F0', color: '#5B6B82', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '600' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
          <Val v={vm.cxBtn} />
        </div>
      ) : null}
      {vm.hasRefund ? (
        <div style={{ marginTop: '12px', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '15px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
              {"REFUND · "}{vm.rf?.ref}
            </span>
            <span style={{ padding: '3px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', background: str(vm.rf?.pillBg), color: str(vm.rf?.pillFg) }}>
              {vm.rf?.statusLabel}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px' }}>
            <span style={{ fontSize: '13.5px', color: '#5B6B82' }}>
              {vm.rf?.typeLabel}
            </span>
            <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '20px' }}>
              {vm.rf?.amount}
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '4px' }}>
            {vm.rf?.reason}{" · to "}{vm.rf?.to}
          </div>
          {vm.rf?.declined ? (
            <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '12px', background: '#FDECEA', color: '#B42318', fontSize: '12.5px', lineHeight: '1.45' }}>
              {vm.rf?.declineReason}
            </div>
          ) : null}
          {vm.rf?.showSteps ? (
            <div style={{ display: 'flex', gap: '4px', marginTop: '14px' }}>
              {list(vm.rf?.steps).map((t, index) => (
                <div key={index} style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ height: '4px', borderRadius: '2px', transition: 'background .3s', background: str(t?.bar) }} />
                  <div style={{ fontSize: '10px', marginTop: '5px', lineHeight: '1.25', color: str(t?.fg), fontWeight: str(t?.w) }}>
                    {t?.l}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {vm.rf?.bankRef ? (
            <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '11.5px', color: '#17704C', marginTop: '10px' }}>
              {"Bank reference "}{vm.rf?.bankRef}
            </div>
          ) : null}
        </div>
      ) : null}
      {vm.ov?.rej ? (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <div onClick={vm.rejAltTap} style={{ cursor: 'pointer', flex: '1', height: '48px', borderRadius: '16px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
            <Val v={vm.rejAltLabel} />
          </div>
          <div onClick={vm.goChat} style={{ cursor: 'pointer', flex: '1', height: '48px', borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
            Contact support
          </div>
        </div>
      ) : null}
      {vm.ov?.canDemo ? (
        <div style={{ marginTop: '10px', padding: '12px', borderRadius: '18px', border: '1px dashed #CBD5E1' }}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
            DEMO · STEPS OWNED BY MINERAL BRIDGE, SGS OR LOGISTICS
          </div>
          <div onClick={vm.runDemo} style={{ cursor: 'pointer', marginTop: '8px', height: '42px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
            <Val v={vm.ov?.demoLabel} />
          </div>
          {vm.ov?.canDeclineRefund ? (
            <div onClick={vm.demoRefundDecline} style={{ cursor: 'pointer', marginTop: '6px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600', color: '#B42318' }}>
              Simulate: refund declined with reason
            </div>
          ) : null}
          {vm.ov?.canReject ? (
            <div onClick={vm.demoReject} style={{ cursor: 'pointer', marginTop: '6px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600', color: '#B42318' }}>
              Simulate: order rejected with reason
            </div>
          ) : null}
          {vm.ov?.canChanges ? (
            <div onClick={vm.demoChanges} style={{ cursor: 'pointer', marginTop: '6px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600', color: '#8A5A06' }}>
              Simulate: changes requested
            </div>
          ) : null}
        </div>
      ) : null}
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        ORDER
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        {list(vm.orderLines).map((l, index) => (
          <div key={index} style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '14px' }}>
              <span style={{ fontWeight: '600' }}>
                {l?.n}
              </span>
              <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                {l?.q}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '3px' }}>
              {l?.g}
            </div>
          </div>
        ))}
        {vm.hasAmount ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82' }}>
              {vm.amountLabel}
            </span>
            <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
              {vm.amount}
            </span>
          </div>
        ) : null}
        {vm.hasInsp ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82' }}>
              Inspection
            </span>
            <span style={{ fontWeight: '600', textAlign: 'right' }}>
              {vm.inspLine}
            </span>
          </div>
        ) : null}
        {vm.showTrack ? (
          <div onClick={vm.goShipment} role="button" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '12px 0', fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82' }}>
              Logistics
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '600' }}>
                  {vm.sh?.status}
                </span>
                <br />
                <span style={{ color: '#5B6B82', fontSize: '12px' }}>
                  {vm.shipLine}
                </span>
              </span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        ) : null}
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        PROGRESS
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '14px 16px 4px' }}>
        {list(vm.phases).map((p, index) => (
          <div key={index} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', transition: 'background .3s', background: str(p?.dot), border: `1.5px solid ${p?.dotBorder ?? ''}`, color: '#F8FAFC' }}>
                <Val v={p?.n} />
              </div>
              <div style={{ width: '2px', flex: '1', minHeight: '12px', background: str(p?.line) }} />
            </div>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '2px 0 14px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600', color: str(p?.fg) }}>
                {p?.l}
              </span>
              <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', color: '#8A6508' }}>
                {p?.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
      {vm.hasDocs ? (
        <>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
            DOCUMENTS
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
            {list(vm.odocs).map((d, index) => (
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
        CONTACT MINERAL BRIDGE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '6px' }}>
        {list(vm.contact).map((c, index) => (
          <div key={index} onClick={c?.tap} role="button" style={{ cursor: 'pointer', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11.5px', fontWeight: '600' }}>
            <Val v={c?.l} />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        {"APPROVALS & HISTORY"}
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        {list(vm.audit).map((a, index) => (
          <div key={index} style={{ display: 'flex', gap: '11px', padding: '12px 0', borderBottom: `1px solid ${a?.line ?? ''}` }}>
            <span style={{ width: '32px', height: '32px', flex: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '9px', background: str(a?.youBg), color: str(a?.youFg) }}>
              <Val v={a?.ini} />
            </span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                  {a?.text}
                </span>
                <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', color: '#5B6B82', flex: 'none' }}>
                  {a?.at}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '2px' }}>
                {a?.who}
              </div>
              {a?.note ? (
                <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '4px', lineHeight: '1.45' }}>
                  {a?.note}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
