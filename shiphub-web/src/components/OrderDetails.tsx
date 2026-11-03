
import type { Order, OrderStatus } from '../types.ts';
import OrderList from './OrderList.tsx';
import {fetchOrders, updateOrderStatus } from '../http/order-apis.ts';
import {StatusSummary } from './StatusSummary .tsx';
import { useEffect, useState } from 'react';


export default function OrderDetails(){

    const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [debouncedQuery, setDebouncedQuery] = useState(''); // Updates only after 400ms of inactivity
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>('')
    const [loading, setLoading] = useState<boolean>(false)

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = event.target.value as OrderStatus | '';
        setFilterStatus(selectedStatus);
    }

    const handleMarkAsShipped = async (orderId: string) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, 'Shipped');
            // Update the order in the local state
            setOrders(orders.map(order => order.id === orderId ? { ...order, status: updatedOrder.status } 
                : order));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        let cancelled = false;

        const loadOrders = async () => {
            setLoading(true);

            const res = await fetchOrders(filterStatus, debouncedQuery);

            if (cancelled) return;

            setOrders(res.data ?? []);
            setError(res.error);
            setLoading(false);
        };

        void loadOrders();

        return () => {
            cancelled = true;
        };
    }, [filterStatus, debouncedQuery]);

    return (
        <div className='order-details'>

            <div className='order-summary-bar'>            
                <div className='order-toolbar'>
                    <input type="text" placeholder="Search by customer or product" 
                        className='search-input' onChange={handleSearchChange}
                    />
                    <select name='status' className='filter-slct' onChange={handleSelectChange}>
                        <option value="">Select Status</option>
                        <option value=''>All</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>

                <StatusSummary  orders={orders} />

            </div>

            {loading && <p>Loading...</p>}

            {error && <p>Something went wrong: {error}</p>}

            {!loading && !error && (
            <OrderList
                Orders={orders}
                handleMarkAsShipped={handleMarkAsShipped}
            />
            )}
              
        </div>
    )    
}