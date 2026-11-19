import { api } from '../api';

/** GET /documents/:number (JSON render of an issued document: quotation, invoice, report, ...). */
export const getDocument = (number: string, signal?: AbortSignal): Promise<Record<string, unknown>> =>
  api.get<Record<string, unknown>>(`/documents/${encodeURIComponent(number)}`, { query: { format: 'json' }, signal });

/**
 * GET /documents/:number?format=pdf - returns the raw `Response` (read `.blob()` / `.arrayBuffer()`).
 * Prefer `getFileUrl`-style signed URLs when the backend provides `pdfUrl`.
 */
export const downloadDocumentPdf = (number: string, signal?: AbortSignal): Promise<Response> =>
  api.get<Response>(`/documents/${encodeURIComponent(number)}`, { query: { format: 'pdf' }, raw: true, signal });
