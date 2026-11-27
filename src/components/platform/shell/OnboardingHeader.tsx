// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { str } from '../../../lib/platform/view';

export function OnboardingHeader({ vm }: { vm: ViewModel }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px' }}>
        {vm.web?.canBack ? (
          <button onClick={vm.back} aria-label="Back" style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1F2A44' }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        <div style={{ flex: '1', fontSize: '16px', fontWeight: '800' }}>
          {vm.web?.title}
        </div>
      </div>
      {vm.web?.hasStep ? (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.6px', color: '#5B6B82' }}>
            {vm.m?.step}
          </div>
          <div style={{ height: '6px', borderRadius: '6px', background: '#F1F5F9', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#1F2A44,#B48811)', borderRadius: '6px', transition: 'width .3s', width: str(vm.m?.prog) }} />
          </div>
        </div>
      ) : null}
      <div style={{ height: '16px' }} />
    </>
  );
}
