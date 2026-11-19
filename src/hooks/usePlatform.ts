'use client';

import { useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { PlatformController } from '../lib/platform/controller';
import type { ViewModel } from '../types/platform';

const serverVersion = () => 0;

/**
 * Client state for the Mineral Bridge platform screens. Product data comes from the /v2 API; only
 * UI preferences (list view, collapsed nav) and a session hint are kept in the browser.
 */
export function usePlatform(): { ready: boolean; vm: ViewModel } {
  const [controller] = useState(() => new PlatformController());
  // Subscribe so the view re-renders on every controller change.
  useSyncExternalStore(controller.subscribe, controller.getVersion, serverVersion);
  // Boot before the first paint so the first paint is already in a booting state.
  useLayoutEffect(() => {
    controller.start();
    return () => controller.stop();
  }, [controller]);
  return { ready: !!controller.state.ready && !controller.state.booting, vm: controller.renderVals() };
}
