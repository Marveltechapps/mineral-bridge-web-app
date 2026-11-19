// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function OrderTrackingScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '24px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
            {vm.ov?.step}
          </span>
          <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', background: str(vm.ov?.pillBg), color: str(vm.ov?.pillFg) }}>
            {vm.ov?.status}
          </span>
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', lineHeight: '1.1', marginTop: '10px' }}>
          {vm.ov?.headline}
        </div>
        <div style={{ fontSize: '13px', color: '#C9C7C0', marginTop: '6px', lineHeight: '1.45' }}>
          {vm.ov?.next}
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', marginTop: '14px', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '2px', background: '#D9B456', transition: 'width .4s', width: str(vm.ov?.pct) }} />
        </div>
        <div style={{ fontSize: '11.5px', color: '#9C9AA0', marginTop: '8px' }}>
          {"Updated "}{vm.ov?.updated}
        </div>
      </div>
      {vm.ov?.you ? (
        <div className="mb-press-1" onClick={vm.goAction} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', marginTop: '10px', height: '54px', borderRadius: '18px', background: '#D9B456', color: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', fontWeight: '600' }}>
          <Val v={vm.ov?.actionLabel} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="2.4" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      ) : null}
      {vm.showTrack ? (
        <div className="mb-press-1" onClick={vm.goShipment} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', marginTop: '10px', height: '50px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', fontSize: '14px', fontWeight: '600' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 7h13v10H1zM14 10h4l3 3v4h-7M5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
          </svg>
          {"Track shipment · "}<Val v={vm.sh?.status} />
        </div>
      ) : null}
      {vm.hasDisc ? (
        <div style={{ marginTop: '12px', borderRadius: '20px', background: '#fff', border: '1px solid #F2CFCB', padding: '15px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#B42318' }}>
              DELIVERY DISCREPANCY
            </span>
            <span style={{ padding: '3px 9px', borderRadius: '99px', background: '#FDECEA', color: '#B42318', fontSize: '11px', fontWeight: '600' }}>
              {vm.disc?.status}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
            {vm.disc?.line}
          </div>
          <div style={{ fontSize: '12.5px', color: '#3A3940', marginTop: '4px', lineHeight: '1.5' }}>
            “{vm.disc?.note}”
          </div>
          <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '8px', lineHeight: '1.5' }}>
            Mineral Bridge reviews the delivery photos and carrier records, then either ships the missing quantity or you can ask for money back for the difference.
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <div onClick={vm.discRefund} role="button" style={{ cursor: 'pointer', flex: '1', height: '44px', borderRadius: '14px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
              Refund the difference
            </div>
            <div onClick={vm.goChat} role="button" style={{ cursor: 'pointer', flex: '1', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
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
        <div className="mb-press-1" onClick={vm.goCancel} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', marginTop: '8px', height: '46px', borderRadius: '16px', background: 'transparent', border: '1px solid #E4E2DB', color: '#6B6A70', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '600' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
          <Val v={vm.cxBtn} />
        </div>
      ) : null}
      {vm.hasRefund ? (
        <div style={{ marginTop: '12px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '15px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
              {"REFUND · "}{vm.rf?.ref}
            </span>
            <span style={{ padding: '3px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', background: str(vm.rf?.pillBg), color: str(vm.rf?.pillFg) }}>
              {vm.rf?.statusLabel}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px' }}>
            <span style={{ fontSize: '13.5px', color: '#6B6A70' }}>
              {vm.rf?.typeLabel}
            </span>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '20px', fontWeight: '600' }}>
              {vm.rf?.amount}
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#3A3940', marginTop: '4px' }}>
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
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11.5px', color: '#17704C', marginTop: '10px' }}>
              {"Bank reference "}{vm.rf?.bankRef}
            </div>
          ) : null}
        </div>
      ) : null}
      {vm.ov?.rej ? (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <div onClick={vm.rejAltTap} style={{ cursor: 'pointer', flex: '1', height: '48px', borderRadius: '16px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
            <Val v={vm.rejAltLabel} />
          </div>
          <div onClick={vm.goChat} style={{ cursor: 'pointer', flex: '1', height: '48px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
            Contact support
          </div>
        </div>
      ) : null}
      {vm.ov?.canDemo ? (
        <div style={{ marginTop: '10px', padding: '12px', borderRadius: '18px', border: '1px dashed #D5D3CC' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            DEMO · STEPS OWNED BY MINERAL BRIDGE, SGS OR LOGISTICS
          </div>
          <div onClick={vm.runDemo} style={{ cursor: 'pointer', marginTop: '8px', height: '42px', borderRadius: '12px', background: '#F1EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
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
            <div onClick={vm.demoChanges} style={{ cursor: 'pointer', marginTop: '6px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '600', color: '#A1620B' }}>
              Simulate: changes requested
            </div>
          ) : null}
        </div>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        ORDER
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        {list(vm.orderLines).map((l, index) => (
          <div key={index} style={{ padding: '12px 0', borderBottom: '1px solid #EFEDE7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '14px' }}>
              <span style={{ fontWeight: '600' }}>
                {l?.n}
              </span>
              <span style={{ fontFamily: "'Geist Mono', monospace" }}>
                {l?.q}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '3px' }}>
              {l?.g}
            </div>
          </div>
        ))}
        {vm.hasAmount ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
            <span style={{ color: '#6B6A70' }}>
              {vm.amountLabel}
            </span>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: '600' }}>
              {vm.amount}
            </span>
          </div>
        ) : null}
        {vm.hasInsp ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
            <span style={{ color: '#6B6A70' }}>
              Inspection
            </span>
            <span style={{ fontWeight: '600', textAlign: 'right' }}>
              {vm.inspLine}
            </span>
          </div>
        ) : null}
        {vm.showTrack ? (
          <div onClick={vm.goShipment} role="button" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '12px 0', fontSize: '13.5px' }}>
            <span style={{ color: '#6B6A70' }}>
              Logistics
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '600' }}>
                  {vm.sh?.status}
                </span>
                <br />
                <span style={{ color: '#6B6A70', fontSize: '12px' }}>
                  {vm.shipLine}
                </span>
              </span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        ) : null}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        PROGRESS
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px 16px 4px' }}>
        {list(vm.phases).map((p, index) => (
          <div key={index} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', transition: 'background .3s', background: str(p?.dot), border: `1.5px solid ${p?.dotBorder ?? ''}`, color: '#F4F2ED' }}>
                <Val v={p?.n} />
              </div>
              <div style={{ width: '2px', flex: '1', minHeight: '12px', background: str(p?.line) }} />
            </div>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '2px 0 14px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600', color: str(p?.fg) }}>
                {p?.l}
              </span>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', color: '#8A6A1C' }}>
                {p?.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
      {vm.hasDocs ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            DOCUMENTS
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            {list(vm.odocs).map((d, index) => (
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
        CONTACT MINERAL BRIDGE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '6px' }}>
        {list(vm.contact).map((c, index) => (
          <div key={index} onClick={c?.tap} role="button" style={{ cursor: 'pointer', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11.5px', fontWeight: '600' }}>
            <Val v={c?.l} />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        {"APPROVALS & HISTORY"}
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        {list(vm.audit).map((a, index) => (
          <div key={index} style={{ display: 'flex', gap: '11px', padding: '12px 0', borderBottom: `1px solid ${a?.line ?? ''}` }}>
            <span style={{ width: '32px', height: '32px', flex: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono', monospace", fontSize: '9px', fontWeight: '600', background: str(a?.youBg), color: str(a?.youFg) }}>
              <Val v={a?.ini} />
            </span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                  {a?.text}
                </span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', color: '#8B8A90', flex: 'none' }}>
                  {a?.at}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '2px' }}>
                {a?.who}
              </div>
              {a?.note ? (
                <div style={{ fontSize: '12.5px', color: '#3A3940', marginTop: '4px', lineHeight: '1.45' }}>
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
