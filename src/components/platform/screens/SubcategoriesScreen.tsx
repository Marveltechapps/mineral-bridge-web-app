// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function SubcategoriesScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '200px', display: 'flex', alignItems: 'stretch', marginBottom: '18px', background: '#1F2A44' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(vm.catImg) }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(95deg,rgba(15,23,42,.94) 0%,rgba(31,42,68,.8) 42%,rgba(31,42,68,.15) 75%)' }} />
        <div style={{ position: 'relative', padding: '28px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff', maxWidth: '640px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '800', letterSpacing: '1.4px', color: '#F2C94C' }}>
            VERIFIED · INSPECTED LOTS
          </div>
          <div style={{ fontWeight: '800', fontSize: 'clamp(28px,3.2vw,38px)', letterSpacing: '-1px', lineHeight: '1.05', marginTop: '10px' }}>
            {vm.catName}
          </div>
          <div style={{ fontSize: '14px', color: '#E2E8F0', marginTop: '8px', maxWidth: '440px', lineHeight: '1.5' }}>
            Choose a mineral to see inspected lots, their test reports and what is available now.
          </div>
          <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap', marginTop: '16px' }}>
            <span style={{ background: '#F2C94C', color: '#1F2A44', padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '800' }}>
              {vm.web?.catLots}
            </span>
            <span style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.3)', padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '700' }}>
              Test reports included
            </span>
            <span style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.3)', padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '700' }}>
              Escrow-protected payment
            </span>
          </div>
        </div>
      </div>
      <h2 style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-.4px', margin: '0 2px 12px' }}>
        Subcategories
      </h2>
      <div className="catgrid">
        {list(vm.web?.minTiles).map((x, index) => (
          <button key={index} className="lotCard" onClick={x?.tap} style={{ display: 'flex', gap: '14px', alignItems: 'center', width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '16px', background: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44' }}>
            <span aria-hidden="true" style={{ width: '78px', height: '78px', borderRadius: '14px', backgroundColor: '#EFF6FF', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(x?.img), flexShrink: '0' }} />
            <span style={{ flex: '1', minWidth: '0' }}>
              <span style={{ display: 'block', fontSize: '15px', fontWeight: '800' }}>
                {x?.name}
              </span>
              <span style={{ display: 'block', fontSize: '12px', color: '#5B6B82', marginTop: '3px', lineHeight: '1.4' }}>
                {x?.forms}
              </span>
              <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '11.5px', fontWeight: '800', color: '#6B4E05', background: '#FEF7E0', padding: '2px 9px', borderRadius: '99px' }}>
                {x?.n}
              </span>
            </span>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
