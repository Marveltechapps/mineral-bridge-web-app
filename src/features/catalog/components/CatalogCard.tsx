import { ChainGlyph, PinGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

export interface CatalogCardModel {
  id: string;
  name: string;
  category: string;
  grade: string;
  region: string;
  seller: string;
  price: string;
  unit: string;
  stock: string;
  grad: string;
  open: () => void;
}

/** Lot tile used on the catalog grid — taller image, seller line and "View lot". */
export function CatalogCard({ product: p }: { product: CatalogCardModel }) {
  return (
    <div
      className="v2-lift"
      style={css(
        'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 4px 14px rgba(20,26,46,.05); display:flex; flex-direction:column;',
      )}
    >
      <button
        onClick={p.open}
        aria-label={`View ${p.name}`}
        style={css('border:none; padding:0; background:none; cursor:pointer; text-align:left;')}
      >
        <div style={css('height:150px; background:' + p.grad + '; position:relative;')}>
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
      </button>
      <div style={css('padding:16px 18px 18px; display:flex; flex-direction:column; flex:1;')}>
        <div style={css('font-size:16px; font-weight:800; color:#141a2e;')}>{p.name}</div>
        <div
          style={css(
            'display:flex; align-items:center; gap:6px; font-size:12.5px; color:#6b7290; margin-top:4px;',
          )}
        >
          {/*
            The row is a flex container with a 6px gap, so each run of text is
            its own flex item. Keeping region and seller in separate spans
            reproduces the design's spacing around the separator exactly.
          */}
          <PinGlyph />
          <span>{p.region}</span> · <span>{p.seller}</span>
        </div>
        <div style={css('display:flex; align-items:baseline; gap:5px; margin-top:13px;')}>
          <span style={css("font-family:'Poppins'; font-size:21px; font-weight:800; color:#141a2e;")}>
            {p.price}
          </span>
          <span style={css('font-size:12.5px; color:#8b95b4;')}>/ {p.unit}</span>
        </div>
        <div
          style={css(
            'display:flex; align-items:center; gap:7px; margin-top:9px; padding-bottom:15px; border-bottom:1px solid #f0f2f8;',
          )}
        >
          <span style={css('width:7px; height:7px; border-radius:4px; background:#16a34a;')} />
          <span style={css('font-size:12px; font-weight:700; color:#16a34a;')}>
            {p.stock} available
          </span>
        </div>
        <button
          className="v2-btn"
          onClick={p.open}
          style={css(
            'width:100%; height:44px; margin-top:15px; border:none; border-radius:11px; background:#1e2a5a; color:#fff; font-size:14px; font-weight:800; cursor:pointer;',
          )}
        >
          View lot
        </button>
      </div>
    </div>
  );
}
