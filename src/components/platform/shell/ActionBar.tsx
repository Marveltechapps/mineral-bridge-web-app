// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { str } from '../../../lib/platform/view';

export function ActionBar({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ position: 'sticky', bottom: '0', zIndex: '5', background: 'linear-gradient(180deg,rgba(244,242,237,0),#F4F2ED 22%)', padding: '22px 0 22px' }}>
      <div style={{ maxWidth: str(vm.web?.w), margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '14px', borderTop: '1px solid #E4E2DB' }}>
        {vm.m?.cta2 ? (
          <button onClick={vm.secondary} style={{ whiteSpace: 'nowrap', height: '52px', padding: '0 22px', border: '1px solid #E4E2DB', borderRadius: '16px', background: '#fff', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: '600', cursor: 'pointer', color: str(vm.m?.cta2Fg) }}>
            {vm.m?.cta2}
          </button>
        ) : null}
        <button className="mb-press-1" onClick={vm.primary} style={{ whiteSpace: 'nowrap', transition: 'transform .12s, opacity .2s', minWidth: '260px', height: '52px', padding: '0 28px', border: 'none', borderRadius: '16px', background: '#121214', color: '#F4F2ED', fontFamily: 'inherit', fontSize: '15px', fontWeight: '600', cursor: 'pointer', opacity: str(vm.m?.ctaOpacity) }}>
          {vm.m?.cta}
        </button>
      </div>
    </div>
  );
}
