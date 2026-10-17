import { ChainGlyph, PinGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

export interface ProductCardModel {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  grade: string;
  region: string;
  price: string;
  unit: string;
  stock: string;
  grad: string;
  open: () => void;
  buy: () => void;
}

/** Listing tile used on the home screen's "Available listings" grid. */
export function ProductCard({ product: p }: { product: ProductCardModel }) {
  return (
    <div
      className="v2-lift"
      onClick={p.open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          p.open();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${p.name} — ${p.price} per ${p.unit}`}
      style={css(
        'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 4px 14px rgba(20,26,46,.05); display:flex; flex-direction:column; cursor:pointer;',
      )}
    >
      <div style={css('border:none; padding:0; background:none; text-align:left;')}>
        <div style={css('height:180px; background:' + p.grad + '; position:relative; background-color:#eef1f6;')}>
          <span
            style={css(
              'position:absolute; top:12px; left:12px; background:rgba(255,255,255,.94); color:#141a2e; font-size:10px; font-weight:800; letter-spacing:.4px; padding:5px 10px; border-radius:8px;',
            )}
          >
            {p.category}
          </span>
          <span
            style={css(
              'position:absolute; top:12px; right:12px; background:rgba(20,26,46,.72); color:#7fe3a1; font-size:10px; font-weight:800; padding:5px 9px; border-radius:8px;',
            )}
          >
            {p.grade}
          </span>
          <span
            style={css(
              'position:absolute; left:12px; bottom:12px; display:inline-flex; align-items:center; gap:5px; background:rgba(20,26,46,.82); color:#7fe3a1; font-size:9.5px; font-weight:800; letter-spacing:.5px; padding:5px 9px; border-radius:8px;',
            )}
          >
            <ChainGlyph />
            VERIFIED ON BLOCKCHAIN
          </span>
        </div>
      </div>
      <div style={css('padding:15px 17px 17px; display:flex; flex-direction:column; flex:1;')}>
        <div
          style={css('font-size:11px; font-weight:800; letter-spacing:.5px; color:#8b95b4;')}
        >
          {p.subCategory}
        </div>
        <div style={css('font-size:15.5px; font-weight:800; color:#141a2e; margin-top:3px;')}>
          {p.name}
        </div>
        <div
          style={css(
            'display:flex; align-items:center; gap:6px; font-size:12.5px; color:#6b7290; margin-top:4px;',
          )}
        >
          <PinGlyph />
          {p.region}
        </div>
        <div style={css('display:flex; align-items:baseline; gap:5px; margin-top:12px;')}>
          <span
            style={css("font-family:'Poppins'; font-size:20px; font-weight:800; color:#141a2e;")}
          >
            {p.price}
          </span>
          <span style={css('font-size:12.5px; color:#8b95b4;')}>/ {p.unit}</span>
        </div>
        <div
          style={css(
            'display:flex; align-items:center; gap:7px; margin-top:9px; padding-bottom:14px; border-bottom:1px solid #f0f2f8;',
          )}
        >
          <span style={css('width:7px; height:7px; border-radius:4px; background:#16a34a;')} />
          <span style={css('font-size:12px; font-weight:700; color:#16a34a;')}>
            {p.stock} available
          </span>
        </div>
        <button
          className="v2-btn"
          onClick={(e) => {
            e.stopPropagation();
            p.buy();
          }}
          style={css(
            'width:100%; height:40px; margin-top:14px; border:none; border-radius:10px; background:#1e2a5a; color:#fff; font-size:13px; font-weight:800; cursor:pointer;',
          )}
        >
          Buy
        </button>
      </div>
    </div>
  );
}
