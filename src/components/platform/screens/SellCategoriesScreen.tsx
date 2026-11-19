// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import { Fragment } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';

export function SellCategoriesScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontSize: '14px', color: '#6B6A70', lineHeight: '1.5', margin: '0 4px 12px' }}>
        Choose the mineral you want to sell to Mineral Bridge.
      </div>
      {vm.buyerOnly ? (
        <div style={{ marginBottom: '12px', padding: '12px 14px', borderRadius: '16px', background: '#FBF3E4', border: '1px solid #EFDDB8', fontSize: '13px', color: '#7A4A08', lineHeight: '1.45' }}>
          Your account is set up for buying. You can prepare a sell request now and add a seller type when you submit.
        </div>
      ) : null}
      {vm.hasDraft ? (
        <div style={{ marginBottom: '12px', padding: '14px 15px', borderRadius: '18px', background: '#121214', color: '#F4F2ED' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#D9B456' }}>
            DRAFT SAVED
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '5px' }}>
            {vm.draftLine}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '13px', fontWeight: '600' }}>
            <span onClick={vm.resumeDraft} style={{ cursor: 'pointer', color: '#D9B456' }}>
              Resume
            </span>
            <span onClick={vm.discardDraft} style={{ cursor: 'pointer', color: '#C9C7C0' }}>
              Discard
            </span>
          </div>
        </div>
      ) : null}
      <div style={{ height: '48px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B8A90" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input aria-label="Search minerals" value={vm.search ?? ''} onChange={vm.setSearch} placeholder="Search minerals" style={{ flex: '1', minWidth: '0', border: 'none', background: 'transparent', fontSize: '14.5px' }} />
      </div>
      {list(vm.sellGroups).map((g, index) => (
        <Fragment key={index}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '18px 4px 8px' }}>
            {g?.name}
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            {list(g?.items).map((i, index2) => (
              <div key={index2} onClick={i?.tap} role="button" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #EFEDE7' }}>
                <span style={{ flex: '1', fontSize: '14.5px', fontWeight: '500' }}>
                  {i?.n}
                </span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
            ))}
          </div>
        </Fragment>
      ))}
      {vm.sellNone ? (
        <div style={{ marginTop: '16px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '22px', textAlign: 'center', fontSize: '14px', color: '#6B6A70' }}>
          No mineral matches “{vm.search}”.
        </div>
      ) : null}
    </div>
  );
}
