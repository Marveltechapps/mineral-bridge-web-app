import Link from 'next/link';

export function Header() {
  return <header><Link href="/">Mineral Bridge</Link> · <Link href="/samples">Samples</Link> · <Link href="/app">Web app</Link></header>;
}
