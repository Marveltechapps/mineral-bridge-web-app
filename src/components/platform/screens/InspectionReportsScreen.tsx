// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';

export function InspectionReportsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '16px', borderRadius: '22px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
          {vm.ov?.id}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>
          {vm.ov?.title}
        </div>
        <div style={{ fontSize: '12.5px', color: '#C9C7C0', marginTop: '3px' }}>
          {vm.ov?.qtyLine}
        </div>
      </div>
      {vm.noReports ? (
        <div style={{ marginTop: '12px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '22px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            Reports not uploaded yet
          </div>
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>
            They appear here after the inspection.
          </div>
        </div>
      ) : null}
      {vm.hasCompany ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            1 · MINERAL BRIDGE INSPECTION
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70' }}>
                Inspected by
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.company?.by}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70' }}>
                Date
              </span>
              <span style={{ fontWeight: '600' }}>
                {vm.company?.at}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '12px 0', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70' }}>
                Result
              </span>
              <span style={{ fontWeight: '600', color: '#17704C', textAlign: 'right' }}>
                {vm.company?.result}
              </span>
            </div>
          </div>
        </>
      ) : null}
      {vm.hasSgs ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            2 · THIRD-PARTY TEST (SGS)
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70' }}>
                Report no.
              </span>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: '600' }}>
                {vm.sgs?.no}
              </span>
            </div>
            {list(vm.sgsRows).map((r, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
                <span style={{ color: '#6B6A70' }}>
                  {r?.k}
                </span>
                <span style={{ fontWeight: '600', textAlign: 'right' }}>
                  {r?.v}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70' }}>
                Issued
              </span>
              <span style={{ fontWeight: '600' }}>
                {vm.sgs?.at}
              </span>
            </div>
          </div>
        </>
      ) : null}
      {vm.hasReports ? (
        <>
          <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 6px' }}>
            NOTE (NEEDED TO REQUEST CLARIFICATION)
          </label>
          <textarea aria-label="Clarification note" value={vm.repNote ?? ''} onChange={vm.setRepNote} placeholder="What needs clarifying?" style={{ width: '100%', minHeight: '84px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px 15px', fontSize: '14px', resize: 'none', lineHeight: '1.45' }} />
          {vm.repErr ? (
            <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
              {vm.repErr}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
