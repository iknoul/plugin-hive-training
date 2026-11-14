import { useState } from "react";
import { createOrder } from "../http/order-apis";
import type { Order } from "../types";

type AddNewOrderProps = {
    handleAddNewOrderToggle:()=> void
    hanldeCreateOrder: (newOrder: Order)=>void
}
export function AddNewOrder({
    handleAddNewOrderToggle, 
    hanldeCreateOrder}:   Readonly<AddNewOrderProps>) 
{

    const [customer, setCustomer] = useState('');
    const [product, setProduct] = useState('');

    const handleAddNewOrder = () => {
            if (!customer.trim() || !product.trim()) {
                alert('Please fill in both customer and product fields.');
                return;
            }
            
            // handling creation of new order without refreshing the whole page.
            const newOrder = createOrder({ customer, product });
            newOrder.then(order => {
                hanldeCreateOrder(order.data);
                setCustomer('');
                setProduct('');
            }).catch(err => {
                console.error('Error creating order:', err);
                alert('Failed to create order. Please try again.');
            });
        }

    return (
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
    )
}