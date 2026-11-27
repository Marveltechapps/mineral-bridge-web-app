// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function NotificationsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.unread ? (
        <div onClick={vm.readAll} style={{ cursor: 'pointer', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#8A6508', margin: '0 4px 10px' }}>
          Mark all as read
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list(vm.notifs).map((n, index) => (
          <div key={index} onClick={n?.tap} role="button" style={{ cursor: 'pointer', borderRadius: '18px', background: '#fff', border: '1px solid #E2E8F0', padding: '13px 15px', display: 'flex', gap: '11px' }}>
            <span style={{ width: '8px', height: '8px', marginTop: '6px', flex: 'none', borderRadius: '4px', background: str(n?.dot) }} />
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {n?.title}
                </span>
                <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', color: '#5B6B82', flex: 'none' }}>
                  {n?.at}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '3px', lineHeight: '1.45' }}>
                {n?.note}
              </div>
              <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10px', color: '#5B6B82', marginTop: '6px' }}>
                {n?.via}
              </div>
            </div>
          </div>
        ))}
      </div>
      {vm.noNotifs ? (
        <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '26px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            No notifications yet
          </div>
          <div style={{ fontSize: '13px', color: '#5B6B82', marginTop: '6px' }}>
            Order and sell-request updates appear here, and by your chosen channels.
          </div>
        </div>
      ) : null}
    </div>
  );
}
