import { apiRequest } from './api';
import type { SampleItem } from '../types/sample';

export function getSamples(signal?: AbortSignal): Promise<SampleItem[]> {
  return apiRequest<SampleItem[]>('/samples', { signal });
}
