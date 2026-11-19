// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { str } from '../../../lib/platform/view';

export function OnboardingHeader({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto', padding: '28px 32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px' }}>
        {vm.web?.canBack ? (
          <button onClick={vm.back} aria-label="Back" style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#121214' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        <div style={{ flex: '1', fontSize: '16px', fontWeight: '600' }}>
          {vm.web?.title}
        </div>
      </div>
      {vm.web?.hasStep ? (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            {vm.m?.step}
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: '#E4E2DB', marginTop: '7px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#121214', borderRadius: '2px', transition: 'width .3s', width: str(vm.m?.prog) }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
