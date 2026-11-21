// Labels and tones shared by the support inbox and thread screens (ported from the mobile app's supportVals).
export const TOPIC: Record<string, string> = { general: 'General question', other_payment_method: 'Other payment method', order: 'Order help', sell: 'Selling help' };
export const topicLabel = (t: string): string => TOPIC[t] || String(t || 'general').replace(/_/g, ' ').replace(/^./, m => m.toUpperCase());

/** [label, background, text colour] */
export type Tone = [string, string, string];
const STATUS: Record<string, Tone> = {
  open: ['Open', '#FBF3E4', '#A1620B'],
  agent_replied: ['Replied', '#E8EEF9', '#2B4C8C'],
  waiting_on_user: ['Waiting for you', '#FBF3E4', '#A1620B'],
  resolved: ['Resolved', '#E2F2E9', '#17704C'],
  closed: ['Closed', '#F1EFE9', '#3A3940'],
};
export const statusTone = (st: string): Tone => STATUS[st] || [String(st || '').replace(/_/g, ' ').replace(/^./, m => m.toUpperCase()), '#F1EFE9', '#3A3940'];
