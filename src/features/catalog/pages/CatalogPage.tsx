import { useCatalogViewModel } from '@/features/catalog/hooks/useCatalogViewModel';
import { CatalogCard } from '@/features/catalog/components/CatalogCard';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ChevronGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

/** "Browse minerals" — filter rail, sort control and the assured-lot grid. */
export function CatalogPage() {
  const vm = useCatalogViewModel();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <Breadcrumb current="Browse minerals" />

      <div className="v2-split" style={css(vm.catalogGrid)}>
        {/* filter rail */}
        <aside className="v2-sticky" style={css(vm.filterRailStyle)} aria-label="Filters">
          <div
            style={css(
              'display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;',
            )}
          >
            <span
              style={css('font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4;')}
            >
              FILTERS
            </span>
            <button
              onClick={vm.clearFilters}
              style={css(
                'background:none; border:none; padding:0; font-size:12.5px; font-weight:700; color:#1e2a5a; cursor:pointer;',
              )}
            >
              Reset
            </button>
          </div>
          {vm.filterGroups.map((g) => (
            <div key={g.title} style={css('padding:14px 0; border-top:1px solid #f0f2f8;')}>
              <div
                style={css('font-size:13px; font-weight:800; color:#141a2e; margin-bottom:11px;')}
              >
                {g.title}
              </div>
              <div style={css('display:flex; flex-direction:column; gap:9px;')}>
                {g.options.map((o) => (
                  <button
                    key={o.label}
                    onClick={o.select}
                    aria-pressed={o.on}
                    style={css(
                      'display:flex; align-items:center; gap:10px; background:none; border:none; padding:0; cursor:pointer; text-align:left;',
                    )}
                  >
                    <span style={css(o.box)}>
                      {o.on && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span
                      style={css('flex:1; font-size:13.5px; font-weight:600; color:#4a5170;')}
                    >
                      {o.label}
                    </span>
                    <span style={css('font-size:12px; color:#a3abc4;')}>{o.count}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* results */}
        <div>
          <div
            style={css(
              'display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:20px; flex-wrap:wrap;',
            )}
          >
            <div>
              <h1
                style={css(
                  "font-family:'Poppins'; font-size:27px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
                )}
              >
                {vm.catalogTitle}
              </h1>
              <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>
                {vm.catalogCount} assured lots · owned inventory, ready to ship
              </p>
            </div>
            <div style={css('display:flex; align-items:center; gap:10px;')}>
              <button onClick={vm.toggleFilters} style={css(vm.filterBtnStyle)}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="10" y1="18" x2="14" y2="18" />
                </svg>
                Filters
                {vm.activeFilterCount && (
                  <span
                    style={css(
                      'background:#f7dd8e; color:#141a2e; font-size:10.5px; font-weight:800; min-width:19px; height:19px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; padding:0 5px;',
                    )}
                  >
                    {vm.activeFilterCount}
                  </span>
                )}
              </button>
              <div style={css('position:relative; display:flex; align-items:center;')}>
                <select
                  value={vm.sortValue}
                  onChange={vm.setSort}
                  aria-label="Sort lots"
                  style={css(
                    'height:44px; border:1px solid #dde2f0; border-radius:11px; padding:0 40px 0 15px; font-size:13.5px; font-weight:700; color:#141a2e; background:#fff; outline:none; cursor:pointer; -webkit-appearance:none; appearance:none;',
                  )}
                >
                  {vm.sortOptions.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span
                  style={css(
                    'position:absolute; right:14px; pointer-events:none; color:#8b95b4; display:flex;',
                  )}
                >
                  <ChevronGlyph size={16} />
                </span>
              </div>
            </div>
          </div>

          <div
            className="v2-g3"
            style={css('display:grid; grid-template-columns:repeat(3,1fr); gap:18px;')}
          >
            {vm.catalogProducts.map((p) => (
              <CatalogCard key={p.id} product={p} />
            ))}
          </div>

          {vm.catalogEmpty && (
            <div
              style={css(
                'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:56px 24px; text-align:center;',
              )}
            >
              <div style={css('font-size:16px; font-weight:800; color:#141a2e;')}>
                No lots match those filters
              </div>
              <div style={css('font-size:14px; color:#6b7290; margin-top:7px;')}>
                Try resetting filters or widening your search.
              </div>
              <button
                onClick={vm.clearFilters}
                style={css(
                  'height:44px; margin-top:20px; padding:0 24px; border:1px solid #d5dbef; border-radius:11px; background:#fff; color:#1e2a5a; font-size:14px; font-weight:800; cursor:pointer;',
                )}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
