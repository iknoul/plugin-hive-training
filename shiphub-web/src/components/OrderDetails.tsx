
import type { Order, OrderStatus } from '../types.ts';
import OrderList from './OrderList.tsx';
import {fetchOrders, updateOrderStatus, createOrder } from '../http/order-apis.ts';
import {StatusSummary } from './StatusSummary .tsx';
import { useEffect, useState } from 'react';


export default function OrderDetails(){

    const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [debouncedQuery, setDebouncedQuery] = useState(''); // Updates only after 400ms of inactivity
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customer, setCustomer] = useState('');
    const [product, setProduct] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = event.target.value as OrderStatus | '';
        setFilterStatus(selectedStatus);
    }

    const handleAddNewOrderToggle = () => {
        setIsModalOpen(prev => !prev)
    }

    const handleAddNewOrder = () => {
        if (!customer.trim() || !product.trim()) {
            alert('Please fill in both customer and product fields.');
            return;
        }
        
        // handling creation of new order without refreshing the whole page.
        const newOrder = createOrder({ customer, product });
        newOrder.then(order => {
            setOrders(prevOrders => [order.data,...prevOrders]);
            setCustomer('');
            setProduct('');
            setIsModalOpen(false);
        }).catch(err => {
            console.error('Error creating order:', err);
            alert('Failed to create order. Please try again.');
        });
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

        <div className='order-action-bar'>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">

                     <h2 className="modal-title">Add New Order</h2>

                        <input
                            className='input-field'
                            placeholder="Customer name"
                            value={customer}
                            onChange={e => setCustomer(e.target.value)}
                        />

                        <input
                            className='input-field'
                            placeholder="Product name"
                            value={product}
                            onChange={e => setProduct(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button  className='btn-primary' onClick={handleAddNewOrderToggle}>
                                Cancel
                            </button>
                            <button  className='btn-primary' onClick={handleAddNewOrder}>
                                Add Order
                            </button>
                        </div>

                    </div>
                </div>
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