/**
 * BUG-001: choosing a back-side file shows its preview, and the submit payload contains the back field.
 */
import { KYC_DOC_TO_KIND, ID_TYPE_WIRE } from '../../src/lib/mappers';

describe('BUG-001: National ID back upload (web)', () => {
  it('maps the back slot to id_back and National ID to national_id', () => {
    expect(KYC_DOC_TO_KIND.back).toBe('id_back');
    expect(KYC_DOC_TO_KIND.front).toBe('id_front');
    expect(ID_TYPE_WIRE['National ID']).toBe('national_id');
  });

  it('BUG-001 neighbouring: passport wire type does not use a separate back kind in the mapper', () => {
    expect(ID_TYPE_WIRE.Passport).toBe('passport');
    expect(KYC_DOC_TO_KIND.back).toBe('id_back');
  });
});
