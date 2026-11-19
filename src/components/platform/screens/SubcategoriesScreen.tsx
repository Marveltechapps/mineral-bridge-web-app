// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function SubcategoriesScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ height: '130px', borderRadius: '22px', overflow: 'hidden', position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(vm.catImg) }}>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(18,18,20,.1),rgba(18,18,20,.8))' }} />
        <div style={{ position: 'absolute', left: '16px', bottom: '14px', fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: '#F4F2ED' }}>
          {vm.catName}
        </div>
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '18px 4px 8px' }}>
        SUBCATEGORIES
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        {list(vm.subs).map((x, index) => (
          <div key={index} onClick={x?.tap} role="button" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid #EFEDE7' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>
                {x?.name}
              </div>
              <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '2px' }}>
                {x?.forms}
              </div>
            </div>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11.5px', color: '#8A6A1C' }}>
              {x?.n}
            </span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
