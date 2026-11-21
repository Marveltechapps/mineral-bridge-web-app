import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';

const card = { borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB' } as const;

/** Support tickets (`GET /support/threads`). The primary CTA starts a new general conversation. */
export function SupportInboxScreen({ vm }: { vm: ViewModel }) {
  const sp = vm.sup ?? {};
  const rows = list(sp.threads);
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 8px' }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
          YOUR CONVERSATIONS
        </span>
        <span onClick={sp.refresh} role="button" aria-label="Refresh" style={{ cursor: sp.loading ? 'default' : 'pointer', padding: '2px 4px', fontSize: '12.5px', fontWeight: '600', color: sp.loading ? '#8B8A90' : '#8A6A1C' }}>
          {sp.loading ? 'Refreshing…' : 'Refresh'}
        </span>
      </div>
      {sp.err && !sp.loaded ? (
        <div style={{ ...card, padding: '18px 16px' }}>
          <div role="alert" style={{ padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
            {sp.err}
          </div>
          <div onClick={sp.refresh} role="button" style={{ cursor: 'pointer', marginTop: '10px', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
            Try again
          </div>
        </div>
      ) : null}
      {!sp.loaded && !sp.err ? (
        <div style={{ ...card, padding: '18px 16px', textAlign: 'center', fontSize: '13px', color: '#6B6A70' }}>
          Loading your messages…
        </div>
      ) : null}
      {sp.loaded && !rows.length ? (
        <div style={{ ...card, padding: '20px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
            No messages yet
          </div>
          <div style={{ fontSize: '13px', color: '#6B6A70', lineHeight: '1.5', marginTop: '6px' }}>
            Ask Mineral Bridge support anything. We reply here and on your chosen channels.
          </div>
        </div>
      ) : null}
      {rows.length ? (
        <div style={{ ...card, padding: '2px 15px' }}>
          {rows.map((t, index) => (
            <div key={t?.ref ?? index} onClick={t?.tap} role="button" style={{ cursor: 'pointer', padding: '13px 0', borderBottom: index === rows.length - 1 ? 'none' : '1px solid #EFEDE7', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t?.title}
                </div>
                <div style={{ fontSize: '11.5px', color: '#8B8A90', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t?.sub}
                </div>
              </div>
              <span style={{ whiteSpace: 'nowrap', padding: '3px 9px', borderRadius: '99px', fontSize: '11.5px', fontWeight: '600', background: t?.pillBg ?? '', color: t?.pillFg ?? '' }}>
                {t?.pill}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B8A90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          ))}
        </div>
      ) : null}
      {sp.err && sp.loaded ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {sp.err}
        </div>
      ) : null}
      <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '14px', background: '#F1EFE9', fontSize: '12.5px', color: '#3A3940', lineHeight: '1.5' }}>
        For urgent help with an order, open the order and use its chat so we can see the details.
      </div>
    </div>
  );
}
