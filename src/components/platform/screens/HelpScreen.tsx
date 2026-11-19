// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';

export function HelpScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '8px' }}>
        {list(vm.helpChannels).map((c, index) => (
          <div key={index} onClick={c?.tap} role="button" style={{ cursor: 'pointer', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', padding: '14px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={c?.icon} />
            </svg>
            <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '10px' }}>
              {c?.l}
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B6A70', marginTop: '2px', wordBreak: 'break-all' }}>
              {c?.v}
            </div>
          </div>
        ))}
      </div>
      <div onClick={vm.goSupportChat} role="button" style={{ cursor: 'pointer', marginTop: '8px', height: '52px', borderRadius: '16px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14.5px', fontWeight: '600' }}>
        Chat with support
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        FREQUENT QUESTIONS
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        {list(vm.faqs).map((f, index) => (
          <div key={index} onClick={f?.tap} role="button" style={{ cursor: 'pointer', padding: '13px 0', borderBottom: '1px solid #EFEDE7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                {f?.qq}
              </span>
              <span style={{ fontSize: '18px', color: '#8A6A1C' }}>
                {f?.sign}
              </span>
            </div>
            {f?.open ? (
              <div style={{ fontSize: '13px', color: '#3A3940', marginTop: '7px', lineHeight: '1.5' }}>
                {f?.a}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
