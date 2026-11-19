// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function LotsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ height: '48px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B8A90" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input aria-label="Search" value={vm.search ?? ''} onChange={vm.setSearch} placeholder="Search these lots" style={{ flex: '1', minWidth: '0', border: 'none', background: 'transparent', fontSize: '14.5px' }} />
        {vm.search ? (
          <span onClick={vm.clearSearch} style={{ cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', color: '#6B6A70' }}>
            Clear
          </span>
        ) : null}
      </div>
      <div className="hs" style={{ display: 'flex', gap: '7px', overflowX: 'auto', scrollbarWidth: 'none', margin: '12px -18px 0', padding: '2px 18px 4px' }}>
        {list(vm.formChips).map((c, index) => (
          <div key={index} onClick={c?.tap} style={{ cursor: 'pointer', flex: 'none', padding: '8px 13px', borderRadius: '99px', fontSize: '12.5px', fontWeight: '600', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
        <div onClick={vm.toggleLab} style={{ cursor: 'pointer', flex: 'none', padding: '8px 13px', borderRadius: '99px', fontSize: '12.5px', fontWeight: '600', border: '1px solid #E4E2DB', background: str(vm.labChipBg), color: str(vm.labChipFg) }}>
          Has test report
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', margin: '12px 2px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '24px', lineHeight: '1' }}>
            {vm.lotNum}
          </span>
          <span style={{ fontSize: '13px', color: '#6B6A70', whiteSpace: 'nowrap' }}>
            {vm.lotWord}
          </span>
        </div>
        <div role="group" aria-label="Grid columns" style={{ display: 'flex', flex: 'none', padding: '3px', borderRadius: '12px', background: '#E7E5DF', marginLeft: 'auto' }}>
          {list(vm.colOpts).map((g, index) => (
            <div key={index} onClick={g?.tap} role="radio" aria-label={g?.label} style={{ cursor: 'pointer', width: '34px', height: '32px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', background: str(g?.bg) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={g?.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={g?.icon} />
              </svg>
            </div>
          ))}
        </div>
        <div className="mb-press-2" onClick={vm.toggleSort} role="button" aria-haspopup="listbox" style={{ transition: 'transform .12s', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', height: '38px', padding: '0 12px 0 14px', borderRadius: '99px', background: '#fff', border: '1px solid #E4E2DB', boxShadow: '0 1px 2px rgba(18,18,20,.04)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
          <span style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            {vm.sortLabel}
          </span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6A70" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform .2s', transform: str(vm.sortChevron) }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {vm.sortOpen ? (
          <div role="listbox" style={{ position: 'absolute', right: '0', top: '46px', zIndex: '20', width: '220px', padding: '6px', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', boxShadow: '0 14px 34px rgba(18,18,20,.16)', animation: 'fadeUp .2s ease-out both' }}>
            {list(vm.sorts).map((t, index) => (
              <div key={index} className="mb-hover-1" onClick={t?.tap} role="option" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '42px', padding: '0 12px', borderRadius: '12px', fontSize: '14px', fontWeight: str(t?.weight) }}>
                <Val v={t?.label} />
                {t?.on ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A6A1C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div style={{ display: 'grid', gap: str(vm.gridGap), gridTemplateColumns: str(vm.gridCols) }}>
        {list(vm.lots).map((x, index) => (
          <div key={index} className="mb-press-2" onClick={x?.tap} role="button" style={{ transition: 'transform .15s', cursor: 'pointer', minWidth: '0', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: str(x?.opacity), animation: 'rise .35s ease-out both' }}>
            <div style={{ position: 'relative', aspectRatio: '1', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(x?.img) }}>
              {x?.off ? (
                <span style={{ position: 'absolute', left: '8px', top: '8px', padding: '3px 8px', borderRadius: '99px', background: '#121214', color: '#F4F2ED', fontSize: '10px', fontWeight: '600' }}>
                  Sold out
                </span>
              ) : null}
              {x?.hasLabTag ? (
                <span title="Has test report" style={{ position: 'absolute', right: '7px', top: '7px', width: '22px', height: '22px', borderRadius: '11px', background: '#17704C', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              ) : null}
            </div>
            <div style={{ padding: str(vm.cardPad), display: 'flex', flexDirection: 'column', minWidth: '0' }}>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.3px', color: '#8B8A90' }}>
                {x?.id}
              </span>
              <div style={{ fontWeight: '600', lineHeight: '1.25', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: str(vm.nameSize) }}>
                {x?.name}
              </div>
              <div style={{ fontSize: '11.5px', color: '#3A3940', marginTop: '4px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {x?.qty}
              </div>
              {vm.showGridMeta ? (
                <>
                  <div style={{ fontSize: '11px', color: '#6B6A70', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {x?.origin}
                  </div>
                  <span style={{ alignSelf: 'flex-start', maxWidth: '100%', marginTop: '6px', padding: '2px 8px', borderRadius: '99px', fontSize: '10.5px', fontWeight: '600', lineHeight: '1.5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: str(x?.labBg), color: str(x?.labFg) }}>
                    {x?.grade}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {vm.noLots ? (
        <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            {vm.lotsEmptyText}
          </div>
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '6px' }}>
            Clear filters or check back soon.
          </div>
          <div onClick={vm.resetFilters} style={{ cursor: 'pointer', marginTop: '14px', fontSize: '13.5px', fontWeight: '600', color: '#8A6A1C' }}>
            Reset filters
          </div>
        </div>
      ) : null}
    </div>
  );
}
