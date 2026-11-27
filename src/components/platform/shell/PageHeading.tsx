// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import { Fragment } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function PageHeading({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      {vm.web?.hasCrumbs ? (
        <div style={{ fontSize: '12.5px', color: '#5B6B82', marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          {list(vm.web?.crumbs).map((c, index) => (
            <Fragment key={index}>
              <button onClick={c?.tap} style={{ border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '12.5px', color: '#5B6B82', fontWeight: '600', cursor: 'pointer' }}>
                {c?.l}
              </button>
              <span aria-hidden="true" style={{ opacity: '.5' }}>
                /
              </span>
            </Fragment>
          ))}
          <b style={{ color: '#1F2A44' }}>
            {vm.web?.title}
          </b>
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {vm.web?.canBack ? (
          <button onClick={vm.back} aria-label="Back" style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1F2A44' }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        <h1 style={{ flex: '1', minWidth: '0', fontWeight: '800', fontSize: '28px', letterSpacing: '-.7px', lineHeight: '1.15', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {vm.web?.title}
        </h1>
      </div>
      {vm.web?.hasStep ? (
        <div style={{ marginTop: '12px', maxWidth: '520px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.6px', color: '#5B6B82' }}>
            {vm.m?.step}
          </div>
          <div style={{ height: '6px', borderRadius: '6px', background: '#E2E8F0', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#1F2A44,#B48811)', borderRadius: '6px', transition: 'width .3s', width: str(vm.m?.prog) }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
