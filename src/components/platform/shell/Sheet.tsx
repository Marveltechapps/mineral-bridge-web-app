// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function Sheet({ vm }: { vm: ViewModel }) {
  return (
    <>
      <div onClick={vm.closeSheet} style={{ position: 'fixed', inset: '0', zIndex: '120', background: 'rgba(18,18,20,.42)', animation: 'fadeIn .2s both' }} />
      <div style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(460px, calc(100vw - 40px))', zIndex: '121', background: '#F4F2ED', borderRadius: '24px', padding: '28px 28px 20px', boxShadow: '0 30px 80px rgba(18,18,20,.35)', animation: 'fadeIn .2s both' }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '26px', lineHeight: '1.1' }}>
          {vm.sheet?.title}
        </div>
        <div style={{ fontSize: '14px', color: '#6B6A70', lineHeight: '1.5', marginTop: '8px' }}>
          {vm.sheet?.body}
        </div>
        <div onClick={vm.sheet?.confirm} style={{ cursor: 'pointer', marginTop: '20px', height: '54px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600', background: str(vm.sheet?.bg), color: '#fff' }}>
          <Val v={vm.sheet?.cta} />
        </div>
        <div onClick={vm.closeSheet} style={{ cursor: 'pointer', height: '44px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#6B6A70' }}>
          Cancel
        </div>
      </div>
    </>
  );
}
