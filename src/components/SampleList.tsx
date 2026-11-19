'use client';

import { useSamples } from '../hooks/useSamples';
import { SampleCard } from './ui/SampleCard';

export function SampleList() {
  const { items, loading, error } = useSamples();
  if (loading) return <p role="status">Loading samples…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!items.length) return <p>No sample items.</p>;
  return <section aria-label="Sample items">{items.map(item => <SampleCard key={item.id} item={item} />)}</section>;
}
