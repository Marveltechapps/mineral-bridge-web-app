// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import { Fragment } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function ProfileScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '24px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '56px', height: '56px', flex: 'none', borderRadius: '28px', background: '#F2C94C', color: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '19.7px' }}>
            <Val v={vm.pIni} />
          </div>
          <div style={{ flex: '1', minWidth: '0' }}>
            <div style={{ fontSize: '17px', fontWeight: '600' }}>
              {vm.pName}
            </div>
            <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '2px' }}>
              {vm.pBiz}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {list(vm.pTags).map((t, index) => (
            <span key={index} style={{ padding: '4px 10px', borderRadius: '99px', background: 'rgba(242,201,76,.16)', color: '#F2C94C', fontSize: '11.5px', fontWeight: '600' }}>
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
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
            {vm.pContact}
          </div>
        ) : null}
      </div>
      {vm.guest ? (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onClick={vm.startSignup} style={{ cursor: 'pointer', height: '52px', borderRadius: '16px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14.5px', fontWeight: '600' }}>
            Create account
          </div>
          <div onClick={vm.startSignin} style={{ cursor: 'pointer', height: '52px', borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14.5px', fontWeight: '600' }}>
            Sign in
          </div>
        </div>
      ) : null}
      {list(vm.menu).map((g, index) => (
        <Fragment key={index}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
            {g?.h}
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
            {list(g?.rows).map((r, index2) => (
              <div key={index2} onClick={r?.tap} role="button" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${r?.line ?? ''}` }}>
                <span style={{ width: '36px', height: '36px', flex: 'none', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={r?.icon} />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '500' }}>
                    {r?.l}
                  </div>
                  <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r?.sub}
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
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
