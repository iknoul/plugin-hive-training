
import type { Order, OrderStatus, PRIORITY } from '../types.ts';
import OrderList from '../components/OrderList.tsx';
import {fetchOrders, updateOrderStatus } from '../http/order-apis.ts';
import {StatusSummary } from '../components/StatusSummary .tsx';
import { useEffect, useState } from 'react';
import { AddNewOrder } from '../modals/AddNewOrder.tsx';


export default function Orders(){

    const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('')
    const [filterPriority, setFilterPriority] = useState<PRIORITY | ''>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [debouncedQuery, setDebouncedQuery] = useState(''); // Updates only after 400ms of inactivity
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
    }

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = event.target.value as OrderStatus | '';
        setFilterStatus(selectedStatus);
    }

     const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = event.target.value as PRIORITY | '';
        setFilterPriority(selectedStatus);
    }

    const handleAddNewOrderToggle = () => {
        setIsModalOpen(prev => !prev)
    }

    const hanldeCreateOrder = (newOrder: Order) => {
        setOrders(prevOrders => [newOrder,...prevOrders]);
        setIsModalOpen(false);
    }
    

    const handleMarkAsShipped = async (orderId: string) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, 'Shipped');
           
            // Update the order in the local state
            setOrders(orders.map(order => order.id === orderId ? 
                { ...order, status: updatedOrder?.data?.status ?? order.status} 
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

            const res = await fetchOrders({
                status: filterStatus, 
                priority: filterPriority, 
                searchQuery: debouncedQuery
            });

            if (cancelled) return;

            setOrders(res.data ?? []);
            setError(res.error);
            setLoading(false);
        };

        void loadOrders();

        return () => {
            cancelled = true;
        };
    }, [filterStatus, filterPriority, debouncedQuery]);

    return (
        <div className='order-details'>

        <div className='order-action-bar'>

            {isModalOpen && (
                <AddNewOrder 
                    hanldeCreateOrder={hanldeCreateOrder}
                    handleAddNewOrderToggle={handleAddNewOrderToggle}
                />
            )}

            <button className='btn btn-primary' onClick={handleAddNewOrderToggle}>
                <span className='btn-icon'>{isModalOpen ? '' : '+'}</span> {isModalOpen ? 'Close' : 'Add New Order'}
            </button>

        </div>
        
            <div className='order-summary-bar'>            
                <div className='order-toolbar'>
                    <input type="text" placeholder="Search by customer or product" 
                        className='search-input' onChange={handleSearchChange}
                    />
                    <select name='status' className='filter-slct' onChange={handleStatusChange}>
                        <option value="">Status</option>
                        <option value=''>All</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>

                    <select name='priority' className='filter-slct' onChange={handlePriorityChange}>
                        <option value="">Priority</option>
                        <option value=''>All</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                        <option value="invalid">Invalid</option>
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