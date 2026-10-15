import { useEffect } from 'react';
import { useUiState } from '@/hooks/useAppState';
import { css } from '@/utils/css';

/** Centred confirmation sheet used for every prompt and acknowledgement. */
export function Modal() {
  const { modal, setState } = useUiState();

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setState({ modal: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, setState]);

  if (!modal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={modal.title}
      style={css(
        'position:fixed; inset:0; z-index:100; background:rgba(20,26,46,.6); display:flex; align-items:center; justify-content:center; padding:24px;',
      )}
    >
      <div
        style={css(
          'background:#fff; border-radius:22px; padding:34px; width:100%; max-width:420px; text-align:center; box-shadow:0 28px 70px rgba(0,0,0,.34);',
        )}
      >
        <div
          style={css("font-family:'Poppins'; font-size:21px; font-weight:800; color:#141a2e;")}
        >
          {modal.title}
        </div>
        <div
          style={css('font-size:14.5px; color:#6b7290; margin-top:10px; line-height:1.55;')}
        >
          {modal.body}
        </div>
        <div
          style={css('display:flex; flex-direction:column; gap:11px; margin-top:24px;')}
        >
          <button
            className="v2-btn"
            onClick={modal.confirm}
            style={css(
              'width:100%; height:52px; border:none; border-radius:13px; background:#1e2a5a; color:#fff; font-size:15.5px; font-weight:800; cursor:pointer;',
            )}
          >
            {modal.confirmLabel}
          </button>
          {modal.hasSecondary && (
            <button
              onClick={modal.secondary}
              style={css(
                'width:100%; height:52px; border:1px solid #d5dbef; border-radius:13px; background:#fff; color:#1e2a5a; font-size:15.5px; font-weight:800; cursor:pointer;',
              )}
            >
              {modal.secondaryLabel}
            </button>
          )}
          <button
            onClick={() => setState({ modal: null })}
            style={css(
              'width:100%; height:42px; border:none; background:none; color:#6b7290; font-size:14.5px; font-weight:700; cursor:pointer;',
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
