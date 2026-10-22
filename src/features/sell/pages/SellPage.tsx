import { useSellViewModel } from '@/features/sell/hooks/useSellViewModel';
import { useActions } from '@/hooks/useActions';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ChevronGlyph } from '@/components/common/Glyphs';
import { InfoNote } from '@/components/common/InfoNote';
import { css } from '@/utils/css';

const LABEL_CAPS =
  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin:26px 0 12px;';
const SUMMARY_ROW =
  'display:flex; justify-content:space-between; gap:16px; padding:14px 0; border-bottom:1px solid #eef1f8;';

/** "Sell a mineral" — a four-step wizard with a sticky step rail. */
export function SellPage() {
  const vm = useSellViewModel();
  const h = useActions();

  const summary = (
    <div
      style={css('background:#f9fafd; border:1px solid #eef1f8; border-radius:16px; padding:8px 20px;')}
    >
      {vm.sellSummary.map((s) => (
        <div key={s.k} style={css(SUMMARY_ROW)}>
          <span style={css('font-size:13.5px; color:#6b7290;')}>{s.k}</span>
          <span style={css('font-size:14px; font-weight:800; color:#141a2e;')}>{s.v}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={css('max-width:1440px; margin:0 auto; padding:32px;')}>
      <Breadcrumb current="Sell a mineral" />

      <div
        className="v2-split"
        style={css('display:grid; grid-template-columns:264px 1fr; gap:28px; align-items:start;')}
      >
        {/* step rail */}
        <aside
          className="v2-sticky"
          aria-label="Listing steps"
          style={css(
            'position:sticky; top:96px; background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:22px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
          )}
        >
          <div
            style={css(
              'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin-bottom:16px;',
            )}
          >
            LISTING STEPS
          </div>
          {vm.sellSteps.map((s) => (
            <button key={s.n} onClick={s.go} disabled={s.locked} style={css(s.rowStyle)}>
              <span style={css(s.dot)}>{s.dotLabel}</span>
              <span style={css('flex:1;')}>
                <span
                  style={css(
                    'display:block; font-size:14px; font-weight:800; color:' + s.titleColor + ';',
                  )}
                >
                  {s.title}
                </span>
                <span
                  style={css('display:block; font-size:12px; color:#8b95b4; margin-top:2px;')}
                >
                  {s.sub}
                </span>
              </span>
            </button>
          ))}
          <div style={css('margin-top:18px; padding-top:16px; border-top:1px solid #f0f2f8;')}>
            <div
              style={css('height:7px; border-radius:4px; background:#eef1f8; overflow:hidden;')}
            >
              <div
                style={css(
                  'width:' +
                    vm.sellProgress +
                    '; height:100%; background:linear-gradient(90deg,#16a34a,#22c55e);',
                )}
              />
            </div>
            <div style={css('font-size:12px; font-weight:700; color:#6b7290; margin-top:9px;')}>
              {vm.sellProgressLabel}
            </div>
          </div>
        </aside>

        {/* step body */}
        <div>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:27px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
            )}
          >
            {vm.sellTitle}
          </h1>
          <p style={css('font-size:14px; color:#6b7290; margin:6px 0 22px;')}>{vm.sellSubtitle}</p>

          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:20px; padding:28px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
            )}
          >
            {/* step 1: mineral */}
            {vm.sellStep1 && (
              <>
                <div
                  className="v2-g2"
                  style={css('display:grid; grid-template-columns:1fr 1fr; gap:20px;')}
                >
                  <div>
                    <div style={css(vm.lbl)}>Mineral *</div>
                    <div style={css('position:relative;')}>
                      <select
                        value={vm.sellForm.mineral}
                        onChange={vm.sfMineralPick}
                        aria-label="Mineral"
                        style={css(vm.sel)}
                      >
                        {vm.sellMineralOpts.map((o) => (
                          <option key={o.v || 'none'} value={o.v}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <span
                        style={css(
                          'position:absolute; right:14px; top:18px; pointer-events:none; color:#8b95b4; display:flex;',
                        )}
                      >
                        <ChevronGlyph size={16} />
                      </span>
                    </div>
                    {vm.sellIsOther && (
                      <>
                        <input
                          value={vm.sellForm.customMineral}
                          onChange={vm.sfCustomMineral}
                          placeholder="Name your mineral (e.g. Tantalite ore)"
                          aria-label="Mineral name"
                          style={css(vm.inp + ' margin-top:10px;')}
                        />
                        <InfoNote variant="hint" style=" margin-top:4px;">
                          Not in our catalogue? No problem — our verification team will assess it on site and our support team will agree a price with you.
                        </InfoNote>
                      </>
                    )}
                  </div>
                  <div>
                    <div style={css(vm.lbl)}>Category *</div>
                    <div style={css('position:relative;')}>
                      <select
                        value={vm.sellForm.category}
                        onChange={vm.sfCategory}
                        aria-label="Category"
                        style={css(vm.sel)}
                      >
                        {vm.sellCatOpts.map((c) => (
                          <option key={c.v} value={c.v}>
                            {c.v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div style={css(vm.lbl)}>Estimated quantity *</div>
                    <input
                      value={vm.sellForm.qty}
                      onChange={vm.sfQty}
                      placeholder="e.g. 500"
                      aria-label="Estimated quantity"
                      style={css(vm.inp)}
                    />
                  </div>
                  <div>
                    <div style={css(vm.lbl)}>Unit *</div>
                    <div style={css('position:relative;')}>
                      <select
                        value={vm.sellForm.unit}
                        onChange={vm.sfUnit}
                        aria-label="Unit"
                        style={css(vm.sel)}
                      >
                        {vm.sellUnitOpts.map((u) => (
                          <option key={u.v} value={u.v}>
                            {u.v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={css(vm.lbl)}>Form / condition *</div>
                <div style={css('display:flex; gap:10px; flex-wrap:wrap; margin-bottom:18px;')}>
                  {vm.sellFormOpts.map((o) => (
                    <button key={o.label} onClick={o.select} style={css(o.style)}>
                      {o.label}
                    </button>
                  ))}
                </div>

                <div style={css(vm.lbl)}>Photos of your mineral *</div>
                <label
                  htmlFor="sell-photos"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    vm.addSellPhotos(event.dataTransfer.files);
                  }}
                  style={css(
                    'display:block; border:1.5px dashed #cdd4e6; border-radius:16px; padding:32px; text-align:center; background:#f9fafd; cursor:pointer;',
                  )}
                >
                  <div
                    style={css(
                      'display:flex; justify-content:center; color:#8b95b4; margin-bottom:10px;',
                    )}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div style={css('font-size:14.5px; font-weight:800; color:#1e2a5a;')}>
                    Upload at least 3 photos
                  </div>
                  <div style={css('font-size:12.5px; color:#8b95b4; margin-top:4px;')}>
                    JPG or PNG · up to 10 MB each
                  </div>
                </label>
                <input
                  id="sell-photos"
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  aria-label="Photos of your mineral"
                  onChange={(event) => {
                    vm.addSellPhotos(event.target.files);
                    event.target.value = '';
                  }}
                  style={css('position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;')}
                />
                <div
                  style={css(
                    'display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:14px;',
                  )}
                >
                  {vm.sellPhotos.map((p) => (
                    <div key={p.i} style={css(p.box)}>
                      {p.previewUrl ? (
                        <img
                          src={p.previewUrl}
                          alt={p.name}
                          style={css('width:100%; height:100%; object-fit:cover; display:block;')}
                        />
                      ) : null}
                      {p.previewUrl ? (
                        <button
                          type="button"
                          aria-label={p.removeLabel}
                          onClick={p.remove}
                          style={css(
                            'position:absolute; left:8px; right:8px; bottom:8px; border:0; border-radius:8px; padding:6px 8px; background:rgba(20,26,46,.82); color:#fff; font-size:12px; font-weight:700; cursor:pointer;',
                          )}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div style={css(vm.lbl)}>Description</div>
                <textarea
                  placeholder="Purity, origin, extraction date, documentation you hold…"
                  aria-label="Description"
                  style={css(vm.ta)}
                />
              </>
            )}

            {/* step 2: logistics */}
            {vm.sellStep2 && (
              <>
                <InfoNote variant="amber" style=" margin-bottom:22px;">
                  Our verification team travels to you. The mineral is checked in person at your location before anything is packed or shipped.
                </InfoNote>
                <div
                  className="v2-g2"
                  style={css('display:grid; grid-template-columns:1fr 1fr; gap:20px;')}
                >
                  <div style={css('grid-column:1 / -1;')}>
                    <div style={css(vm.lbl)}>Site or business name *</div>
                    <input
                      placeholder="Where the mineral is held"
                      aria-label="Site or business name"
                      style={css(vm.inp)}
                    />
                  </div>
                  <div style={css('grid-column:1 / -1;')}>
                    <div style={css(vm.lbl)}>Street address *</div>
                    <input
                      placeholder="Street name and number"
                      aria-label="Street address"
                      style={css(vm.inp)}
                    />
                  </div>
                  <div>
                    <div style={css(vm.lbl)}>City *</div>
                    <input
                      value={vm.sellForm.city}
                      onChange={vm.sfCity}
                      placeholder="City"
                      aria-label="City"
                      style={css(vm.inp)}
                    />
                  </div>
                  <div>
                    <div style={css(vm.lbl)}>Region / state</div>
                    <input placeholder="Region" aria-label="Region or state" style={css(vm.inp)} />
                  </div>
                  <div>
                    <div style={css(vm.lbl)}>Country *</div>
                    <input
                      value={vm.sellForm.country}
                      onChange={vm.sfCountry}
                      placeholder="Country"
                      aria-label="Country"
                      style={css(vm.inp)}
                    />
                  </div>
                  <div>
                    <div style={css(vm.lbl)}>Preferred visit date</div>
                    <input type="date" aria-label="Preferred visit date" style={css(vm.inp)} />
                  </div>
                </div>
                <div style={css(vm.lbl)}>Preferred time of day</div>
                <div style={css('display:flex; gap:10px; flex-wrap:wrap;')}>
                  {vm.sellSlotOpts.map((o) => (
                    <button key={o.label} onClick={o.select} style={css(o.style)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* step 3: review */}
            {vm.sellStep3 && (
              <>
                <InfoNote variant="blue" style=" margin-bottom:22px;">
                  No price is quoted at this stage. Our verification team checks the mineral at your location first, then our support team contacts you to agree the amount.
                </InfoNote>
                <div
                  style={css(
                    'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin:0 0 12px;',
                  )}
                >
                  YOUR SUBMISSION
                </div>
                {summary}
                <div style={css(LABEL_CAPS)}>WHAT HAPPENS AFTER YOU SUBMIT</div>
                <div style={css('display:flex; flex-direction:column; gap:12px;')}>
                  {vm.sellNextSteps.map((n) => (
                    <div
                      key={n.n}
                      style={css(
                        'display:flex; gap:14px; align-items:flex-start; background:#fff; border:1px solid #e7eaf3; border-radius:14px; padding:16px 18px;',
                      )}
                    >
                      <span
                        style={css(
                          'width:28px; height:28px; border-radius:14px; background:#eef1fb; color:#1e2a5a; font-size:12.5px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                        )}
                      >
                        {n.n}
                      </span>
                      <div>
                        <div style={css('font-size:14.5px; font-weight:800; color:#141a2e;')}>
                          {n.title}
                        </div>
                        <div
                          style={css(
                            'font-size:13px; color:#6b7290; margin-top:3px; line-height:1.55;',
                          )}
                        >
                          {n.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* step 4: submitted */}
            {vm.sellStep4 && (
              <>
                <div style={css('text-align:center; padding:8px 0 0;')}>
                  <div
                    style={css(
                      'width:84px; height:84px; border-radius:42px; background:#dcf3e8; display:flex; align-items:center; justify-content:center; margin:0 auto 18px; color:#16a34a;',
                    )}
                  >
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div
                    style={css("font-family:'Poppins'; font-size:24px; font-weight:800; color:#141a2e;")}
                  >
                    Submission received
                  </div>
                  <div
                    style={css(
                      'font-size:14.5px; color:#6b7290; margin:9px auto 0; line-height:1.6; max-width:480px;',
                    )}
                  >
                    Our verification team will contact you to arrange a visit to your location. Nothing needs to be shipped until the mineral has been verified in person.
                  </div>
                </div>

                <div
                  style={css(
                    'background:#f4f5f9; border:1px solid #e7eaf3; border-radius:14px; padding:16px 18px; margin-top:24px; display:flex; align-items:center; justify-content:space-between; gap:14px;',
                  )}
                >
                  <div>
                    <div
                      style={css(
                        'font-size:11px; font-weight:800; letter-spacing:.5px; color:#8b95b4;',
                      )}
                    >
                      REFERENCE
                    </div>
                    <div
                      style={css('font-size:15.5px; font-weight:800; color:#141a2e; margin-top:2px;')}
                    >
                      MB-SELL-41982
                    </div>
                  </div>
                  <span
                    style={css(
                      'font-size:11.5px; font-weight:800; color:#b45309; background:#fdecd6; padding:6px 13px; border-radius:9px; white-space:nowrap;',
                    )}
                  >
                    AWAITING VERIFICATION
                  </span>
                </div>

                <div style={css(LABEL_CAPS)}>YOUR SUBMISSION</div>
                {summary}

                <button
                  onClick={h.goOrders}
                  style={css(
                    'width:100%; height:52px; margin-top:20px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:15px; font-weight:800; cursor:pointer;',
                  )}
                >
                  Track this submission
                </button>
              </>
            )}
          </div>

          <div style={css('display:flex; gap:12px; margin-top:20px;')}>
            {vm.sellCanBack && (
              <button
                onClick={vm.sellBack}
                style={css(
                  'height:54px; padding:0 26px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:15px; font-weight:800; cursor:pointer;',
                )}
              >
                Back
              </button>
            )}
            <div style={css('flex:1;')} />
            <button
              className="v2-btn"
              onClick={vm.sellNext}
              style={css(
                'height:54px; padding:0 34px; border:none; border-radius:13px; background:#1e2a5a; color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;',
              )}
            >
              {vm.sellNextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
