const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333/api';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, init);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
