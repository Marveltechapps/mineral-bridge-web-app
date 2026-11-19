// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function SellerConfirmationScreen({ vm }: { vm: ViewModel }) {
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
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        HOW YOU WANT TO BE PAID
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.scMethods).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {list(vm.scFields).map((f, index) => (
            <div key={index}>
              <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '0 4px 5px' }}>
                {f?.l}
              </label>
              <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', borderColor: str(f?.border) }} />
              {f?.err ? (
                <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                  {f?.err}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        {"INSPECTION & PICKUP DATE"}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.scDays).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        TIME
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.scSlots).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        LOCATION
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {list(vm.scAddr).map((f, index) => (
          <div key={index}>
            <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '0 4px 5px' }}>
              {f?.l}
            </label>
            <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', borderColor: str(f?.border) }} />
            {f?.err ? (
              <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                {f?.err}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '14px', padding: '13px 15px', borderRadius: '16px', background: '#121214', color: '#F4F2ED', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9B456" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }}>
          <path d="M1 7h13v10H1zM14 10h4l3 3v4h-7M5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
        </svg>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
            Mineral Bridge inspects and collects
          </div>
          <div style={{ fontSize: '12.5px', color: '#C9C7C0', marginTop: '3px', lineHeight: '1.45' }}>
            Our inspector visits this location at the chosen time. After the reports are approved and you are paid, our logistics partner collects the product from the same place.
          </div>
        </div>
      </div>
      <div style={{ marginTop: '14px' }}>
        <div onClick={vm.toggleScC1} role="checkbox" style={{ cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '13px 15px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB' }}>
          <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #121214', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.scC1Bg) }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontSize: '13.5px', lineHeight: '1.45' }}>
            The product will be ready at this location for inspection and pickup.
          </span>
        </div>
      </div>
      {vm.scErrList ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.scErrList}
        </div>
      ) : null}
    </div>
  );
}
