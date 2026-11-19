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
        <div style={{ padding: '16px', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', fontSize: '14px', color: '#6B6A70' }}>
          There is no price update waiting for your answer.
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '22px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
          {"PROPOSED TOTAL · "}{vm.ov?.id}
        </div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '30px', fontWeight: '600', marginTop: '8px', color: '#D9B456' }}>
          {pv.to}
        </div>
        <div style={{ fontSize: '12.5px', color: '#C9C7C0', marginTop: '6px' }}>
          {"Previously "}{pv.from}{" · "}{pv.delta}
        </div>
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '16px', marginTop: '12px' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
          REASON
        </div>
        <div style={{ fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>
          {pv.reason}
        </div>
        {pv.note ? (
          <div style={{ fontSize: '13px', color: '#6B6A70', marginTop: '8px', lineHeight: '1.5' }}>
            {pv.note}
          </div>
        ) : null}
      </div>
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '16px 4px 6px' }}>
        YOUR NOTE (OPTIONAL)
      </label>
      <textarea className="authIn" aria-label="Note to Mineral Bridge" value={pv.noteVal} onChange={pv.setNote} rows={3} maxLength={500} placeholder="Add a note for Mineral Bridge" style={{ width: '100%', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px 14px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }} />
      {pv.err ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {pv.err}
        </div>
      ) : null}
    </div>
  );
}
