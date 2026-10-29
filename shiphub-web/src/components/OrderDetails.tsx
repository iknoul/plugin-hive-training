
import OrderList from './OrderList.tsx';
import {fetchOrders, updateOrderStatus} from '../http/order-apis.ts'
import type { Order, OrderStatus } from '../types.ts';
import { useEffect, useState } from 'react';


export default function OrderDetails(){

    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('')


    // Done this way to Use one delegated click listener with closest() and data-id.
    const handleContainerClick = async (event: React.MouseEvent) => {

        const target = event.target as HTMLElement;

        // 1. Find the closest order card wrapper using .closest()
        const card = target.closest('.order-item');
        if (!card) return; // Exit if the click wasn't inside an order card

        // 2. Extract the unique ID from data-id
        const orderId = (card as HTMLElement).dataset.id;
        
        if(!orderId) {
            alert('Something went wrong')
            return
        }
        // Check if the clicked element is the ship button
        if (target.classList.contains('ship-btn')) {

            // updateOrderStatus(orderId, 'Shipped');

            const button = target as HTMLButtonElement;

            try {
                // 1. Mute/disable the specific button and update its look/text if desired
                button.disabled = true;
                button.textContent = 'Updating...';

                // 2. Send the PATCH request to update order status
                const response = await  updateOrderStatus(orderId, 'Shipped');
                if(response){
                    // 2. Find the status element inside this specific card and update its text
                const statusElement = card.querySelector('.status-badge');
                    if (statusElement) {
                        statusElement.textContent = 'Shipped';
                    }
                } 

            } catch (err: any) {
                console.error(err.message || 'Failed to update order status');
                // Re-enable the button if something goes wrong so the user can try again
                button.disabled = false;
            } finally {
                // Just for use the finally keyword
                button.textContent = 'Mark as Shipped'
            }
        }
    }

    useEffect(() => {
        let cancelled = false;
        setLoading(true)
        fetchOrders(filterStatus).then((res) => {
            if (cancelled) return;
            setOrders(res.data ?? []);
            setError(res.error);
            setLoading(false)
        });
        
        return () => { cancelled = true; }; // ignore stale responses
    }, [filterStatus]);

    useEffect(() => {
        const handler = (e: Event) => {
            const target = e.target as HTMLElement;
            const filter = target.closest('.filter-slct') as HTMLSelectElement | null;

            if (filter) {
            setFilterStatus((filter.value as OrderStatus) || '');
            }
        };

        document.addEventListener('change', handler);
        return () => document.removeEventListener('change', handler);
    }, []);

    if(loading) return <p>Loading ...</p>

    if(error) return <p>Something went wrong</p>

    return (
        <div className='order-details' onClick={handleContainerClick}>
            
            <select name='status' className='filter-slct'>
                <option value="">Select Status</option>
                <option value=''>All</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
            </select>

            <OrderList Orders = {orders ?? []}  />
              
        </div>
    )    
}