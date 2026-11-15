export const ORDER_STATUSES = [
  'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled',
] as const;

export type PRIORITY = 'normal' | 'low' | 'high'

export const UNCHANGEBLE_STATUSES = [ 'Shipped', 'Delivered', 'Cancelled' ]

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// define StatusCounts
export type StatusCounts = Record<OrderStatus, number>;
export interface Order {
  id: string;
  customer: string;
  product: string;
  status: OrderStatus;
  createdAt: string;
}
export type NewOrder = Pick<Order, 'customer' | 'product'>;

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  createdAt: string;
}
export type NewShipment = Pick<Shipment, 'carrier' | 'trackingNumber'>;

export interface ApiErrorBody {
  error: string;
  details?: string;
}
 