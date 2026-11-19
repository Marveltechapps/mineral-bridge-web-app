'use client';

import { useEffect, useState } from 'react';
import { getSamples } from '../services/sampleService';
import type { SampleItem } from '../types/sample';

export function useSamples() {
  const [items, setItems] = useState<SampleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getSamples(controller.signal).then(setItems).catch(() => {
      if (!controller.signal.aborted) setError('Could not load catalogue items. Check that the /v2 API (NEXT_PUBLIC_API_BASE_URL) is running.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  return { items, loading, error };
}
