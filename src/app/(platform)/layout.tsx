import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './platform.css';

export const metadata: Metadata = { title: 'Mineral Bridge', description: 'Buy and sell minerals, verified at every step.' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// Root layout for the trading platform. It is separate from the starter layout so the
// platform's own type, colours and full-height shell apply without the starter Header.
export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* The design sets the Inter family in inline styles, so the stylesheet is loaded as-is. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
