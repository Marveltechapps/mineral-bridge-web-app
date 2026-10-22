import { useCatalogViewModel } from '@/features/catalog/hooks/useCatalogViewModel';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { css } from '@/utils/css';

const SELECT =
  'height:42px; border:1px solid #dde2f0; border-radius:11px; padding:0 12px; background:#fff; color:#141a2e; font-size:13.5px; font-weight:700;';

/** Assured-lot catalog with search, cascading filters and sort. */
export function CatalogPage() {
  const vm = useCatalogViewModel();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <Breadcrumb current="Browse minerals" />
      <div style={css('display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:18px; flex-wrap:wrap;')}>
        <div>
          <p style={css('font-size:11px; font-weight:800; letter-spacing:.8px; color:#8890ad; margin:0 0 6px;')}>MARKETPLACE</p>
          <h1 style={css("font-family:'Poppins'; font-size:27px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;")}>
            Browse minerals
          </h1>
          <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>{vm.countLabel}</p>
        </div>
      </div>

      <label style={css('display:block; margin-bottom:14px;')}>
        <input
          aria-label="Search minerals"
          value={vm.search}
          placeholder="Search minerals…"
          onChange={(event) => vm.setSearch(event.target.value)}
          style={css('width:100%; max-width:480px; height:46px; border:1px solid #dde2f0; border-radius:12px; padding:0 14px; font-size:14.5px;')}
        />
      </label>

      <div style={css('display:flex; flex-wrap:wrap; gap:10px; margin-bottom:22px;')}>
        <select aria-label="Category" value={vm.category} onChange={(event) => vm.setCategory(event.target.value)} style={css(SELECT)}>
          <option value="all">All</option>
          {vm.categories.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select aria-label="Mineral type" value={vm.mineralType} onChange={(event) => vm.setMineralType(event.target.value)} style={css(SELECT)}>
          <option value="">All mineral types</option>
          {vm.mineralTypes.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select aria-label="Form" value={vm.productForm} onChange={(event) => vm.setProductForm(event.target.value)} style={css(SELECT)}>
          <option value="">All forms</option>
          {vm.forms.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select aria-label="Sort" value={vm.sort} onChange={(event) => vm.setSort(event.target.value)} style={css(SELECT)}>
          <option value="featured">Featured</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>

      {vm.loading && (
        <div role="status">
          <h2 style={css("font-family:'Poppins'; font-size:20px;")}>Loading catalog</h2>
          <p>Fetching assured lots from Mineral Bridge.</p>
        </div>
      )}

      {vm.failed && (
        <div role="alert">
          <h2 style={css("font-family:'Poppins'; font-size:20px;")}>Could not load the catalog</h2>
          <p>The request failed, so no minerals are shown.</p>
          <button type="button" onClick={vm.retry}>Retry</button>
        </div>
      )}

      {!vm.loading && !vm.failed && (
        <div
          className="v2-g3"
          style={css('display:grid; grid-template-columns:repeat(4,1fr); gap:18px;')}
        >
          {vm.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {vm.empty && (
        <div style={css('margin-top:28px;')}>
          <h2 style={css("font-family:'Poppins'; font-size:20px; margin:0;")}>{vm.emptyTitle}</h2>
          <p style={css('color:#6b7290;')}>{vm.emptyBody}</p>
          <button type="button" onClick={vm.clear}>All</button>
        </div>
      )}
    </div>
  );
}
