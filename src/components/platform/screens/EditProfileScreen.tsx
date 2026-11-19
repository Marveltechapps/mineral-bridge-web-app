// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function EditProfileScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {list(vm.editFields).map((f, index) => (
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
  );
}
