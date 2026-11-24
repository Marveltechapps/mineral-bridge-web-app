import Link from 'next/link';

/** Real nav labels only — no Samples / project-structure links (BUG-007). */
export const REAL_NAV_LABELS = ['Mineral Bridge'] as const;

export function Header() {
  return (
    <header>
      <Link href="/">Mineral Bridge</Link>
    </header>
  );
}
