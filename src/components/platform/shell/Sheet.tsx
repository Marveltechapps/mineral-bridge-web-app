// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function Sheet({ vm }: { vm: ViewModel }) {
  return (
    <>
      <div onClick={vm.closeSheet} style={{ position: 'fixed', inset: '0', zIndex: '120', background: 'rgba(15,23,42,.42)', animation: 'fadeIn .2s both' }} />
      <div style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(460px, calc(100vw - 40px))', zIndex: '121', background: '#F8FAFC', borderRadius: '24px', padding: '28px 28px 20px', boxShadow: '0 30px 80px rgba(15,23,42,.35)', animation: 'fadeIn .2s both' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '21.3px', lineHeight: '1.1' }}>
          {vm.sheet?.title}
        </div>
        <div style={{ fontSize: '14px', color: '#5B6B82', lineHeight: '1.5', marginTop: '8px' }}>
          {vm.sheet?.body}
        </div>
        <div onClick={vm.sheet?.confirm} style={{ cursor: 'pointer', marginTop: '20px', height: '54px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600', background: str(vm.sheet?.bg), color: '#fff' }}>
          <Val v={vm.sheet?.cta} />
        </div>
        <div onClick={vm.closeSheet} style={{ cursor: 'pointer', height: '44px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#5B6B82' }}>
          Cancel
        </div>
      </div>
    </>
  );
}
