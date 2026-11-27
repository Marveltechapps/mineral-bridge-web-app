// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function ScreenRail({ vm }: { vm: ViewModel }) {
  return (
    <>
      <div onClick={vm.web?.toggleRail} style={{ position: 'fixed', inset: '0', zIndex: '110', background: 'rgba(15,23,42,.4)' }} />
      <div role="dialog" aria-label="Jump to a screen" style={{ position: 'fixed', left: '0', top: '0', bottom: '0', width: '310px', zIndex: '111', background: '#fff', borderRight: '1px solid #E2E8F0', overflowY: 'auto', padding: '24px 20px', boxShadow: '20px 0 50px rgba(15,23,42,.22)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-.4px' }}>
            Jump to a screen
          </div>
          <button onClick={vm.web?.toggleRail} aria-label="Close" style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '16px', color: '#5B6B82', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        <div style={{ fontSize: '12.5px', color: '#5B6B82', lineHeight: '1.5', marginTop: '8px' }}>
          Steps owned by Mineral Bridge, SGS or the logistics partner are simulated with a labelled demo button.
        </div>
        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {list(vm.rail).map((g, index) => (
            <div key={index}>
              <div style={{ fontSize: '10.5px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82', marginBottom: '6px' }}>
                {g?.h}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {list(g?.items).map((r, index2) => (
                  <button key={index2} onClick={r?.tap} style={{ cursor: 'pointer', textAlign: 'left', border: 'none', padding: '7px 10px', borderRadius: '9px', fontFamily: 'inherit', fontSize: '13px', fontWeight: str(r?.weight), background: str(r?.bg), color: str(r?.fg) }}>
                    {r?.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
