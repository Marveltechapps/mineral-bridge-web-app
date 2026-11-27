// Labels and tones shared by the support inbox and thread screens (ported from the mobile app's supportVals).
export const TOPIC: Record<string, string> = { general: 'General question', other_payment_method: 'Other payment method', order: 'Order help', sell: 'Selling help' };
export const topicLabel = (t: string): string => TOPIC[t] || String(t || 'general').replace(/_/g, ' ').replace(/^./, m => m.toUpperCase());

/** [label, background, text colour] */
export type Tone = [string, string, string];
const STATUS: Record<string, Tone> = {
  open: ['Open', '#FEF7E0', '#8A5A06'],
  agent_replied: ['Replied', '#E8EEF9', '#2B4C8C'],
  waiting_on_user: ['Waiting for you', '#FEF7E0', '#8A5A06'],
  resolved: ['Resolved', '#E2F2E9', '#17704C'],
  closed: ['Closed', '#F1F5F9', '#334155'],
};
export const statusTone = (st: string): Tone => STATUS[st] || [String(st || '').replace(/_/g, ' ').replace(/^./, m => m.toUpperCase()), '#F1F5F9', '#334155'];
