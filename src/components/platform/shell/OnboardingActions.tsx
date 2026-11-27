// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { str } from '../../../lib/platform/view';

export function OnboardingActions({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '22px' }}>
      <button className="authBtn" onClick={vm.primary} style={{ width: '100%', height: '52px', borderRadius: '13px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '800', fontSize: '15px', cursor: 'pointer', opacity: str(vm.m?.ctaOpacity) }}>
        {vm.m?.cta}
      </button>
      {vm.m?.cta2 ? (
        <button onClick={vm.secondary} style={{ width: '100%', height: '48px', borderRadius: '13px', border: '1.5px solid #E2E8F0', background: '#fff', fontFamily: 'inherit', fontWeight: '700', fontSize: '14.5px', cursor: 'pointer', color: str(vm.m?.cta2Fg) }}>
          {vm.m?.cta2}
        </button>
      ) : null}
    </div>
  );
}
