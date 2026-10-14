import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '../components/layout/Header';

export const metadata: Metadata = { title: 'Mineral Bridge', description: 'Mineral Bridge web app' };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><Header />{children}</body></html>;
}
