// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function CategoriesScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.search ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px', padding: '12px 16px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '14px' }}>
            {"Results for "}
            <b>
              “{vm.search}”
            </b>
          </span>
          <button onClick={vm.clearSearch} style={{ border: 'none', background: 'none', fontFamily: 'inherit', color: '#8A6508', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            Clear search
          </button>
        </div>
      ) : null}
      {vm.hasGlobal ? (
        <div className="pgrid">
          {list(vm.global).map((x, index) => (
            <button key={index} className="lotCard" onClick={x?.tap} aria-label={`${x?.name ?? ''} · ${x?.qty ?? ''}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', minWidth: '0', padding: '0', textAlign: 'left', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44', opacity: str(x?.opacity) }}>
              <span style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '1/1', backgroundColor: '#EFF6FF', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(x?.img) }}>
                {x?.off ? (
                  <span style={{ position: 'absolute', left: '10px', top: '10px', background: '#1F2A44', color: '#fff', fontSize: '10.5px', fontWeight: '800', letterSpacing: '.3px', padding: '3px 8px', borderRadius: '8px' }}>
                    SOLD OUT
                  </span>
                ) : null}
                {x?.hasLabTag ? (
                  <span style={{ position: 'absolute', left: '10px', top: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#17704C', color: '#fff', fontSize: '10.5px', fontWeight: '800', letterSpacing: '.3px', padding: '3px 8px', borderRadius: '8px' }}>
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    LAB TESTED
                  </span>
                ) : null}
                <span style={{ position: 'absolute', right: '8px', bottom: '8px', background: 'rgba(15,23,42,.8)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px' }}>
                  {x?.id}
                </span>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '12px 12px 14px', flex: '1', minWidth: '0' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#5B6B82', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {x?.sub}
                </span>
                <span style={{ height: '2.56em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', fontSize: '13.5px', fontWeight: '700', lineHeight: '1.28' }}>
                  {x?.name}
                </span>
                <span style={{ alignSelf: 'flex-start', maxWidth: '100%', padding: '2px 8px', borderRadius: '99px', fontSize: '10.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: str(x?.labBg), color: str(x?.labFg) }}>
                  {x?.grade}
                </span>
                <span style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                  <span style={{ minWidth: '0', lineHeight: '1.25' }}>
                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {x?.qty}
                    </span>
                    <span style={{ display: 'block', fontSize: '11.5px', color: '#5B6B82', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {x?.min}
                    </span>
                  </span>
                  <span aria-hidden="true" style={{ width: '30px', height: '30px', flexShrink: '0', borderRadius: '50%', background: '#1F2A44', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
      {vm.noGlobal ? (
        <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '30px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '800' }}>
            No minerals match “{vm.search}”
          </div>
          <div style={{ fontSize: '13px', color: '#5B6B82', marginTop: '6px' }}>
            Try a mineral name such as gold, copper or lithium.
          </div>
          <button onClick={vm.clearSearch} style={{ marginTop: '16px', height: '42px', padding: '0 20px', borderRadius: '12px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer' }}>
            Clear search
          </button>
        </div>
      ) : null}
      {vm.notSearching ? (
        <>
          <div className="catgrid">
            {list(vm.cats).map((c, index) => (
              <button key={index} className="lotCard" onClick={c?.tap} style={{ position: 'relative', display: 'block', width: '100%', padding: '0', border: '1px solid #E2E8F0', borderRadius: '18px', overflow: 'hidden', background: '#1F2A44', aspectRatio: '4/3', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(c?.img) }} />
                <span aria-hidden="true" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(15,23,42,.05) 25%,rgba(15,23,42,.9))' }} />
                <span style={{ position: 'absolute', left: '16px', right: '16px', bottom: '14px', color: '#fff' }}>
                  <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: '#F2C94C', color: '#1F2A44' }}>
                    {c?.n}
                  </span>
                  <span style={{ display: 'block', fontWeight: '800', fontSize: '21px', letterSpacing: '-.4px', marginTop: '8px' }}>
                    {c?.name}
                  </span>
                  <span style={{ display: 'block', fontSize: '12.5px', color: '#E2E8F0', marginTop: '3px', lineHeight: '1.4' }}>
                    {c?.subs}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="g3" style={{ marginTop: '18px' }}>
            {list(vm.web?.promos).map((p, index) => (
              <div key={index} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '11px', background: '#FEF7E0', color: '#8A6508', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d={p?.icon} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '13.5px' }}>
                    {p?.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '1px' }}>
                    {p?.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
