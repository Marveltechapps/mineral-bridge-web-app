import { useAsmViewModel } from '@/features/asm/hooks/useAsmViewModel';
import { InfoNote } from '@/components/common/InfoNote';
import { css } from '@/utils/css';

const STEPPER_BTN =
  'width:46px; height:46px; border-radius:12px; border:1px solid #dde2f0; background:#f7f8fc; font-size:21px; color:#3a4160; cursor:pointer;';
const NUMBER_INPUT =
  'flex:1; height:46px; border:1px solid #dde2f0; border-radius:12px; padding:0 14px; font-size:17px; font-weight:800; color:#141a2e; text-align:center; outline:none;';

const Tick = ({ size = 13, width = 3.4 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Artisanal site registration: eligibility, site, GPS, documents, submission. */
export function AsmPage() {
  const vm = useAsmViewModel();
  const { asm } = vm;

  return (
    <div style={css('max-width:760px; margin:0 auto; padding:32px 32px 72px;')}>
      <div style={css('display:flex; align-items:center; gap:12px; margin-bottom:22px;')}>
        <button
          onClick={vm.asmBack}
          aria-label="Back"
          style={css(
            'width:40px; height:40px; border-radius:20px; border:1px solid #dde2f0; background:#fff; color:#4a5170; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
          )}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={css('flex:1;')}>
          <div style={css('height:6px; border-radius:3px; background:#eef1f8; overflow:hidden;')}>
            <div
              style={css(
                'width:' +
                  asm.progress +
                  '; height:100%; background:linear-gradient(90deg,#16a34a,#22c55e); transition:width .3s ease;',
              )}
            />
          </div>
        </div>
        <span style={css('font-size:12.5px; font-weight:800; color:#6b7290; white-space:nowrap;')}>
          {asm.stepLabel}
        </span>
      </div>

      <h1
        style={css(
          "font-family:'Poppins'; font-size:27px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;",
        )}
      >
        {asm.title}
      </h1>
      <p style={css('font-size:15px; color:#6b7290; margin:9px 0 24px;')}>{asm.sub}</p>

      <div
        style={css(
          'background:#fff; border:1px solid #e7eaf3; border-radius:20px; padding:28px; box-shadow:0 4px 14px rgba(20,26,46,.05);',
        )}
      >
        {asm.isElig && (
          <>
            <div style={css('display:flex; flex-direction:column; gap:12px;')}>
              {vm.asmElig.map((e) => (
                <button key={e.i} onClick={e.toggle} aria-pressed={e.on} style={css(e.rowStyle)}>
                  <span style={css(e.box)}>{e.on && <Tick />}</span>
                  <span
                    style={css(
                      'flex:1; text-align:left; font-size:14.5px; font-weight:600; color:#3a4160; line-height:1.5;',
                    )}
                  >
                    {e.v}
                  </span>
                </button>
              ))}
            </div>
            {asm.eligShort && (
              <InfoNote variant="amberCompact" style=" margin-top:18px;">
                Tick every requirement you meet. You can still register if something is outstanding — our field team will help you close the gap.
              </InfoNote>
            )}
          </>
        )}

        {asm.isSite && (
          <>
            <div style={css(vm.lbl)}>Site or cooperative name *</div>
            <input
              value={vm.asmForm.site}
              onChange={vm.asmSite}
              placeholder="e.g. Kolwezi Cooperative Site 4"
              aria-label="Site or cooperative name"
              style={css(vm.inp)}
            />
            <div
              className="v2-g2"
              style={css('display:grid; grid-template-columns:1fr 1fr; gap:18px;')}
            >
              <div>
                <div style={css(vm.lbl)}>Country *</div>
                <input
                  value={vm.asmForm.country}
                  onChange={vm.asmCountry}
                  placeholder="Country"
                  aria-label="Country"
                  style={css(vm.inp)}
                />
              </div>
              <div>
                <div style={css(vm.lbl)}>Region / district</div>
                <input
                  value={vm.asmForm.region}
                  onChange={vm.asmRegion}
                  placeholder="Region"
                  aria-label="Region or district"
                  style={css(vm.inp)}
                />
              </div>
            </div>
            <div style={css(vm.lbl)}>Minerals worked at this site *</div>
            <div style={css('display:flex; gap:9px; flex-wrap:wrap; margin-bottom:6px;')}>
              {vm.asmMinerals.map((m) => (
                <button key={m.label} onClick={m.toggle} style={css(m.style)}>
                  {m.label}
                </button>
              ))}
            </div>
            <div style={css(vm.lbl)}>Number of workers on site</div>
            <div style={css('display:flex; align-items:center; gap:12px;')}>
              <button
                onClick={vm.asmWorkersDec}
                aria-label="Fewer workers"
                style={css(STEPPER_BTN)}
              >
                −
              </button>
              <input
                value={vm.asmForm.workers}
                onChange={vm.asmWorkers}
                aria-label="Number of workers"
                style={css(NUMBER_INPUT)}
              />
              <button onClick={vm.asmWorkersInc} aria-label="More workers" style={css(STEPPER_BTN)}>
                +
              </button>
            </div>
          </>
        )}

        {asm.isGps && (
          <>
            <div
              style={css(
                'position:relative; height:280px; border-radius:16px; overflow:hidden; background:linear-gradient(135deg,#dce8d5,#c3dbe8); border:1px solid #dde2f0;',
              )}
            >
              <div
                style={css(
                  'position:absolute; inset:0; background-image:linear-gradient(rgba(120,150,120,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(120,150,120,.22) 1px,transparent 1px); background-size:30px 30px;',
                )}
              />
              {asm.gpsLocked ? (
                <>
                  <div
                    style={css('position:absolute; top:50%; left:50%; transform:translate(-50%,-100%);')}
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="#16a34a"
                      stroke="#fff"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" fill="#fff" />
                    </svg>
                  </div>
                  <div
                    style={css(
                      'position:absolute; left:14px; right:14px; bottom:14px; background:#fff; border-radius:12px; padding:13px 15px; box-shadow:0 4px 14px rgba(0,0,0,.14);',
                    )}
                  >
                    <div style={css('font-size:13px; font-weight:800; color:#141a2e;')}>
                      Coordinates captured
                    </div>
                    <div style={css('font-size:12px; color:#6b7290; margin-top:2px;')}>
                      {asm.coords} · accuracy ±4 m
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={css(
                    'position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:#5b7466;',
                  )}
                >
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={css('font-size:14px; font-weight:800;')}>
                    Capture your site location
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={vm.asmGpsToggle}
              style={css(
                'width:100%; height:50px; margin-top:16px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:14.5px; font-weight:800; cursor:pointer;',
              )}
            >
              {asm.gpsCta}
            </button>
            <div style={css('font-size:12.5px; color:#8b95b4; margin-top:12px; line-height:1.55;')}>
              GPS validation ties your lots to a verified location — it is what lets buyers trust the origin of your minerals.
            </div>
          </>
        )}

        {asm.isDocs && (
          <div style={css('display:flex; flex-direction:column; gap:12px;')}>
            {vm.asmDocs.map((d) => (
              <button key={d.k} onClick={d.upload} style={css(d.rowStyle)}>
                <span
                  style={css(
                    'width:42px; height:42px; border-radius:12px; background:' +
                      d.bg +
                      '; color:' +
                      d.color +
                      '; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  {d.done ? (
                    <Tick size={19} width={3} />
                  ) : (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                </span>
                <span style={css('flex:1; min-width:0; text-align:left;')}>
                  <span style={css('display:block; font-size:15px; font-weight:800; color:#141a2e;')}>
                    {d.label}
                  </span>
                  <span
                    style={css('display:block; font-size:12.5px; color:#6b7290; margin-top:2px;')}
                  >
                    {d.meta}
                  </span>
                </span>
                <span style={css(d.chip)}>{d.chipLabel}</span>
              </button>
            ))}
          </div>
        )}

        {asm.isDone && (
          <>
            <div style={css('text-align:center; padding:6px 0;')}>
              <div
                style={css(
                  'width:92px; height:92px; border-radius:46px; background:#dcf3e8; color:#16a34a; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;',
                )}
              >
                <Tick size={44} width={2.3} />
              </div>
              <div
                style={css("font-family:'Poppins'; font-size:23px; font-weight:800; color:#141a2e;")}
              >
                Site registration submitted
              </div>
              <div
                style={css(
                  'font-size:14.5px; color:#6b7290; margin-top:9px; line-height:1.6; max-width:460px; margin-left:auto; margin-right:auto;',
                )}
              >
                Our field team will contact you to schedule a site visit. Once verified, your lots carry the Mineral Bridge ASM badge.
              </div>
            </div>
            <div
              style={css(
                'background:#f9fafd; border:1px solid #eef1f8; border-radius:16px; padding:22px; margin-top:22px;',
              )}
            >
              <div
                style={css(
                  'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin-bottom:14px;',
                )}
              >
                REGISTRATION SUMMARY
              </div>
              {vm.asmSummary.map((s) => (
                <div
                  key={s.k}
                  style={css(
                    'display:flex; justify-content:space-between; gap:16px; padding:10px 0; border-bottom:1px solid #eef1f8;',
                  )}
                >
                  <span style={css('font-size:13.5px; color:#6b7290;')}>{s.k}</span>
                  <span
                    style={css('font-size:14px; font-weight:800; color:#141a2e; text-align:right;')}
                  >
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={css(
                'background:#fff; border:1px solid #e7eaf3; border-radius:14px; padding:16px 20px; margin-top:14px; display:flex; align-items:center; justify-content:space-between; gap:14px;',
              )}
            >
              <div>
                <div
                  style={css('font-size:11px; font-weight:800; letter-spacing:.5px; color:#8b95b4;')}
                >
                  REFERENCE
                </div>
                <div style={css('font-size:15px; font-weight:800; color:#141a2e; margin-top:2px;')}>
                  MB-ASM-20418
                </div>
              </div>
              <span
                style={css(
                  'font-size:11.5px; font-weight:800; color:#b45309; background:#fdecd6; padding:6px 13px; border-radius:9px; white-space:nowrap;',
                )}
              >
                SITE VISIT PENDING
              </span>
            </div>
          </>
        )}
      </div>

      <div style={css('display:flex; gap:12px; margin-top:24px;')}>
        {asm.canBack && (
          <button
            onClick={vm.asmBack}
            style={css(
              'height:54px; padding:0 24px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:15px; font-weight:800; cursor:pointer;',
            )}
          >
            Back
          </button>
        )}
        <div style={css('flex:1;')} />
        <button
          className="v2-btn"
          onClick={vm.asmNext}
          disabled={asm.ctaBlocked}
          style={css(asm.ctaStyle)}
        >
          {asm.ctaLabel}
        </button>
      </div>
    </div>
  );
}
