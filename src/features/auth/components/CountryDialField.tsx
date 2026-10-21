import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/utils/css';
import {
  findDialCountry,
  searchCountries,
  type DialCountry,
  type DialCountryCode,
} from '@/features/auth/phone';

interface CountryDialFieldProps {
  country: DialCountryCode;
  onChange: (country: DialCountryCode) => void;
  height?: number;
}

/** Calling-code button that opens a searchable country list. */
export function CountryDialField({ country, onChange, height = 52 }: CountryDialFieldProps) {
  const selected = findDialCountry(country) ?? findDialCountry('ZA')!;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [box, setBox] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const results = useMemo(() => searchCountries(query), [query]);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const frame = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const spaceBelow = window.innerHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;
      const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(160, Math.min(320, openUp ? spaceAbove : spaceBelow));
      setBox({
        top: openUp ? Math.max(8, rect.top - maxHeight - 6) : rect.bottom + 6,
        left: Math.min(rect.left, window.innerWidth - 328),
        width: 320,
        maxHeight,
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    if (typeof node?.scrollIntoView === 'function') node.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  const choose = (iso: DialCountryCode) => {
    onChange(iso);
    setOpen(false);
    setQuery('');
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      choose(results[active].iso);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${selected.name}, +${selected.dial}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        style={css(
          `display:flex; align-items:center; gap:6px; padding:0 14px; height:${height}px; border:1px solid #dde2f0; border-radius:13px; background:#f9fafd; font-size:14.5px; font-weight:700; color:#141a2e; cursor:pointer; flex-shrink:0;`,
        )}
      >
        <span aria-hidden="true">{selected.flag}</span>
        <span>+{selected.dial}</span>
        <span aria-hidden="true" style={css('font-size:11px; color:#6b7290;')}>
          ▾
        </span>
      </button>
      {open && box
        ? createPortal(
            <div
              ref={listRef}
              style={css(
                `position:fixed; z-index:400; top:${box.top}px; left:${Math.max(8, box.left)}px; width:${box.width}px; max-width:calc(100vw - 16px); background:#fff; border:1px solid #dde2f0; border-radius:14px; box-shadow:0 18px 50px rgba(16,22,48,.18); overflow:hidden;`,
              )}
            >
              <div style={css('padding:10px;')}>
                <input
                  ref={searchRef}
                  role="searchbox"
                  aria-label="Search countries"
                  aria-controls={listId}
                  placeholder="Search country, code, or +dial"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKeyDown}
                  style={css(
                    'width:100%; height:40px; border:1px solid #dde2f0; border-radius:10px; padding:0 12px; font-size:14px; color:#141a2e; outline:none;',
                  )}
                />
              </div>
              <div
                id={listId}
                role="listbox"
                aria-label="Countries"
                onKeyDown={onKeyDown}
                style={css(`max-height:${Math.max(120, box.maxHeight - 64)}px; overflow:auto;`)}
              >
                {results.length === 0 ? (
                  <p style={css('margin:0; padding:12px 14px 16px; color:#6b7290; font-size:13.5px;')}>
                    No matching country.
                  </p>
                ) : (
                  results.map((item, index) => (
                    <CountryOption
                      key={item.iso}
                      item={item}
                      active={index === active}
                      selected={item.iso === selected.iso}
                      onChoose={() => choose(item.iso)}
                      onHover={() => setActive(index)}
                    />
                  ))
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function CountryOption({
  item,
  active,
  selected,
  onChoose,
  onHover,
}: {
  item: DialCountry;
  active: boolean;
  selected: boolean;
  onChoose: () => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      data-active={active ? 'true' : 'false'}
      onMouseEnter={onHover}
      onClick={onChoose}
      style={css(
        `width:100%; display:flex; align-items:center; gap:10px; padding:9px 14px; border:none; background:${active || selected ? '#f2f4fa' : '#fff'}; cursor:pointer; text-align:left; font-size:14px; color:#141a2e;`,
      )}
    >
      <span aria-hidden="true" style={css('width:22px; flex-shrink:0;')}>
        {item.flag}
      </span>
      <span style={css('flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;')}>
        {item.name}
      </span>
      <span style={css('color:#5b638a; font-weight:700; flex-shrink:0;')}>+{item.dial}</span>
    </button>
  );
}
