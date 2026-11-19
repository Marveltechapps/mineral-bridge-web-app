// The starter's legacy `/api` fetch helper is replaced by the typed `/v2` client (same base URL as the platform:
// NEXT_PUBLIC_API_BASE_URL). Kept as a re-export so older imports keep working.
export { apiRequest, api } from '../api/client';
