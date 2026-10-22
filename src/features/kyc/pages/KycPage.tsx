import { useEffect, useRef, useState } from 'react';
import { useKycViewModel } from '@/features/kyc/hooks/useKycViewModel';
import { Icon } from '@/components/common/Icon';
import { css } from '@/utils/css';

const chipBtn =
  'height:30px; padding:0 10px; border:none; border-radius:8px; background:rgba(255,255,255,.94); color:#1e2a5a; font-size:12px; font-weight:800; cursor:pointer;';

function DocumentCamera({
  label,
  stream,
  onCapture,
  onClose,
  mirror = false,
}: {
  label: string;
  stream: MediaStream;
  onCapture: (file: File) => void;
  onClose: () => void;
  mirror?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    void video.play().catch(() => undefined);
    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  const snap = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const safe = label.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'document';
      onCapture(new File([blob], `${safe}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.92);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mirror ? 'Take a live selfie' : `Take ${label} photo`}
      style={css(
        'position:fixed; inset:0; z-index:90; background:rgba(14,20,48,.72); display:flex; align-items:center; justify-content:center; padding:24px;',
      )}
    >
      <div
        style={css(
          'width:100%; max-width:520px; background:#141a2e; border-radius:20px; padding:16px; display:flex; flex-direction:column; gap:12px;',
        )}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => setReady(true)}
          style={css(
            'width:100%; max-height:420px; background:#000; border-radius:14px; object-fit:cover;' +
              (mirror ? ' transform:scaleX(-1);' : ''),
          )}
        />
        <div style={css('display:flex; gap:10px;')}>
          <button
            type="button"
            onClick={onClose}
            style={css(
              'flex:1; height:48px; border:1px solid rgba(255,255,255,.2); border-radius:12px; background:transparent; color:#fff; font-weight:800; cursor:pointer;',
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={snap}
            disabled={!ready}
            style={css(
              'flex:1; height:48px; border:none; border-radius:12px; background:#16a34a; color:#fff; font-weight:800; cursor:pointer;',
            )}
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}

const H1 =
  "font-family:'Poppins'; font-size:27px; font-weight:800; color:#141a2e; margin:0; letter-spacing:-.5px;";
const SUB = 'font-size:15px; color:#6b7290; margin:9px 0 24px;';

const Tick = ({ size = 12, stroke = '#fff', width = 3.4 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Identity verification: why, document type, capture, liveness, review, status. */
export function KycPage() {
  const vm = useKycViewModel();
  const { kyc } = vm;

  return (
    <div style={css('max-width:760px; margin:0 auto; padding:32px 32px 72px;')}>
      <div style={css('display:flex; align-items:center; gap:12px; margin-bottom:22px;')}>
        <button
          onClick={vm.kycBack}
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
                  kyc.progress +
                  '; height:100%; background:linear-gradient(90deg,#16a34a,#22c55e); transition:width .3s ease;',
              )}
            />
          </div>
        </div>
        <span
          style={css('font-size:12.5px; font-weight:800; color:#6b7290; white-space:nowrap;')}
        >
          {kyc.stepLabel}
        </span>
      </div>

      {kyc.feedback && (
        <div
          role="status"
          style={css(
            'background:#fff7ed; border:1px solid #fcd9a8; border-radius:16px; padding:16px 18px; margin-bottom:22px; text-align:left;',
          )}
        >
          <div style={css('font-size:15px; font-weight:800; color:#7c5010;')}>{kyc.feedback.title}</div>
          <p style={css('font-size:14px; color:#7c5010; margin:8px 0 0; line-height:1.55;')}>{kyc.feedback.reason}</p>
          <div style={css('display:flex; flex-direction:column; gap:10px; margin-top:14px;')}>
            {kyc.feedback.documents.map((doc) => (
              <div
                key={doc.key}
                style={css(
                  'display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #f3e2c4; border-radius:12px; padding:10px;',
                )}
              >
                {doc.previewUrl ? (
                  <img
                    src={doc.previewUrl}
                    alt={doc.name}
                    style={css('width:72px; height:52px; object-fit:cover; border-radius:8px; flex-shrink:0; background:#f4f5f9;')}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    style={css('width:72px; height:52px; border-radius:8px; flex-shrink:0; background:#f4f5f9;')}
                  />
                )}
                <span style={css('min-width:0; flex:1;')}>
                  <span style={css('display:block; font-size:13.5px; font-weight:800; color:#141a2e;')}>{doc.name}</span>
                  <span
                    style={css(
                      'display:inline-block; margin-top:4px; font-size:11px; font-weight:800; padding:3px 8px; border-radius:7px; ' +
                        (doc.rejected ? 'color:#b42318; background:#fdecec;' : 'color:#8a3f07; background:#fdecd6;'),
                    )}
                  >
                    {doc.statusLabel}
                  </span>
                  {doc.reason && (
                    <span style={css('display:block; margin-top:4px; font-size:12.5px; color:#7c5010; line-height:1.45;')}>
                      {doc.reason}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {kyc.isWhy && (
        <div className="v2-pr">
          <div
            style={css(
              'width:76px; height:76px; border-radius:22px; background:linear-gradient(135deg,#1e2a5a,#3a4b7a); display:flex; align-items:center; justify-content:center; color:#f7dd8e;',
            )}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:29px; font-weight:800; color:#141a2e; margin:22px 0 0; letter-spacing:-.6px;",
            )}
          >
            Why we verify your identity
          </h1>
          <p style={css('font-size:15.5px; color:#6b7290; margin:11px 0 0; line-height:1.65;')}>
            Minerals are a regulated commodity. Verification protects honest sellers from fraud and lets us settle payments legally, anywhere in the world.
          </p>
          <div style={css('display:flex; flex-direction:column; gap:12px; margin-top:26px;')}>
            {vm.kycWhy.map((w) => (
              <div
                key={w.title}
                style={css(
                  'display:flex; align-items:flex-start; gap:14px; background:#fff; border:1px solid #e7eaf3; border-radius:16px; padding:18px 20px;',
                )}
              >
                <span
                  style={css(
                    'width:40px; height:40px; border-radius:12px; background:' +
                      w.bg +
                      '; color:' +
                      w.color +
                      '; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <Icon name={w.ic} size={20} />
                </span>
                <div>
                  <div style={css('font-size:15px; font-weight:800; color:#141a2e;')}>
                    {w.title}
                  </div>
                  <div
                    style={css('font-size:13.5px; color:#6b7290; margin-top:3px; line-height:1.55;')}
                  >
                    {w.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={css(
              'display:flex; align-items:center; gap:11px; background:#eff4ff; border:1px solid #dbe4ff; border-radius:14px; padding:16px 18px; margin-top:18px;',
            )}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={css('flex-shrink:0;')}
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div style={css('font-size:13px; color:#1e3a6a; line-height:1.55;')}>
              Your documents are encrypted and never shared with counterparties. Only your verified status is visible.
            </div>
          </div>
        </div>
      )}

      {kyc.isType && (
        <div className="v2-pr">
          <h1 style={css(H1)}>Choose your ID document</h1>
          <p style={css(SUB)}>Pick a government-issued document. Make sure it hasn&apos;t expired.</p>
          <div style={css('display:flex; flex-direction:column; gap:12px;')}>
            {vm.kycIdTypes.map((t) => (
              <button key={t.k} onClick={t.select} aria-pressed={t.on} style={css(t.style)}>
                <span
                  style={css(
                    'width:46px; height:46px; border-radius:13px; background:' +
                      t.bg +
                      '; color:' +
                      t.color +
                      '; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <Icon name={t.ic} size={22} />
                </span>
                <span style={css('flex:1; min-width:0; text-align:left;')}>
                  <span style={css('display:block; font-size:16px; font-weight:800; color:#141a2e;')}>
                    {t.label}
                  </span>
                  <span style={css('display:block; font-size:13px; color:#6b7290; margin-top:2px;')}>
                    {t.sub}
                  </span>
                </span>
                <span style={css(t.radio)}>{t.on && <Tick width={3.6} />}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {kyc.isCapture && (
        <div className="v2-pr">
          <h1 style={css(H1)}>Upload your {kyc.idLabel}</h1>
          <p style={css(SUB)}>{kyc.captureHint}</p>
          <div
            className="v2-g2"
            style={css('display:grid; grid-template-columns:1fr 1fr; gap:16px;')}
          >
            {vm.kycSides.map((s) => (
              <div key={s.label}>
              <div role="group" aria-label={s.label} style={css(s.boxStyle)}>
                {s.previewUrl ? (
                  <img
                    src={s.previewUrl}
                    alt={`${s.label} of your document`}
                    style={css('position:absolute; inset:0; width:100%; height:100%; object-fit:cover;')}
                  />
                ) : s.done ? (
                  <span
                    style={css(
                      'position:absolute; inset:0; background:' + s.grad + '; border-radius:15px;',
                    )}
                  />
                ) : (
                  <span
                    style={css(
                      'display:flex; flex-direction:column; align-items:center; gap:10px; color:#8b95b4; padding-bottom:36px;',
                    )}
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span style={css('font-size:14.5px; font-weight:800; color:#1e2a5a;')}>
                      {s.label}
                    </span>
                  </span>
                )}
                {s.done && (
                  <span
                    style={css(
                      'position:absolute; top:12px; right:12px; width:30px; height:30px; border-radius:15px; background:#16a34a; display:flex; align-items:center; justify-content:center; color:#fff;',
                    )}
                  >
                    <Tick size={16} stroke="currentColor" width={3.2} />
                  </span>
                )}
                {(s.previewUrl || s.done) && (
                  <span
                    style={css(
                      'position:absolute; left:0; right:0; bottom:46px; font-size:13.5px; font-weight:800; color:#fff; text-align:center; text-shadow:0 1px 4px rgba(0,0,0,.45);',
                    )}
                  >
                    {s.uploading ? 'Uploading…' : s.done ? `${s.label} captured` : 'Not uploaded'}
                  </span>
                )}
                <span
                  style={css(
                    'position:absolute; left:8px; right:8px; bottom:10px; display:flex; justify-content:center; gap:8px; z-index:1;',
                  )}
                >
                  <button
                    type="button"
                    aria-label={`Take ${s.label} photo`}
                    onClick={() => vm.openCamera(s.label)}
                    style={css(chipBtn)}
                  >
                    Take photo
                  </button>
                  <label htmlFor={`kyc-gallery-${s.label}`} style={css(chipBtn + ' display:inline-flex; align-items:center;')}>
                    Choose from gallery
                  </label>
                </span>
                <input
                  id={`kyc-gallery-${s.label}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  aria-label={`Choose ${s.label} photo from gallery`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    if (file) void vm.acceptDocument(s.label, file);
                  }}
                  style={css(
                    'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;',
                  )}
                />
              </div>
              {s.feedback && (
                <div style={css('margin-top:8px; font-size:12.5px; line-height:1.45; color:' + (s.feedback.rejected ? '#b42318' : '#5b638a') + ';')}>
                  <strong>{s.feedback.statusLabel}.</strong>
                  {s.feedback.reason ? ` ${s.feedback.reason}` : ''}
                </div>
              )}
              </div>
            ))}
          </div>
          <div style={css('display:flex; flex-direction:column; gap:9px; margin-top:20px;')}>
            {vm.kycTips.map((tp) => (
              <span
                key={tp.v}
                style={css(
                  'display:flex; align-items:center; gap:10px; font-size:13.5px; color:#6b7290;',
                )}
              >
                <span
                  style={css(
                    'width:20px; height:20px; border-radius:10px; background:#dcf3e8; color:#16a34a; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                  )}
                >
                  <Tick size={11} stroke="currentColor" />
                </span>
                {tp.v}
              </span>
            ))}
          </div>
        </div>
      )}

      {kyc.isLive && (
        <div className="v2-pr">
          <h1 style={css(H1)}>Liveness check</h1>
          <p style={css(SUB)}>
            A quick selfie confirms you match your document. Nothing is stored beyond verification.
          </p>
          <div
            style={css(
              'position:relative; height:340px; border-radius:20px; background:linear-gradient(160deg,#1b2237,#0e1430); overflow:hidden; display:flex; align-items:center; justify-content:center;',
            )}
          >
            <div
              style={css(
                'position:relative; width:210px; height:270px; border-radius:105px/135px; border:3px dashed rgba(247,221,142,.6); display:flex; align-items:center; justify-content:center; overflow:hidden;',
              )}
            >
              {vm.selfiePreview ? (
                <img
                  src={vm.selfiePreview}
                  alt="Your selfie"
                  style={css('position:absolute; inset:0; width:100%; height:100%; object-fit:cover;')}
                />
              ) : kyc.selfieDone ? (
                <>
                  <span
                    style={css(
                      'position:absolute; inset:0; background:linear-gradient(150deg,#f0a04b,#c8962f);',
                    )}
                  />
                  <span
                    style={css(
                      "position:relative; color:#fff; font-family:'Poppins'; font-size:44px; font-weight:800;",
                    )}
                  >
                    {kyc.selfieInitials}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(247,221,142,.55)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span
                    className="v2-scan"
                    style={css(
                      'position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#f7dd8e,transparent);',
                    )}
                  />
                </>
              )}
            </div>
            <div
              style={css(
                'position:absolute; left:0; right:0; bottom:18px; text-align:center; font-size:13px; font-weight:700; color:rgba(255,255,255,.7);',
              )}
            >
              {vm.selfieUploading ? 'Checking liveness…' : kyc.livenessHint}
            </div>
          </div>
          <button
            type="button"
            onClick={vm.startSelfie}
            disabled={vm.selfieUploading}
            style={css(
              'width:100%; height:50px; margin-top:18px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:14.5px; font-weight:800; cursor:pointer;',
            )}
          >
            {kyc.selfieCta}
          </button>
        </div>
      )}

      {kyc.isReview && (
        <div className="v2-pr">
          <h1 style={css(H1)}>Review and submit</h1>
          <p style={css(SUB)}>Check everything is correct before we send it to compliance.</p>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; overflow:hidden; box-shadow:0 3px 12px rgba(20,26,46,.05);',
            )}
          >
            {vm.kycReview.map((r) => (
              <div
                key={r.k}
                style={css(
                  'display:flex; align-items:center; gap:16px; padding:16px 20px; border-bottom:1px solid #f2f4fa;',
                )}
              >
                <span style={css('flex:1; font-size:13.5px; color:#6b7290;')}>{r.k}</span>
                <span style={css('font-size:14px; font-weight:800; color:#141a2e;')}>{r.v}</span>
                {r.ok && (
                  <span
                    style={css(
                      'width:22px; height:22px; border-radius:11px; background:#dcf3e8; color:#16a34a; display:flex; align-items:center; justify-content:center; flex-shrink:0;',
                    )}
                  >
                    <Tick stroke="currentColor" />
                  </span>
                )}
              </div>
            ))}
          </div>
          <label
            style={css(
              'display:flex; align-items:flex-start; gap:12px; margin-top:18px; cursor:pointer;',
            )}
          >
            <span
              style={css(
                'width:21px; height:21px; border-radius:6px; background:#1e2a5a; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;',
              )}
            >
              <Tick size={13} stroke="currentColor" width={3} />
            </span>
            <span style={css('font-size:13px; color:#5b638a; line-height:1.55;')}>
              I confirm these documents are mine and the information is accurate.
            </span>
          </label>
        </div>
      )}

      {kyc.isPending && (
        <div className="v2-pr" style={css('text-align:center; padding-top:12px;')}>
          <div style={css('position:relative; width:110px; height:110px; margin:0 auto;')}>
            <span className="v2-glow" style={css(kyc.statusGlow)} />
            <span style={css(kyc.statusIcon)}>
              {kyc.isApproved ? (
                <Tick size={50} stroke="currentColor" width={2.2} />
              ) : (
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
              )}
            </span>
          </div>
          <h1
            style={css(
              "font-family:'Poppins'; font-size:28px; font-weight:800; color:#141a2e; margin:24px 0 0; letter-spacing:-.5px;",
            )}
          >
            {kyc.pendingTitle}
          </h1>
          <p
            style={css(
              'font-size:15.5px; color:#6b7290; margin:11px auto 0; line-height:1.65; max-width:460px;',
            )}
          >
            {kyc.pendingBody}
          </p>
          <div
            style={css(
              'background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:22px; margin-top:26px; text-align:left;',
            )}
          >
            <div
              style={css(
                'font-size:12px; font-weight:800; letter-spacing:1px; color:#8b95b4; margin-bottom:14px;',
              )}
            >
              WHAT HAPPENS NEXT
            </div>
            {vm.kycNext.map((n) => (
              <div key={n.title} style={css('display:flex; gap:14px; padding:10px 0;')}>
                <span style={css(n.dot)}>{n.done && <Tick />}</span>
                <div>
                  <div style={css('font-size:14.5px; font-weight:800; color:' + n.color + ';')}>
                    {n.title}
                  </div>
                  <div style={css('font-size:13px; color:#6b7290; margin-top:2px;')}>{n.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={css(
              'background:#f4f5f9; border:1px solid #e7eaf3; border-radius:14px; padding:16px 18px; margin-top:14px; display:flex; align-items:center; justify-content:space-between; gap:14px; text-align:left;',
            )}
          >
            <div>
              <div
                style={css('font-size:11px; font-weight:800; letter-spacing:.5px; color:#8b95b4;')}
              >
                REFERENCE
              </div>
              <div style={css('font-size:15px; font-weight:800; color:#141a2e; margin-top:2px;')}>
                {kyc.reference}
              </div>
            </div>
            <span style={css(kyc.refChip)}>{kyc.refLabel}</span>
          </div>
          {kyc.notApproved && kyc.showDemoApprove && (
            <button
              onClick={vm.kycApprove}
              style={css(
                'width:100%; height:46px; margin-top:12px; border:1px dashed #cdd4e6; border-radius:12px; background:#fff; color:#8b95b4; font-size:13px; font-weight:800; cursor:pointer;',
              )}
            >
              Demo: simulate compliance approval
            </button>
          )}
        </div>
      )}

      <div style={css('display:flex; gap:12px; margin-top:26px;')}>
        {kyc.showSkip && (
          <button
            onClick={vm.kycSkip}
            style={css(
              'height:54px; padding:0 24px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#6b7290; font-size:14.5px; font-weight:800; cursor:pointer;',
            )}
          >
            {kyc.skipLabel}
          </button>
        )}
        <div style={css('flex:1;')} />
        <button
          className="v2-btn"
          onClick={vm.kycNextStage}
          disabled={kyc.ctaBlocked}
          style={css(kyc.ctaStyle)}
        >
          {kyc.ctaLabel}
        </button>
      </div>
      {vm.camera && (
        <DocumentCamera
          label={vm.camera.label}
          stream={vm.camera.stream}
          mirror={vm.camera.mode === 'selfie'}
          onClose={vm.closeCamera}
          onCapture={(file) => {
            const session = vm.camera;
            vm.closeCamera();
            if (!session) return;
            if (session.mode === 'selfie') void vm.acceptSelfie(file);
            else void vm.acceptDocument(session.label, file);
          }}
        />
      )}
    </div>
  );
}
