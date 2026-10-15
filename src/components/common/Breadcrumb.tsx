import { useActions } from '@/hooks/useActions';
import { css } from '@/utils/css';

/** "Home / <current>" trail used at the top of the inner screens. */
export function Breadcrumb({ current }: { current: string }) {
  const h = useActions();

  return (
    <nav
      aria-label="Breadcrumb"
      style={css(
        'display:flex; align-items:center; gap:8px; font-size:13px; color:#5b638a; margin-bottom:18px;',
      )}
    >
      <button
        onClick={h.goHome}
        style={css(
          'background:none; border:none; padding:0; font-size:13px; color:#5b638a; cursor:pointer;',
        )}
      >
        Home
      </button>
      <span>/</span>
      <span style={css('color:#141a2e; font-weight:700;')}>{current}</span>
    </nav>
  );
}
