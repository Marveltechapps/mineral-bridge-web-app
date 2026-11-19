/**
 * A bound text value inside a flex or grid container. The design runtime renders every
 * text binding as its own inline element, which makes it a separate flex item; this keeps
 * that layout. Null, undefined and booleans render nothing.
 */
export function Val({ v }: { v: unknown }) {
  if (v == null || typeof v === 'boolean') return null;
  return <span>{String(v)}</span>;
}
