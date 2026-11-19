// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function ProductDetailScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div className="hs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', margin: '0 -18px', padding: '0 18px', scrollPaddingLeft: '18px', scrollSnapType: 'x mandatory' }}>
        <div style={{ flex: 'none', width: '300px', height: '220px', borderRadius: '24px', backgroundSize: 'cover', backgroundPosition: 'center', scrollSnapAlign: 'start', backgroundImage: str(vm.p?.img) }} />
        <div style={{ flex: 'none', width: '300px', height: '220px', borderRadius: '24px', backgroundSize: 'cover', backgroundPosition: '30% 70%', scrollSnapAlign: 'start', transform: 'scaleX(-1)', backgroundImage: str(vm.p?.img) }} />
        <div style={{ flex: 'none', width: '300px', height: '220px', borderRadius: '24px', backgroundSize: '180%', backgroundPosition: 'center', scrollSnapAlign: 'start', backgroundImage: str(vm.p?.img) }} />
      </div>
      <div style={{ padding: '16px 4px 0' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
          {vm.p?.mineral}{" · "}{vm.p?.form}{" · "}{vm.p?.id}
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '30px', lineHeight: '1.05', marginTop: '6px' }}>
          {vm.p?.name}
        </div>
        <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>
          {vm.p?.origin}
        </div>
      </div>
      {vm.p?.off ? (
        <div role="alert" style={{ marginTop: '14px', padding: '13px 15px', borderRadius: '16px', background: '#FDECEA', color: '#B42318', fontSize: '13.5px', fontWeight: '600' }}>
          {"This lot is sold out. Choose another lot of "}{vm.p?.mineral}.
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', marginTop: '14px' }}>
        <div style={{ borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            AVAILABLE
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>
            {vm.p?.qty}
          </div>
        </div>
        {vm.p?.hasLab ? (
          <div style={{ borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
              PURITY
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>
              {vm.p?.grade}
            </div>
          </div>
        ) : null}
        {vm.p?.noLab ? (
          <div style={{ borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
              PURITY
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', marginTop: '6px', color: '#6B6A70' }}>
              On request
            </div>
          </div>
        ) : null}
      </div>
      {vm.p?.hasLab ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            {"TESTING & CERTIFICATION"}
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70' }}>
                Testing company
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                {vm.p?.lab}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', fontSize: '13.5px' }}>
              <span style={{ color: '#6B6A70' }}>
                Certificate no.
              </span>
              <span style={{ fontWeight: '600', textAlign: 'right' }}>
                <span style={{ fontFamily: "'Geist Mono', monospace" }}>
                  {vm.p?.cert}
                </span>
              </span>
            </div>
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            {"TEST REPORTS & CERTIFICATES"}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
              {list(vm.pDocs).map((d, index) => (
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
          </div>
        </>
      ) : null}
      {vm.p?.noLab ? (
        <div style={{ marginTop: '14px', padding: '13px 15px', borderRadius: '16px', background: '#F1EFE9', fontSize: '13px', color: '#3A3940', lineHeight: '1.5' }}>
          No third-party test report for this lot yet. Ask Mineral Bridge for quality details before you order.
        </div>
      ) : null}
      {vm.p?.on ? (
        <>
          <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            QUANTITY TO ORDER
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input aria-label="Quantity" inputMode="decimal" value={vm.qty ?? ''} onChange={vm.setQty} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', flex: '1' }} />
            {vm.noUnitPick ? (
              <span style={{ width: '58px', height: '52px', flex: 'none', borderRadius: '14px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono', monospace", fontSize: '14px' }}>
                <Val v={vm.p?.unit} />
              </span>
            ) : null}
          </div>
          {vm.unitPick ? (
            <>
              <div role="radiogroup" aria-label="Unit" style={{ display: 'flex', gap: '3px', padding: '4px', borderRadius: '14px', background: '#E7E5DF', marginTop: '8px' }}>
                {list(vm.qtyUnits).map((u, index) => (
                  <div key={index} onClick={u?.tap} role="radio" style={{ cursor: 'pointer', flex: '1', height: '38px', borderRadius: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', background: str(u?.bg), color: str(u?.fg) }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {u?.label}
                    </span>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', opacity: '.7' }}>
                      {u?.short}
                    </span>
                  </div>
                ))}
              </div>
              {vm.qtyEquiv ? (
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: '#3A3940', margin: '8px 4px 0' }}>
                  {vm.qtyEquiv}
                </div>
              ) : null}
            </>
          ) : null}
          <div style={{ fontSize: '12px', color: '#6B6A70', margin: '7px 4px 0' }}>
            {"Minimum order "}{vm.minShown}{" · up to "}{vm.maxShown}{" · price is confirmed by quotation"}
          </div>
          {vm.inCartNote ? (
            <div style={{ fontSize: '12px', color: '#8A6A1C', fontWeight: '600', margin: '5px 4px 0' }}>
              {vm.inCartNote}
            </div>
          ) : null}
          {vm.qtyErr ? (
            <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
              {vm.qtyErr}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
