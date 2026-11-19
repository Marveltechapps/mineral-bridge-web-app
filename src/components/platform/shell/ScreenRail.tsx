// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function ScreenRail({ vm }: { vm: ViewModel }) {
  return (
    <>
      <div onClick={vm.web?.toggleRail} style={{ position: 'fixed', inset: '0', zIndex: '110', background: 'rgba(18,18,20,.35)' }} />
      <div style={{ position: 'fixed', left: '0', top: '0', bottom: '0', width: '300px', zIndex: '111', background: '#F4F2ED', borderRight: '1px solid #E4E2DB', overflowY: 'auto', padding: '24px 20px', boxShadow: '20px 0 50px rgba(18,18,20,.2)' }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '26px', lineHeight: '1' }}>
          Jump to a screen
        </div>
        <div style={{ fontSize: '12.5px', color: '#6B6A70', lineHeight: '1.5', marginTop: '8px' }}>
          Steps owned by Mineral Bridge, SGS or the logistics partner are simulated with a labelled demo button.
        </div>
        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {list(vm.rail).map((g, index) => (
            <div key={index}>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '.8px', color: '#8B8A90', marginBottom: '6px' }}>
                {g?.h}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {list(g?.items).map((r, index2) => (
                  <div key={index2} onClick={r?.tap} style={{ cursor: 'pointer', padding: '7px 10px', borderRadius: '9px', fontSize: '13px', fontWeight: str(r?.weight), background: str(r?.bg), color: str(r?.fg) }}>
                    {r?.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
