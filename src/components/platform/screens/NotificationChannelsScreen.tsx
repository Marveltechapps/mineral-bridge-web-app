// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function NotificationChannelsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontSize: '13.5px', color: '#5B6B82', lineHeight: '1.5', margin: '0 4px 12px' }}>
        Every stage update is sent on the channels you keep on.
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        {list(vm.prefRows).map((r, index) => (
          <div key={index} onClick={r?.tap} role="switch" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '14.5px', fontWeight: '500' }}>
                {r?.l}
              </div>
              <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '1px' }}>
                {r?.sub}
              </div>
            </div>
            <span style={{ width: '44px', height: '26px', flex: 'none', borderRadius: '13px', position: 'relative', transition: 'background .2s', background: str(r?.bg) }}>
              <span style={{ position: 'absolute', top: '2px', width: '22px', height: '22px', borderRadius: '11px', background: '#fff', transition: 'left .2s', left: str(r?.x) }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
