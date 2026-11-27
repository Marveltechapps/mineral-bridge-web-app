// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function PaymentScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ position: 'relative', overflow: 'hidden', padding: '18px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
      {vm.aj?.on ? (
        <section aria-label="Auction journey" style={{ marginBottom: '16px', borderRadius: '18px', background: '#1F2A44', color: '#fff', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#F2C94C' }}>
              {"AUCTION JOURNEY · "}{vm.aj?.ref}
            </span>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
              {vm.aj?.note}
            </span>
          </div>
          <div className="hs" style={{ display: 'flex', overflowX: 'auto', marginTop: '12px', scrollbarWidth: 'none' }}>
            {list(vm.aj?.steps).map((t, index) => (
              <div key={index} style={{ flex: '1 0 84px', minWidth: '84px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '12px', left: 'calc(50% + 14px)', right: 'calc(-50% + 14px)', height: '2px', background: str(t?.line) }} />
                <span style={{ width: '26px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', background: str(t?.dotBg), color: str(t?.dotFg), border: `2px solid ${t?.dotBd ?? ''}`, position: 'relative', zIndex: '1' }}>
                  <Val v={t?.n} />
                </span>
                <span style={{ fontSize: '11px', fontWeight: str(t?.fw), color: str(t?.fg), textAlign: 'center', lineHeight: '1.25' }}>
                  {t?.l}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
        <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '90px', right: '-60px', top: '-80px', background: 'radial-gradient(circle, rgba(242,201,76,.35), rgba(242,201,76,0) 70%)', animation: 'drift1 10s ease-in-out infinite' }} />
        <div style={{ position: 'relative', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
          {"AMOUNT DUE · "}{vm.payRef}
        </div>
        <div style={{ position: 'relative', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '30px', marginTop: '8px', color: '#F2C94C' }}>
          {vm.payAmount}
        </div>
        <div style={{ position: 'relative', fontSize: '12.5px', color: '#CBD5E1', marginTop: '6px' }}>
          Pay in full to release the order for dispatch
        </div>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        PAY WITH
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list(vm.quickPays).map((q, index) => (
          <div key={index} className="mb-press-3" onClick={q?.tap} role="radio" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', borderRadius: '18px', background: '#fff', transition: 'border-color .2s, box-shadow .2s', border: `1.5px solid ${q?.border ?? ''}`, boxShadow: str(q?.sh) }}>
            <span style={{ width: '38px', height: '38px', flex: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', background: str(q?.iconBg) }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={q?.iconFg} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d={q?.icon} />
              </svg>
            </span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
                {q?.label}
              </div>
              <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '2px' }}>
                {q?.sub}
              </div>
            </div>
            <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '11px', transition: 'border .2s', border: str(q?.radio) }} />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        {vm.payHead}
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        {list(vm.payBank).map((r, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
            <span style={{ color: '#5B6B82' }}>
              {r?.k}
            </span>
            <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
              {r?.v}
            </span>
          </div>
        ))}
      </div>
      {vm.isBtc ? (
        <>
          <div style={{ marginTop: '12px', padding: '16px', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
                SEND EXACTLY
              </div>
              {vm.hasBtcQuote ? (
                <>
                  <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '19px', color: '#8A6508', marginTop: '4px' }}>
                    {vm.btcAmt}{" BTC"}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', color: vm.btcExpired ? '#B42318' : '#5B6B82' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '4px', background: vm.btcExpired ? '#B42318' : '#F2C94C', animation: vm.btcExpired ? 'none' : 'pulse 1.2s ease-in-out infinite' }} />
                    {vm.btcExpired ? 'Rate lock expired' : 'Rate locked for '}
                    {vm.btcExpired ? null : (
                      <b style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: '#1F2A44' }}>
                        {vm.btcLock}
                      </b>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ marginTop: '6px', fontSize: '12.5px', color: '#5B6B82' }}>
                  Request a quote to see the exact amount and wallet address.
                </div>
              )}
              {vm.hasBtcQuote && !vm.btcExpired ? (
                <div onClick={vm.copyBtc} role="button" style={{ cursor: 'pointer', marginTop: '8px', fontSize: '12.5px', fontWeight: '600', color: '#8A6508' }}>
                  Copy address
                </div>
              ) : (
                <div onClick={vm.getBtcQuote} role="button" style={{ cursor: 'pointer', marginTop: '8px', fontSize: '12.5px', fontWeight: '600', color: '#8A6508' }}>
                  {vm.hasBtcQuote ? 'Refresh Bitcoin quote' : 'Get Bitcoin quote'}
                </div>
              )}
            </div>
          </div>
          <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '16px 4px 6px' }}>
            BITCOIN TRANSACTION ID
          </label>
          <input className="authIn" aria-label="Bitcoin transaction ID" value={vm.btcTx ?? ''} onChange={vm.setBtcTx} placeholder="Paste the TXID from your wallet" style={{ width: '100%', height: '50px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 14px', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '13px' }} />
          <div style={{ fontSize: '11.5px', color: '#5B6B82', margin: '6px 4px 0', lineHeight: '1.45' }}>
            Available in supported countries. Mineral Bridge confirms the payment once the transaction is verified on the network; if the rate lock expires, request a fresh quote.
          </div>
        </>
      ) : null}
      {vm.needsRef ? (
        <>
          <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '16px 4px 6px' }}>
            {vm.payRefLabel}
          </label>
          <input className="authIn" aria-label={String(vm.payRefLabel ?? 'Payment reference')} value={vm.payRefVal ?? ''} onChange={vm.setPayRef} placeholder="Enter the reference from your bank or UPI app" style={{ width: '100%', height: '50px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 14px', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '13px' }} />
        </>
      ) : null}
      {vm.isBankPay ? (
        <>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
            PROOF OF PAYMENT
          </div>
          <div onClick={vm.toggleProof} role="button" style={{ cursor: 'pointer', padding: '18px', borderRadius: '18px', border: `1.5px dashed ${vm.proofBorder ?? ''}`, background: str(vm.proofBg), textAlign: 'center', fontSize: '13.5px', fontWeight: '600' }}>
            {vm.proof ? (
              <>
                {vm.proofLabel}
              </>
            ) : null}
            {vm.noProof ? (
              <>
                Upload transfer receipt or bank advice
              </>
            ) : null}
          </div>
        </>
      ) : null}
      {vm.paying ? (
        <div style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '16px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '18px', height: '18px', flex: 'none', borderRadius: '9px', border: '2px solid rgba(242,201,76,.3)', borderTopColor: '#F2C94C', animation: 'spinSlow .8s linear infinite' }} />
          <span style={{ fontSize: '13.5px' }}>
            {vm.payingText}
          </span>
        </div>
      ) : null}
      {vm.payErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.payErr}
        </div>
      ) : null}
      <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
        Your payment shows as processing until Mineral Bridge confirms the funds have arrived. A transaction reference is issued only after confirmation.
      </div>
      <div className="mb-press-3" onClick={vm.askOtherPay} role="button" style={{ cursor: 'pointer', marginTop: '14px', padding: '14px 15px', borderRadius: '18px', background: '#fff', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ width: '38px', height: '38px', flex: 'none', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <div style={{ flex: '1', minWidth: '0' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            Need letter of credit or another method?
          </div>
          <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
            LC, escrow or split payments are arranged by our support team.
          </div>
        </div>
        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#8A6508', flex: 'none' }}>
          Contact
        </span>
      </div>
    </div>
  );
}
