import type { Order, OrderStatus } from "../types";
import { apiRequest } from "./client";


export type FetchResult<T> = {
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

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Pick<Order, 'status'>> => {
  return apiRequest(`/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};
