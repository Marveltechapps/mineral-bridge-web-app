// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function KycDocumentScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '0 4px' }}>
        {vm.kd?.step}
      </div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '30px', lineHeight: '1.05', margin: '6px 4px 0' }}>
        {vm.kd?.label}
      </div>
      <div style={{ fontSize: '13.5px', color: '#6B6A70', margin: '8px 4px 0', lineHeight: '1.5' }}>
        {vm.kd?.desc}
      </div>
      {vm.devTools && vm.kd?.flag ? (
        <div role="alert" style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '16px', background: '#FDECEA', border: '1px solid #F2CFCB', color: '#B42318', fontSize: '13px', lineHeight: '1.5' }}>
          <b>
            Re-upload requested by compliance.
          </b>
          {' '}{vm.kd?.flag}
        </div>
      ) : null}
      <div style={{ position: 'relative', marginTop: '16px', borderRadius: '22px', overflow: 'hidden', background: '#121214', aspectRatio: str(vm.kd?.ratio) }}>
        {vm.kd?.empty ? (
          <>
            <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(circle at 30% 20%, rgba(217,180,86,.18), rgba(18,18,20,0) 60%)' }} />
            <div style={{ position: 'absolute', inset: '14%', borderRadius: str(vm.kd?.frameR) }}>
              <span style={{ position: 'absolute', left: '0', top: '0', width: '26px', height: '26px', borderLeft: '3px solid #D9B456', borderTop: '3px solid #D9B456', borderTopLeftRadius: '10px' }} />
              <span style={{ position: 'absolute', right: '0', top: '0', width: '26px', height: '26px', borderRight: '3px solid #D9B456', borderTop: '3px solid #D9B456', borderTopRightRadius: '10px' }} />
              <span style={{ position: 'absolute', left: '0', bottom: '0', width: '26px', height: '26px', borderLeft: '3px solid #D9B456', borderBottom: '3px solid #D9B456', borderBottomLeftRadius: '10px' }} />
              <span style={{ position: 'absolute', right: '0', bottom: '0', width: '26px', height: '26px', borderRight: '3px solid #D9B456', borderBottom: '3px solid #D9B456', borderBottomRightRadius: '10px' }} />
              <span style={{ position: 'absolute', left: '6%', right: '6%', height: '2px', background: 'linear-gradient(90deg,rgba(217,180,86,0),#D9B456,rgba(217,180,86,0))', boxShadow: '0 0 12px #D9B456', animation: 'scanLine 2.6s ease-in-out infinite' }} />
            </div>
            <div style={{ position: 'absolute', left: '0', right: '0', bottom: '14px', textAlign: 'center', fontSize: '12.5px', color: '#C9C7C0' }}>
              {vm.kd?.frameHint}
            </div>
          </>
        ) : null}
        {vm.kd?.hasImg ? (
          <div role="img" aria-label={`Preview of ${vm.kd?.label ?? ''}`} style={{ position: 'absolute', inset: '0', backgroundColor: '#121214', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', animation: 'fadeIn .4s both', backgroundImage: str(vm.kd?.bg) }} />
        ) : null}
        {vm.kd?.isPdf ? (
          <div style={{ position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#F4F2ED', animation: 'fadeIn .4s both' }}>
            <div style={{ width: '74px', height: '94px', borderRadius: '8px', background: '#fff', border: '1px solid #E4E2DB', boxShadow: '0 8px 20px rgba(18,18,20,.10)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '10px' }}>
              <span style={{ padding: '3px 8px', borderRadius: '5px', background: '#B42318', color: '#fff', fontFamily: "'Geist Mono', monospace", fontSize: '11px', fontWeight: '700' }}>
                PDF
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', maxWidth: '80%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {vm.kd?.name}
            </div>
          </div>
        ) : null}
        {vm.kd?.isSample ? (
          <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', background: '#2A2A2E', animation: 'fadeIn .4s both' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '14px', background: 'linear-gradient(135deg,#E8E3D3,#CFC6AA)', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 26px rgba(0,0,0,.35)', padding: '14px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#3A3940' }}>
                  {vm.kd?.sampleHead}
                </span>
                <span style={{ width: '22px', height: '22px', borderRadius: '11px', border: '2px solid #8A6A1C' }} />
              </div>
              <div style={{ flex: '1', display: 'flex', gap: '12px', marginTop: '10px' }}>
                {vm.kd?.samplePhoto ? (
                  <div style={{ width: '30%', borderRadius: '8px', background: 'linear-gradient(180deg,#9C9AA0,#6B6A70)' }} />
                ) : null}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '7px', justifyContent: 'center' }}>
                  <span style={{ height: '7px', width: '80%', borderRadius: '4px', background: '#3A3940' }} />
                  <span style={{ height: '6px', width: '60%', borderRadius: '4px', background: '#6B6A70' }} />
                  <span style={{ height: '6px', width: '70%', borderRadius: '4px', background: '#6B6A70' }} />
                  <span style={{ height: '6px', width: '45%', borderRadius: '4px', background: '#6B6A70' }} />
                </div>
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', color: '#3A3940', letterSpacing: '1px', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {vm.kd?.sampleMrz}
              </div>
              <span style={{ position: 'absolute', right: '10px', bottom: '10px', padding: '3px 7px', borderRadius: '6px', background: 'rgba(18,18,20,.75)', color: '#F4F2ED', fontFamily: "'Geist Mono', monospace", fontSize: '9px' }}>
                DEMO SAMPLE
              </span>
            </div>
          </div>
        ) : null}
      </div>
      {vm.kd?.has ? (
        <>
          <div style={{ marginTop: '12px', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', animation: 'rise .35s ease-out both' }}>
            <span style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '17px', background: '#E2F2E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#17704C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {vm.kd?.name}
              </div>
              <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '2px' }}>
                {vm.kd?.meta}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', marginTop: '10px' }}>
            <label style={{ cursor: 'pointer', height: '46px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '600' }}>
              <input type="file" accept="image/*,application/pdf" onChange={vm.onKycFile} style={{ display: 'none' }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
              </svg>
              Replace
            </label>
            <div onClick={vm.removeKycDoc} role="button" style={{ cursor: 'pointer', height: '46px', borderRadius: '14px', background: '#fff', border: '1px solid #F2CFCB', color: '#B42318', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
              Remove
            </div>
          </div>
          {vm.devTools && vm.kd?.flag ? (
            <div onClick={vm.useKycSample} role="button" style={{ cursor: 'pointer', textAlign: 'center', marginTop: '10px', fontSize: '12.5px', fontWeight: '600', color: '#8A6A1C' }}>
                Use a new sample document (demo)
              </div>
            ) : null}
          </>
        ) : null}
        {vm.kd?.empty ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', marginTop: '12px' }}>
              <label style={{ cursor: 'pointer', height: '54px', borderRadius: '16px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', fontSize: '14px', fontWeight: '600' }}>
                <input type="file" accept="image/*" capture={vm.kd?.capture} onChange={vm.onKycFile} style={{ display: 'none' }} />
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D9B456" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
                </svg>
                Take photo
              </label>
              <label style={{ cursor: 'pointer', height: '54px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', fontSize: '14px', fontWeight: '600' }}>
                <input type="file" accept={vm.kd?.accept} onChange={vm.onKycFile} style={{ display: 'none' }} />
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Upload file
              </label>
            </div>
          {vm.devTools ? (
            <div onClick={vm.useKycSample} role="button" style={{ cursor: 'pointer', textAlign: 'center', marginTop: '10px', fontSize: '12.5px', fontWeight: '600', color: '#8A6A1C' }}>
              Use a sample document (demo)
            </div>
          ) : null}
        </>
      ) : null}
      {vm.kd?.err ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.kd?.err}
        </div>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        MAKE SURE
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '4px 15px' }}>
        {list(vm.kd?.tips).map((t, index) => (
          <div key={index} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', padding: '11px 0', borderBottom: `1px solid ${t?.line ?? ''}` }}>
            <span style={{ width: '20px', height: '20px', flex: 'none', borderRadius: '10px', background: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D9B456" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <span style={{ fontSize: '13px', lineHeight: '1.45' }}>
              {t?.t}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '11.5px', color: '#8B8A90', margin: '12px 4px 0', lineHeight: '1.5' }}>
        JPG, PNG or PDF up to 10 MB. Files are encrypted and only seen by the Mineral Bridge compliance team.
      </div>
    </div>
  );
}
