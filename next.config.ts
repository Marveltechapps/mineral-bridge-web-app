import type { NextConfig } from 'next';

// Optional same-origin proxy for the /v2 API (set API_PROXY_TARGET and NEXT_PUBLIC_API_BASE_URL=/v2). Useful when the
// web app and API are not same-site, because the SameSite=Strict `mb_refresh` cookie then still reaches the API.
// Next.js rewrites do not proxy WebSockets; live auctions keep using NEXT_PUBLIC_WS_BASE_URL.
const proxyTarget = (process.env.API_PROXY_TARGET || '').replace(/\/+$/, '');

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Marks this checkout as the security-agent upgrade path (Next.js 16.4.6).
    agentUpgrade: 'security',
  },
  async redirects() {
    // BUG-007: never expose the starter scaffold; platform lives at /app.
    return [
      { source: '/', destination: '/app', permanent: false },
      { source: '/samples', destination: '/app', permanent: false },
      { source: '/samples/:path*', destination: '/app', permanent: false },
    ];
  },
  async rewrites() {
    return proxyTarget ? [{ source: '/v2/:path*', destination: `${proxyTarget}/v2/:path*` }] : [];
  },
};
export default nextConfig;
