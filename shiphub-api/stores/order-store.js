const orders = [
  { id: 'ORD-001', customer: 'Alice Johnson', product: 'Smartphone', status: 'Delivered', createdAt: '2023-01-01T00:00:00Z' },
  { id: 'ORD-002', customer: 'John Doe', product: 'Laptop', status: 'Pending', createdAt: '2023-01-01T00:00:00Z' },
  { id: 'ORD-003', customer: 'Priya Nair', product: 'Wireless Headphones', status: 'Shipped', createdAt: '2023-01-02T09:30:00Z' },
  { id: 'ORD-004', customer: 'Michael Smith', product: 'Mechanical Keyboard', status: 'Processing', createdAt: '2023-01-03T14:15:00Z' },
  { id: 'ORD-005', customer: 'Fatima Khan', product: 'Monitor 27"', status: 'Delivered', createdAt: '2023-01-04T11:45:00Z' },
  { id: 'ORD-006', customer: 'David Lee', product: 'Tablet', status: 'Cancelled', createdAt: '2023-01-05T16:20:00Z' },
  { id: 'ORD-007', customer: 'Sneha Menon', product: 'Smart Watch', status: 'Pending', createdAt: '2023-01-06T08:00:00Z' },
  { id: 'ORD-008', customer: 'Carlos Rivera', product: 'Gaming Mouse', status: 'Shipped', createdAt: '2023-01-07T13:10:00Z' },
  { id: 'ORD-009', customer: 'Emma Wilson', product: 'External SSD', status: 'Processing', createdAt: '2023-01-08T10:05:00Z' },
  { id: 'ORD-010', customer: 'Arjun Das', product: 'Webcam', status: 'Delivered', createdAt: '2023-01-09T17:40:00Z' },
];

let nextId = 11;
export function getAllOrders(filters = {}) {
  let result = [...orders];                     
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(o => 
      o.customer.toLowerCase().includes(query) || 
      o.product.toLowerCase().includes(query)
    );
  }
  if (filters.status) result = result.filter(o => o.status === filters.status);

  return result;
}

export function getOrderById(id) {
  return orders.find((order) => order.id === id) ?? null;
}
export function createOrder(customer, product) {
  const order = {
    id: `ORD-${String(nextId++).padStart(3, '0')}`,
    customer,
    product,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return order;
}

export function updateOrder(id, updates) {
  const order = orders.find(order => order.id === id);
  if (!order) return null;                         
  if (updates.customer !== undefined) order.customer = updates.customer;
  if (updates.product  !== undefined) order.product  = updates.product;
  if (updates.status   !== undefined) order.status   = updates.status;
  return { ...order };                  
}