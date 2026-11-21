// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function CategoriesScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ height: '48px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B8A90" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input aria-label="Search" value={vm.search ?? ''} onChange={vm.setSearch} placeholder="Search all minerals and lots" style={{ flex: '1', minWidth: '0', border: 'none', background: 'transparent', fontSize: '14.5px' }} />
        {vm.search ? (
          <span onClick={vm.clearSearch} style={{ cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', color: '#6B6A70' }}>
            Clear
          </span>
        ) : null}
      </div>
      {vm.hasGlobal ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '18px 4px 8px' }}>
            RESULTS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '12px' }}>
            {list(vm.global).map((x, index) => (
              <div key={index} className="mb-press-3" onClick={x?.tap} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '10px', display: 'flex', gap: '12px', opacity: str(x?.opacity) }}>
                <div style={{ width: '86px', height: '86px', flex: 'none', borderRadius: '14px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(x?.img) }} />
                <div style={{ flex: '1', minWidth: '0', padding: '2px 2px 0', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '.4px', color: '#8B8A90' }}>
                    {x?.id}
                  </span>
                  <div style={{ fontSize: '14.5px', fontWeight: '600', lineHeight: '1.3', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {x?.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#3A3940', marginTop: '4px', fontWeight: '500' }}>
                    {x?.qty}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '2px' }}>
                    {x?.origin}
                  </div>
                  <span style={{ alignSelf: 'flex-start', maxWidth: '100%', marginTop: '7px', padding: '3px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', lineHeight: '1.4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: str(x?.labBg), color: str(x?.labFg) }}>
                    {x?.grade}{" · "}{x?.lab}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {vm.noGlobal ? (
        <div style={{ marginTop: '18px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '22px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            No minerals match “{vm.search}”
          </div>
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>
            Try a mineral name such as gold, copper or lithium.
          </div>
          <div onClick={vm.clearSearch} style={{ cursor: 'pointer', marginTop: '14px', fontSize: '13.5px', fontWeight: '600', color: '#8A6A1C' }}>
            Clear search
          </div>
        </div>
      ) : null}
      {vm.catalogueLoading && !list(vm.cats).length ? (
        <div style={{ marginTop: '18px', fontSize: '13.5px', color: '#6B6A70' }}>Loading minerals…</div>
      ) : null}
      {vm.catalogueErr && !list(vm.cats).length ? (
        <div style={{ marginTop: '18px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '22px' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>Catalogue unavailable</div>
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>{vm.catalogueErr}</div>
        </div>
      ) : null}
      {vm.notSearching ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '12px', marginTop: '14px' }}>
          {list(vm.cats).map((c, index) => (
            <div key={index} className="mb-press-3" onClick={c?.tap} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '10px', display: 'flex', gap: '13px', alignItems: 'center' }}>
              <div style={{ width: '72px', height: '72px', flex: 'none', borderRadius: '14px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(c?.img) }} />
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>
                  {c?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '3px', lineHeight: '1.4' }}>
                  {c?.subs}
                </div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: '#8A6A1C', marginTop: '5px' }}>
                  {c?.n}
                </div>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
