import type { Order, OrderStatus, Shipment } from "../types";
import { apiRequest } from "./client";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type FetchResult<T> = Partial<Pagination> & {
  data: T | null;
  error: string | null;
};


export const fetchOrders = async (
  status?: OrderStatus | '',
  searchQuery?: string
): Promise<FetchResult<Order[]>> => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (searchQuery) params.set('search', searchQuery);
  const query = params.toString();

  try {
    const url = query ? `/orders?${query}` : '/orders';

    const res = await apiRequest(url, { method: 'GET' });

    return { data: res.data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Something went wrong'
    };
  }
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  return apiRequest(`/orders/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<FetchResult<Pick<Order, 'status'>>> => {
  return apiRequest(`/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};

export const createOrder =  async ({customer, product}: {customer: string, product: string}) => {
  return apiRequest('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, product }),
  });
}

export const fetchShipmentsByOrder = async ({id, page,limit}:
  {id: string, page: number, limit: number}): Promise<FetchResult<Shipment[]>> => {
  return apiRequest(`/orders/${encodeURIComponent(id)}/shipments?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
};

export const createShipment =  async ({
  orderId, trackingNumber, carrier, idempotencyKey
}: Pick<Shipment, 'orderId' | 'carrier' | 'trackingNumber'>&{idempotencyKey?: string}) => {
  return apiRequest(`/orders/${orderId}/shipments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ carrier, trackingNumber }),
  });
}
