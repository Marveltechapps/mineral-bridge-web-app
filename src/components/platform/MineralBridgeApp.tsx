'use client';

import { usePlatform } from '../../hooks/usePlatform';
import { AppShell } from './AppShell';

export function MineralBridgeApp() {
  const { ready, vm } = usePlatform();
  // Session and data are loaded from the /v2 API after the first client render; show the app background until then.
  if (!ready) return <div style={{ minHeight: '100vh', background: '#F8FAFC' }} />;
  return <AppShell vm={vm} />;
}
