// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import { Fragment } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function ChatScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '10px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12px', color: '#334155' }}>
        {vm.chatRef}
      </div>
      <div className="hs" style={{ display: 'flex', gap: '7px', overflowX: 'auto', margin: '10px -18px 0', padding: '0 18px' }}>
        {list(vm.chatActions).map((q, index) => (
          <div key={index} onClick={q?.tap} role="button" style={{ cursor: 'pointer', flex: 'none', padding: '8px 13px', borderRadius: '99px', fontSize: '12.5px', fontWeight: '600', background: str(q?.bg), color: str(q?.fg), border: `1px solid ${q?.border ?? ''}` }}>
            {q?.l}
          </div>
        ))}
      </div>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        {list(vm.chatMsgs).map((c, index) => (
          <Fragment key={index}>
            {c?.them ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                <div style={{ alignSelf: 'flex-start', maxWidth: '82%', padding: '11px 14px', borderRadius: '18px 18px 18px 6px', background: '#fff', border: '1px solid #E2E8F0', fontSize: '13.5px', lineHeight: '1.45' }}>
                  {c?.text}
                  <div style={{ fontSize: '10.5px', color: '#5B6B82', marginTop: '4px' }}>
                    {"Mineral Bridge · "}{c?.at}
                  </div>
                </div>
                {c?.action ? (
                  <div onClick={c?.act} role="button" style={{ cursor: 'pointer', padding: '9px 14px', borderRadius: '12px', background: '#1F2A44', color: '#F2C94C', fontSize: '13px', fontWeight: '600' }}>
                    {c?.action}
                  </div>
                ) : null}
              </div>
            ) : null}
            {c?.me ? (
              <div style={{ alignSelf: 'flex-end', maxWidth: '82%', padding: '11px 14px', borderRadius: '18px 18px 6px 18px', background: '#1F2A44', color: '#F8FAFC', fontSize: '13.5px', lineHeight: '1.45' }}>
                {c?.text}
                <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '4px' }}>
                  {"You · "}{c?.at}
                </div>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', position: 'sticky', bottom: '0', padding: '8px 0 4px', background: '#F8FAFC' }}>
        <input aria-label="Message" value={vm.msg ?? ''} onChange={vm.setMsg} placeholder="Write a message" style={{ width: '100%', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px', flex: '1' }} />
        <div onClick={vm.sendMsg} role="button" aria-label="Send" style={{ cursor: 'pointer', width: '48px', height: '48px', borderRadius: '16px', background: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
