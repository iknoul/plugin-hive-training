export const ORDER_STATUSES = [
  'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled',
] as const;

export const UNCHANGEBLE_STATUSES = [ 'Shipped', 'Delivered', 'Cancelled' ]

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export interface Order {
  id: string;
  customer: string;
  product: string;
  status: OrderStatus;
  createdAt: string;
}
export type NewOrder = Pick<Order, 'customer' | 'product'>;
export interface ApiErrorBody {
  error: string;
  details?: string;
}
 