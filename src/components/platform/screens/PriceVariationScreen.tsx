import type { ViewModel } from '../../../types/platform';

/** Price update from Mineral Bridge on a sell order: the seller accepts or rejects the new total. */
export function PriceVariationScreen({ vm }: { vm: ViewModel }) {
  const pv = vm.pv as {
    from: string; to: string; delta: string; up: boolean; reason: string; note: string;
    busy: boolean; err: string; noteVal: string; setNote: (e: unknown) => void; accept: () => void; reject: () => void;
  } | null;
  if (!pv) {
    return (
      <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ padding: '16px', borderRadius: '18px', background: '#fff', border: '1px solid #E2E8F0', fontSize: '14px', color: '#5B6B82' }}>
          There is no price update waiting for your answer.
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
          {"PROPOSED TOTAL · "}{vm.ov?.id}
        </div>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '30px', marginTop: '8px', color: '#F2C94C' }}>
          {pv.to}
        </div>
        <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '6px' }}>
          {"Previously "}{pv.from}{" · "}{pv.delta}
        </div>
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '16px', marginTop: '12px' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
          REASON
        </div>
        <div style={{ fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>
          {pv.reason}
        </div>
        {pv.note ? (
          <div style={{ fontSize: '13px', color: '#5B6B82', marginTop: '8px', lineHeight: '1.5' }}>
            {pv.note}
          </div>
        ) : null}
      </div>
      <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '16px 4px 6px' }}>
        YOUR NOTE (OPTIONAL)
      </label>
      <textarea className="authIn" aria-label="Note to Mineral Bridge" value={pv.noteVal} onChange={pv.setNote} rows={3} maxLength={500} placeholder="Add a note for Mineral Bridge" style={{ width: '100%', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px 14px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }} />
      {pv.err ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {pv.err}
        </div>
      ) : null}
    </div>
  );
}
