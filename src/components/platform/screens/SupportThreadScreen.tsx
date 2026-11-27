import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';

/** One support conversation: history + reply composer. `vm.th.isNew` starts a new conversation. */
export function SupportThreadScreen({ vm }: { vm: ViewModel }) {
  const th = vm.th ?? {};
  const msgs = list(th.msgs);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => end.current?.scrollIntoView({ block: 'end' }), 50); return () => clearTimeout(t); }, [msgs.length]);
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); th.send?.(); } };
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12px', color: '#334155' }}>
        <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {th.head}
        </span>
        {th.pill ? (
          <span style={{ whiteSpace: 'nowrap', padding: '3px 9px', borderRadius: '99px', fontSize: '11.5px', fontWeight: '600', background: th.pillBg ?? '', color: th.pillFg ?? '' }}>
            {th.pill}
          </span>
        ) : null}
      </div>
      {th.isNew ? (
        <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
          Tell us what you need. Include an order number if it is about an order. We usually reply within one working day.
        </div>
      ) : null}
      {th.loading ? (
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#5B6B82' }}>
          Loading conversation…
        </div>
      ) : null}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        {msgs.map((m, index) => (
          m?.system ? (
            <div key={m?.id ?? index} style={{ textAlign: 'center', fontSize: '11.5px', color: '#5B6B82' }}>
              {m?.text}
            </div>
          ) : m?.me ? (
            <div key={m?.id ?? index} style={{ alignSelf: 'flex-end', maxWidth: '82%', padding: '11px 14px', borderRadius: '18px 18px 6px 18px', background: '#1F2A44', color: '#F8FAFC', fontSize: '13.5px', lineHeight: '1.45', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {m?.text}
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '4px' }}>
                {"You · "}{m?.at}
              </div>
            </div>
          ) : (
            <div key={m?.id ?? index} style={{ alignSelf: 'flex-start', maxWidth: '82%', padding: '11px 14px', borderRadius: '18px 18px 18px 6px', background: '#fff', border: '1px solid #E2E8F0', fontSize: '13.5px', lineHeight: '1.45', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {m?.text}
              <div style={{ fontSize: '10.5px', color: '#5B6B82', marginTop: '4px' }}>
                {m?.who}{" · "}{m?.at}
              </div>
            </div>
          )
        ))}
      </div>
      {th.err ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {th.err}
        </div>
      ) : null}
      {th.resolved ? (
        <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
          This conversation was marked resolved. Sending a message reopens it.
        </div>
      ) : null}
      <div ref={end} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', position: 'sticky', bottom: '0', padding: '8px 0 4px', background: '#F8FAFC' }}>
        <input aria-label="Message" value={th.msg ?? ''} onChange={th.setMsg} onKeyDown={onKey} readOnly={!!th.busy} placeholder={th.isNew ? 'How can we help?' : 'Write a reply'} style={{ width: '100%', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px', flex: '1' }} />
        <div onClick={th.send} role="button" aria-label="Send" aria-disabled={!!th.busy} style={{ cursor: th.busy ? 'default' : 'pointer', opacity: th.sendOpacity, width: '48px', height: '48px', borderRadius: '16px', background: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
