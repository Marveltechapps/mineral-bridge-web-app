/** True when this build was given a customer API origin. An empty value keeps the design demo. */
export function isApiConfigured(): boolean {
  return Boolean((import.meta.env.VITE_API_BASE_URL ?? '').trim());
}
