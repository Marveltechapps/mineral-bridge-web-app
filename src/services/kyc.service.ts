import { api } from '../api';
import type {
  Kyc,
  KycDocKindWire,
  KycDocumentPutResult,
  KycPatchBody,
  KycSubmitResult,
} from '../api';

/** GET /kyc. */
export const getKyc = (signal?: AbortSignal): Promise<Kyc> => api.get<Kyc>('/kyc', { signal });

/** PATCH /kyc - choose `idType` and/or record `consent`. Returns the refreshed KYC view. */
export const patchKyc = (body: KycPatchBody): Promise<Kyc> => api.patch<Kyc>('/kyc', body);

/**
 * PUT /kyc/documents/:kind - attach a previously uploaded file (`uploadFile(uri, 'kyc')` -> `fileId`).
 * `kind` must be one of `Kyc.requiredKinds` or the backend answers 422 `kyc/kind-not-required`.
 */
export const putDocument = (kind: KycDocKindWire, fileId: string): Promise<KycDocumentPutResult> =>
  api.put<KycDocumentPutResult>(`/kyc/documents/${kind}`, { fileId });

/** DELETE /kyc/documents/:kind (204). */
export const deleteDocument = (kind: KycDocKindWire): Promise<void> => api.delete<void>(`/kyc/documents/${kind}`);

/** POST /kyc/submit (202). Consent must be true. */
export const submitKyc = (): Promise<KycSubmitResult> => api.post<KycSubmitResult>('/kyc/submit', { consent: true });
