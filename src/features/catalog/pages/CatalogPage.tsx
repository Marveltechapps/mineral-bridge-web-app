import { useCatalogViewModel, type BrowseCard } from '@/features/catalog/hooks/useCatalogViewModel';
import { ArrowLeftGlyph } from '@/components/common/Glyphs';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { css } from '@/utils/css';
import '@/features/catalog/catalogBrowse.css';

function Media({ card, className }: { card: BrowseCard; className: string }) {
  const framed = className !== 'mb-sub-thumb';
  const image = card.imageUrl
    ? <img className={`${className} product-image`} src={card.imageUrl} alt="" />
    : <span className={className} style={card.background ? { background: card.background } : undefined} />;
  if (!framed) return image;
  return <span className="mb-frame">{image}</span>;
}

/** Browse minerals as three screens: categories, subcategories, then product forms. */
export function CatalogPage() {
  const vm = useCatalogViewModel();

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <Breadcrumb current={vm.level === 'categories' ? 'Browse minerals' : vm.title} />
      {vm.backLabel ? (
        <button type="button" className="mb-browse-back" onClick={vm.back}>
          <ArrowLeftGlyph size={16} />
          {vm.backLabel}
        </button>
      ) : null}
      <div className="mb-browse-head">
        <div>
          <p className="mb-browse-kicker">{vm.context}</p>
          <h1 className="mb-browse-title">{vm.title}</h1>
          <p className="mb-browse-count">{vm.loading ? 'Loading…' : vm.countLabel}</p>
        </div>
      </div>

      {vm.level === 'items' && (
        <label className="mb-browse-search">
          <input
            aria-label="Search product forms"
            value={vm.search}
            placeholder="Search product forms…"
            onChange={(event) => vm.setSearch(event.target.value)}
          />
        </label>
      )}

      {vm.loading && (
        <div className="mb-state" role="status">
          <h2>Loading catalog</h2>
          <p>Fetching categories from Mineral Bridge.</p>
        </div>
      )}

      {vm.failed && (
        <div className="mb-state" role="alert">
          <h2>Could not load the catalog</h2>
          <p>The request failed, so no minerals are shown.</p>
          <button type="button" onClick={vm.retry}>
            Retry
          </button>
        </div>
      )}

      {!vm.loading && !vm.failed && vm.level === 'categories' && (
        <div className="mb-cat-grid">
          {vm.cards.map((card) => (
            <button key={card.slug} type="button" className="mb-cat v2-lift" onClick={card.open}>
              <Media card={card} className="mb-cat-image" />
              <span className="mb-cat-body">
                <span className="mb-cat-name">{card.name}</span>
                <span className="mb-cat-meta">{card.meta}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {!vm.loading && !vm.failed && vm.level === 'subcategories' && (
        <div className="mb-sub-list">
          {vm.cards.map((card) => (
            <button key={card.slug} type="button" className="mb-sub" onClick={card.open}>
              <Media card={card} className="mb-sub-thumb" />
              <span className="mb-sub-copy">
                <span className="mb-sub-name">{card.name}</span>
                <span className="mb-sub-meta">{card.meta}</span>
              </span>
              <svg className="mb-sub-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {!vm.loading && !vm.failed && vm.level === 'items' && (
        <div className="mb-item-grid">
          {vm.cards.map((card) => {
            const body = (
              <>
                <Media card={card} className="mb-item-image" />
                <span className="mb-item-body">
                  <span className="mb-item-name">{card.name}</span>
                  {card.meta ? <span className="mb-item-meta">{card.meta}</span> : null}
                  {card.price ? (
                    <span className="mb-item-price">
                      {card.price}
                      {card.unit ? ` / ${card.unit}` : ''}
                    </span>
                  ) : null}
                </span>
              </>
            );
            return card.open ? (
              <button key={card.slug} type="button" className="mb-item v2-lift" onClick={card.open}>
                {body}
              </button>
            ) : (
              <article key={card.slug} className="mb-item mb-static">
                {body}
              </article>
            );
          })}
        </div>
      )}

      {vm.empty && (
        <div className="mb-state">
          <h2>{vm.emptyTitle}</h2>
          <p>{vm.emptyBody}</p>
          {vm.level !== 'categories' && (
            <button type="button" onClick={vm.back}>
              {vm.backLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
