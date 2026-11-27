import { useState } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

const labelStyle = { display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82' } as const;
const inputStyle = { width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px' } as const;
const note = { marginTop: '8px', padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' } as const;

export function EditProfileScreen({ vm }: { vm: ViewModel }) {
  // Phone / email are verified contacts: "Change" opens a new-value box that sends a code (contact-change flow).
  const [changing, setChanging] = useState<'' | 'phone' | 'email'>('');
  const [next, setNext] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const busy = !!vm.contactBusy;
  const begin = (k: 'phone' | 'email') => { setChanging(k); setNext(''); setChannel('whatsapp'); vm.clearEditErr?.(); };
  const cancel = () => { setChanging(''); setNext(''); vm.clearEditErr?.(); };
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {list(vm.editFields).map((f, index) => {
          if (!f?.contact) {
            return (
              <div key={index}>
                <label style={{ ...labelStyle, margin: '0 4px 5px' }}>
                  {f?.l}
                </label>
                <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} style={{ ...inputStyle, borderColor: str(f?.border) }} />
                {f?.err ? (
                  <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                    {f?.err}
                  </div>
                ) : null}
              </div>
            );
          }
          const k = f.k as 'phone' | 'email';
          const open = changing === k;
          const noun = k === 'email' ? 'email' : 'number';
          return (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 5px' }}>
                <label style={labelStyle}>
                  {open ? 'NEW ' + f.l : f.l + ' (VERIFIED)'}
                </label>
                {!open ? (
                  <span onClick={busy ? undefined : () => begin(k)} role="button" aria-label={'Change ' + (k === 'phone' ? 'mobile number' : 'email')} style={{ cursor: busy ? 'default' : 'pointer', padding: '2px 4px', fontSize: '12.5px', fontWeight: '600', color: '#8A6508' }}>
                    Change
                  </span>
                ) : null}
              </div>
              {open ? (
                <>
                  {k === 'phone' ? (
                    <div style={{ display: 'flex', gap: '7px', marginBottom: '8px' }}>
                      {([['WhatsApp', 'whatsapp'], ['SMS', 'sms']] as const).map(([label, id]) => (
                        <div key={id} onClick={() => setChannel(id)} role="button" style={{ cursor: 'pointer', flex: 'none', padding: '8px 13px', borderRadius: '99px', fontSize: '12.5px', fontWeight: '600', background: channel === id ? '#1F2A44' : '#fff', color: channel === id ? '#F8FAFC' : '#1F2A44', border: `1px solid ${channel === id ? '#1F2A44' : '#E2E8F0'}` }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <input aria-label={'New ' + f.l} value={next} onChange={e => { setNext(e.target.value); if (f.err) vm.clearEditErr?.(); }} type={k === 'email' ? 'email' : 'tel'} autoComplete="off" autoCapitalize="none" autoFocus placeholder={k === 'email' ? 'name@example.com' : str(vm.editCc) + ' 803 412 7790'} style={{ ...inputStyle, borderColor: f.err ? '#B42318' : '#E2E8F0' }} />
                  {f.err ? (
                    <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                      {f.err}
                    </div>
                  ) : null}
                  <div style={note}>
                    {"We will send a 4-digit code to the new "}{noun}{". Your current one stays active until you verify it."}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <div onClick={() => vm.startContactChange?.(k, k === 'email' ? 'email' : channel, next)} role="button" style={{ cursor: busy ? 'default' : 'pointer', flex: '1', height: '48px', borderRadius: '14px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600', opacity: busy ? 0.6 : 1 }}>
                      {busy ? 'Sending…' : 'Send verification code'}
                    </div>
                    <div onClick={cancel} role="button" style={{ cursor: 'pointer', padding: '0 18px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '600' }}>
                      Cancel
                    </div>
                  </div>
                </>
              ) : (
                <input aria-label={f.l} readOnly value={f.v ?? ''} placeholder="Not set" style={{ ...inputStyle, color: '#334155', background: '#F8FAFC' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
