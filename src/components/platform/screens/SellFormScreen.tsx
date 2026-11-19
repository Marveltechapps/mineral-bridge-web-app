// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import { Fragment } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function SellFormScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '0 4px' }}>
        {vm.dCat}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        {"PHOTOS · "}{vm.dPhotoCount}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,150px))', gap: '10px' }}>
        {list(vm.dPhotos).map((ph, index) => (
          <Fragment key={index}>
            {ph?.has ? (
              <div onClick={vm.removePhoto} style={{ cursor: 'pointer', aspectRatio: '1', borderRadius: '16px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(ph?.img) }} />
            ) : null}
            {ph?.empty ? (
              <div onClick={vm.addPhoto} role="button" style={{ cursor: 'pointer', aspectRatio: '1', borderRadius: '16px', border: `1.5px dashed ${vm.dPhotoBorder ?? ''}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#8B8A90' }}>
                +
              </div>
            ) : null}
          </Fragment>
        ))}
        <div onClick={vm.addPhoto} role="button" style={{ cursor: 'pointer', aspectRatio: '1', borderRadius: '16px', border: '1.5px dashed #D5D3CC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#8A6A1C' }}>
          Add more
        </div>
      </div>
      {vm.dPhotoErr ? (
        <div style={{ fontSize: '12px', color: '#B42318', margin: '6px 4px 0' }}>
          {vm.dPhotoErr}
        </div>
      ) : null}
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 6px' }}>
        QUANTITY
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input aria-label="Quantity" inputMode="decimal" value={vm.dQty ?? ''} onChange={vm.setDQty} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', flex: '1', borderColor: str(vm.dQtyBorder) }} />
      </div>
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {list(vm.dUnits).map((c, index) => (
            <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
              {c?.label}
            </div>
          ))}
        </div>
      </div>
      {vm.dQtyErr ? (
        <div style={{ fontSize: '12px', color: '#B42318', margin: '6px 4px 0' }}>
          {vm.dQtyErr}
        </div>
      ) : null}
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 6px' }}>
        QUALITY / GRADE
      </label>
      <input aria-label="Quality or grade" value={vm.dGrade ?? ''} onChange={vm.setDGrade} placeholder="e.g. Au 88% or unknown" style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', borderColor: str(vm.dGradeBorder) }} />
      {vm.dGradeErr ? (
        <div style={{ fontSize: '12px', color: '#B42318', margin: '6px 4px 0' }}>
          {vm.dGradeErr}
        </div>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        FORM
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.dForms).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 6px' }}>
        DETAILS
      </label>
      <textarea aria-label="Details" value={vm.dDetails ?? ''} onChange={vm.setDDetails} placeholder="Where it is from, how it is stored, anything we should know" style={{ width: '100%', minHeight: '84px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px 15px', fontSize: '14px', resize: 'none', lineHeight: '1.45', borderColor: str(vm.dDetailsBorder) }} />
      {vm.dDetailsErr ? (
        <div style={{ fontSize: '12px', color: '#B42318', margin: '6px 4px 0' }}>
          {vm.dDetailsErr}
        </div>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        {"CERTIFICATES & TEST REPORTS (IF AVAILABLE)"}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list(vm.dDocs).map((d, index) => (
          <div key={index} onClick={d?.tap} role="button" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 15px', borderRadius: '16px', border: `1.5px dashed ${d?.border ?? ''}`, background: str(d?.bg) }}>
            <span style={{ flex: '1', fontSize: '13.5px', fontWeight: '500' }}>
              {d?.n}
            </span>
            {d?.off ? (
              <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#8A6A1C' }}>
                Upload
              </span>
            ) : null}
            {d?.on ? (
              <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#17704C' }}>
                Added ✓
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
