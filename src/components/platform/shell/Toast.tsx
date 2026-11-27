// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { Val } from '../ui/Val';

export function Toast({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: 'min(520px, calc(100vw - 40px))', zIndex: '200', padding: '13px 16px', borderRadius: '16px', background: '#1F2A44', color: '#F8FAFC', fontSize: '13.5px', fontWeight: '500', boxShadow: '0 12px 30px rgba(15,23,42,.3)', display: 'flex', gap: '10px', alignItems: 'center' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '4px', background: '#F2C94C', flex: 'none' }} />
      <Val v={vm.toast} />
    </div>
  );
}
