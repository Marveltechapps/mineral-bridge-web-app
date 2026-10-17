import { http } from '@/lib/api/client';
import type { Paginated } from '@/lib/api/types';
import type { Order, OrderSide } from '@/types';

interface Money {
  amount: number;
  currency: string;
}

interface Quantity {
  value: number;
  unit: string;
}

interface WebOrder {
  id: string;
  reference?: string;
  side: OrderSide;
  lot: { id: string; name: string; imageUrl?: string | null };
  quantity: Quantity;
  value: Money;
  placedAt: string;
  status: string;
  statusLabel: string;
  stage?: { title?: string };
  progressPercent: number;
  rejected: boolean;
  rejectionReason?: string | null;
  region?: string | null;
  closed?: boolean;
}

const STATUS_COLORS: Record<string, [string, string]> = {
  in_review: ['#b45309', '#fdecd6'],
  active: ['#1d4ed8', '#dbeafe'],
  complete: ['#0f7034', '#dcf3e8'],
  rejected: ['#dc2626', '#fdecec'],
  cancelled: ['#6b7290', '#eef1f8'],
};

export function webOrderToOrder(order: WebOrder): Order {
  const [sc, sbg] = STATUS_COLORS[order.status] ?? STATUS_COLORS.in_review;
  const image = order.lot.imageUrl ? `url("${order.lot.imageUrl}") center / contain no-repeat, #eef1f6` : '';
  return {
    id: order.reference || order.id,
    recordId: order.id,
    mineral: order.lot.name,
    side: order.side,
    qty: `${order.quantity.value} ${order.quantity.unit}`,
    date: order.placedAt.slice(0, 10),
    stage: order.stage?.title,
    progress: `${order.progressPercent}%`,
    status: order.statusLabel,
    rejected: order.rejected,
    reason: order.rejectionReason ?? undefined,
    region: order.region ?? undefined,
    sc,
    sbg,
    grad: image || 'linear-gradient(140deg,#1e2a5a,#141a2e)',
  };
}

export async function listOrders(signal?: AbortSignal): Promise<Order[]> {
  const page = await http.get<Paginated<WebOrder>>('/orders', { query: { perPage: 100 }, signal });
  return page.items.map(webOrderToOrder);
}

export interface OrderQuote {
  subtotal: Money;
  platformFee: Money;
  total: Money;
  quoteId: string;
}

export function quoteOrder(
  body: { lotId: string; quantity: Quantity; paymentMethod: string },
  signal?: AbortSignal,
): Promise<OrderQuote> {
  return http.post<OrderQuote>('/orders/quote', body, { signal });
}

export interface OrderTimelineStage {
  index: number;
  title: string;
  state: string;
  occurredAt: string | null;
  note: string | null;
}

export function getOrderTimeline(orderId: string, signal?: AbortSignal) {
  return http.get<{ stages: OrderTimelineStage[]; currentIndex: number; terminated: boolean }>(
    `/orders/${encodeURIComponent(orderId)}/timeline`,
    { signal },
  );
}

export interface OrderLeg {
  label: string;
  meta: string;
  state: string;
}

export function getOrderLogistics(orderId: string, signal?: AbortSignal) {
  return http.get<{ legs: OrderLeg[]; currentIndex: number }>(
    `/orders/${encodeURIComponent(orderId)}/logistics`,
    { signal },
  );
}

export interface OrderDocument {
  name: string;
  available: boolean;
  file: { url: string; sizeBytes?: number } | null;
}

export function getOrderDocuments(orderId: string, signal?: AbortSignal) {
  return http.get<{ items: OrderDocument[] }>(`/orders/${encodeURIComponent(orderId)}/documents`, { signal });
}

export function createOrder(body: {
  lotId: string;
  quantity: Quantity;
  paymentMethod: string;
  quoteId?: string;
}): Promise<{ order: WebOrder }> {
  return http.post('/orders', body, { headers: { 'Idempotency-Key': crypto.randomUUID() } });
}
