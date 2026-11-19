// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import { Fragment } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function ProfileScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '24px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '56px', height: '56px', flex: 'none', borderRadius: '28px', background: '#D9B456', color: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif', serif", fontSize: '24px' }}>
            <Val v={vm.pIni} />
          </div>
          <div style={{ flex: '1', minWidth: '0' }}>
            <div style={{ fontSize: '17px', fontWeight: '600' }}>
              {vm.pName}
            </div>
            <div style={{ fontSize: '13px', color: '#C9C7C0', marginTop: '2px' }}>
              {vm.pBiz}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {list(vm.pTags).map((t, index) => (
            <span key={index} style={{ padding: '4px 10px', borderRadius: '99px', background: 'rgba(217,180,86,.16)', color: '#D9B456', fontSize: '11.5px', fontWeight: '600' }}>
              {t?.t}
            </span>
          ))}
          {vm.kycWord ? (
            <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11.5px', fontWeight: '600', background: str(vm.kycBg), color: str(vm.kycFg) }}>
              {vm.kycWord}
            </span>
          ) : null}
        </div>
        {vm.pContact ? (
          <div style={{ fontSize: '12px', color: '#9C9AA0', marginTop: '10px' }}>
            {vm.pContact}
          </div>
        ) : null}
      </div>
      {vm.guest ? (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onClick={vm.startSignup} style={{ cursor: 'pointer', height: '52px', borderRadius: '16px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14.5px', fontWeight: '600' }}>
            Create account
          </div>
          <div onClick={vm.startSignin} style={{ cursor: 'pointer', height: '52px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14.5px', fontWeight: '600' }}>
            Sign in
          </div>
        </div>
      ) : null}
      {list(vm.menu).map((g, index) => (
        <Fragment key={index}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
            {g?.h}
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            {list(g?.rows).map((r, index2) => (
              <div key={index2} onClick={r?.tap} role="button" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${r?.line ?? ''}` }}>
                <span style={{ width: '36px', height: '36px', flex: 'none', borderRadius: '12px', background: '#F1EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={r?.icon} />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '500' }}>
                    {r?.l}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r?.sub}
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
            ))}
          </div>
        </Fragment>
      ))}
      {vm.signedIn ? (
        <div onClick={vm.logout} role="button" style={{ cursor: 'pointer', marginTop: '16px', height: '52px', borderRadius: '16px', background: '#fff', border: '1px solid #F2CFCB', color: '#B42318', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14.5px', fontWeight: '600' }}>
          Log out
        </div>
      ) : null}
    </div>
  );
}
