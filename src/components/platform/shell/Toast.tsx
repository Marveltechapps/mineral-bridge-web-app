// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { Val } from '../ui/Val';

export function Toast({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: 'min(520px, calc(100vw - 40px))', zIndex: '200', padding: '13px 16px', borderRadius: '16px', background: '#121214', color: '#F4F2ED', fontSize: '13.5px', fontWeight: '500', boxShadow: '0 12px 30px rgba(18,18,20,.3)', display: 'flex', gap: '10px', alignItems: 'center' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '4px', background: '#D9B456', flex: 'none' }} />
      <Val v={vm.toast} />
    </div>
  );
}
