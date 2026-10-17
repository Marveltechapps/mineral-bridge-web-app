import { useActions } from '@/hooks/useActions';
import { useHomeViewModel } from '@/features/home/hooks/useHomeViewModel';
import { PassportPanel } from '@/features/passport/components/PassportPanel';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { Icon } from '@/components/common/Icon';
import { CartGlyph, CheckGlyph } from '@/components/common/Glyphs';
import { css } from '@/utils/css';

const SECTION = 'max-width:1440px; margin:0 auto; padding:52px 32px 0;';
const H2 =
  "font-family:'Poppins'; font-size:26px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.4px;";

/** Landing screen: hero, trust strip, categories, listings, passport, sell CTA and pipelines. */
export function HomePage() {
  const h = useActions();
  const vm = useHomeViewModel();

  return (
    <div>
      {/* hero */}
      <section
        style={css(
          "position:relative; overflow:hidden; background:linear-gradient(115deg,rgba(20,26,46,.93) 0%,rgba(30,42,90,.82) 55%,rgba(58,44,20,.88) 130%), url('https://commons.wikimedia.org/wiki/Special:FilePath/Gold%20mine.jpg?width=1400') center/cover; color:#fff;",
        )}
      >
        <div
          style={css(
            'position:absolute; top:-120px; right:-80px; width:520px; height:520px; background:radial-gradient(circle,rgba(243,210,122,.22),transparent 68%);',
          )}
        />
        <div
          className="v2-split"
          style={css(
            'position:relative; max-width:1440px; margin:0 auto; padding:64px 32px 72px; display:grid; grid-template-columns:1.15fr .85fr; gap:56px; align-items:center;',
          )}
        >
          <div>
            <span
              style={css(
                'display:inline-block; padding:7px 15px; border-radius:9px; background:rgba(247,221,142,.14); border:1px solid rgba(247,221,142,.35); font-size:11.5px; font-weight:800; letter-spacing:1.2px; color:#f7dd8e;',
              )}
            >
              VERIFIED B2B MINERAL TRADE
            </span>
            <h1
              style={css(
                "font-family:'Poppins'; font-size:50px; line-height:1.06; font-weight:800; letter-spacing:-1.2px; margin:22px 0 0;",
              )}
            >
              Fair price. Safety.
              <br />
              Stability.
            </h1>
            <p
              style={css(
                'font-size:16.5px; line-height:1.65; color:rgba(255,255,255,.76); max-width:520px; margin:20px 0 0;',
              )}
            >
              Buy assured minerals with escrow-backed settlement and full chain-of-custody documentation — or sell yours to us, verified on site at your location.
            </p>
            <div style={css('display:flex; gap:14px; margin-top:32px; flex-wrap:wrap;')}>
              <button
                className="v2-btn"
                onClick={h.goBuy}
                style={css(
                  'height:54px; padding:0 30px; border-radius:13px; border:none; background:linear-gradient(135deg,#f7dd8e,#c8962f); color:#141a2e; font-size:15.5px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:10px;',
                )}
              >
                <CartGlyph />
                Browse minerals
              </button>
              <button
                onClick={h.goSell}
                style={css(
                  'height:54px; padding:0 30px; border-radius:13px; border:1px solid rgba(255,255,255,.28); background:rgba(255,255,255,.06); color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;',
                )}
              >
                Sell your mineral
              </button>
            </div>
            <div style={css('display:flex; gap:36px; margin-top:44px; flex-wrap:wrap;')}>
              {vm.heroStats.map((s) => (
                <div key={s.label}>
                  <div
                    className="v2-gold"
                    style={css("font-family:'Poppins'; font-size:28px; font-weight:800;")}
                  >
                    {s.value}
                  </div>
                  <div
                    style={css(
                      'font-size:12.5px; color:rgba(255,255,255,.6); margin-top:3px; letter-spacing:.3px;',
                    )}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* live rates panel */}
          <div
            style={css(
              'background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.13); border-radius:22px; padding:26px; backdrop-filter:blur(8px);',
            )}
          >
            <div
              style={css(
                'display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;',
              )}
            >
              <span
                style={css(
                  'font-size:12px; font-weight:800; letter-spacing:1px; color:rgba(255,255,255,.62);',
                )}
              >
                INDICATIVE RATES
              </span>
              <span
                style={css(
                  'display:flex; align-items:center; gap:6px; font-size:11.5px; font-weight:700; color:#7fe3a1;',
                )}
              >
                <span
                  style={css('width:7px; height:7px; border-radius:4px; background:#7fe3a1;')}
                />
                LIVE
              </span>
            </div>
            {vm.heroRates.map((r) => (
              <div key={r.name} style={css(r.rowStyle)}>
                <span
                  style={css(
                    'width:34px; height:34px; border-radius:10px; background:' +
                      r.grad +
                      '; flex-shrink:0;',
                  )}
                />
                <div style={css('flex:1; min-width:0;')}>
                  <div style={css('font-size:14.5px; font-weight:700; color:#fff;')}>{r.name}</div>
                  <div style={css('font-size:11.5px; color:rgba(255,255,255,.55);')}>
                    {r.category}
                  </div>
                </div>
                <div style={css('text-align:right;')}>
                  <div style={css('font-size:14.5px; font-weight:800; color:#fff;')}>{r.price}</div>
                  <div
                    style={css('font-size:11.5px; font-weight:700; color:' + r.deltaColor + ';')}
                  >
                    {r.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section style={css('background:#fff; border-bottom:1px solid #e7eaf3;')}>
        <div
          className="v2-g4"
          style={css(
            'max-width:1440px; margin:0 auto; padding:26px 32px; display:grid; grid-template-columns:repeat(4,1fr); gap:26px;',
          )}
        >
          {vm.trustItems.map((t) => (
            <div key={t.title} style={css('display:flex; align-items:center; gap:13px;')}>
              <span
                style={css(
                  'width:42px; height:42px; border-radius:12px; background:#eef1fb; color:#1e2a5a; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                )}
              >
                <Icon name={t.ic} size={21} />
              </span>
              <div>
                <div style={css('font-size:14px; font-weight:800; color:#141a2e;')}>{t.title}</div>
                <div style={css('font-size:12.5px; color:#6b7290; margin-top:1px;')}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* categories */}
      <section style={css('max-width:1440px; margin:0 auto; padding:54px 32px 0;')}>
        <div
          style={css(
            'display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:22px;',
          )}
        >
          <div>
            <h2 style={css(H2)}>Shop by category</h2>
            <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>
              {vm.homeCategoryLead}
            </p>
          </div>
          <button
            onClick={h.goBuy}
            style={css(
              'background:none; border:none; color:#1e2a5a; font-size:14px; font-weight:800; cursor:pointer;',
            )}
          >
            View all →
          </button>
        </div>
        <div
          className="v2-g3"
          style={css('display:grid; grid-template-columns:repeat(5,1fr); gap:16px;')}
        >
          {vm.homeCats.map((c) => (
            <button
              key={c.name}
              className="v2-lift"
              onClick={c.open}
              style={css(
                'position:relative; overflow:hidden; height:168px; border:none; border-radius:18px; cursor:pointer; padding:0; text-align:left; box-shadow:0 6px 18px rgba(20,26,46,.08); background:#eef1f6;',
              )}
            >
              <span style={css('position:absolute; inset:0; background:' + c.grad + ';')} />
              <span
                style={css(
                  'position:absolute; inset:0; background:linear-gradient(180deg,rgba(20,26,46,.05),rgba(20,26,46,.72));',
                )}
              />
              <span style={css('position:absolute; left:16px; right:16px; bottom:15px; display:block;')}>
                <span style={css('display:block; font-size:15.5px; font-weight:800; color:#fff;')}>
                  {c.name}
                </span>
                <span
                  style={css(
                    'display:block; font-size:11.5px; color:rgba(255,255,255,.72); margin-top:3px;',
                  )}
                >
                  {c.count} types
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* listings */}
      <section style={css(SECTION)}>
        <div
          style={css(
            'display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:20px;',
          )}
        >
          <div>
            <h2 style={css(H2)}>Available listings</h2>
            <p style={css('font-size:14px; color:#6b7290; margin:6px 0 0;')}>
              {vm.homeListCount} verified lots ready to trade.
            </p>
          </div>
          <div style={css('display:flex; gap:8px; flex-wrap:wrap;')}>
            {vm.homeFilters.map((f) => (
              <button key={f.key} className="v2-chip" onClick={f.select} style={css(f.style)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className="v2-g4"
          style={css('display:grid; grid-template-columns:repeat(4,1fr); gap:18px;')}
        >
          {vm.homeProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {vm.homeNotice && (
          <div style={css('margin-top:18px; font-size:14px; color:#6b7290;')}>
            {vm.homeNotice}{' '}
            <button
              onClick={vm.retryCatalog}
              style={css('background:none; border:none; padding:0; color:#1e2a5a; font-weight:800; cursor:pointer;')}
            >
              Retry
            </button>
          </div>
        )}
      </section>

      {/* verify passport */}
      <PassportPanel />

      {/* sell CTA */}
      <section style={css(SECTION)}>
        <div
          className="v2-split"
          style={css(
            'position:relative; overflow:hidden; border-radius:22px; background:linear-gradient(110deg,#1e2a5a,#3a2c14 135%); padding:42px 44px; display:grid; grid-template-columns:1.4fr .6fr; gap:32px; align-items:center;',
          )}
        >
          <div
            style={css(
              'position:absolute; top:-90px; right:-40px; width:340px; height:340px; background:radial-gradient(circle,rgba(243,210,122,.2),transparent 70%);',
            )}
          />
          <div style={css('position:relative;')}>
            <h2
              style={css(
                "font-family:'Poppins'; font-size:30px; font-weight:800; color:#fff; margin:0; letter-spacing:-.5px;",
              )}
            >
              Have minerals? Sell here.
            </h2>
            <p
              style={css(
                'font-size:15px; line-height:1.6; color:rgba(255,255,255,.76); max-width:560px; margin:12px 0 0;',
              )}
            >
              Our verification team comes to you and checks your mineral on site. Once verified, we handle packing and shipping, and our support team contacts you to arrange payment.
            </p>
            <div style={css('display:flex; gap:26px; margin-top:22px; flex-wrap:wrap;')}>
              {vm.sellPerks.map((s) => (
                <span
                  key={s.v}
                  style={css(
                    'display:flex; align-items:center; gap:8px; font-size:13.5px; font-weight:700; color:#f7dd8e;',
                  )}
                >
                  <CheckGlyph size={16} strokeWidth={3} />
                  {s.v}
                </span>
              ))}
            </div>
          </div>
          <div style={css('position:relative;')}>
            <button
              className="v2-btn"
              onClick={h.startSelling}
              style={css(
                'width:100%; height:56px; border:none; border-radius:14px; background:linear-gradient(135deg,#f7dd8e,#c8962f); color:#141a2e; font-size:16px; font-weight:800; cursor:pointer;',
              )}
            >
              Start Selling
            </button>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section style={css('max-width:1440px; margin:0 auto; padding:56px 32px 72px;')}>
        <h2
          style={css(
            "font-family:'Poppins'; font-size:26px; font-weight:800; color:#141a2e; margin:0 0 6px; letter-spacing:-.4px;",
          )}
        >
          How it works
        </h2>
        <p style={css('font-size:14px; color:#525a78; margin:0 0 26px;')}>
          Buying and selling follow two different audited pipelines.
        </p>
        <div style={css('display:flex; flex-direction:column; gap:28px;')}>
          {vm.pipelines.map((pl) => (
            <div key={pl.key}>
              <div
                style={css(
                  'display:flex; align-items:baseline; gap:12px; margin-bottom:14px; flex-wrap:wrap;',
                )}
              >
                <span
                  style={css(
                    'font-size:12px; font-weight:800; letter-spacing:1px; color:#141a2e;',
                  )}
                >
                  {pl.label}
                </span>
                <span style={css('font-size:13px; color:#525a78;')}>{pl.note}</span>
              </div>
              <div
                className="v2-g3"
                style={css('display:grid; grid-template-columns:repeat(6,1fr); gap:14px;')}
              >
                {pl.steps.map((p) => (
                  <div
                    key={p.n}
                    style={css(
                      'background:#fff; border:1px solid #e7eaf3; border-radius:16px; padding:20px 18px;',
                    )}
                  >
                    <div
                      style={css(
                        'width:30px; height:30px; border-radius:15px; background:#141a2e; color:#f7dd8e; font-size:13px; font-weight:800; display:flex; align-items:center; justify-content:center;',
                      )}
                    >
                      {p.n}
                    </div>
                    <div
                      style={css('font-size:14px; font-weight:800; color:#141a2e; margin-top:13px;')}
                    >
                      {p.title}
                    </div>
                    <div
                      style={css(
                        'font-size:12.5px; color:#525a78; margin-top:5px; line-height:1.5;',
                      )}
                    >
                      {p.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
