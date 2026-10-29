import { UNCHANGEBLE_STATUSES, type Order } from '../types.ts';
import StatusBadge from './StatusBadge.tsx';


type OrderListProps = Readonly<{
    Orders: Order[];
}>

export default function OrderList({Orders}:OrderListProps){

    if(Orders.length === 0) { return  <p> No Orders found</p> }

    return (
        <table className='order-list'>
            <thead className='order-list-header'>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>    
            <tbody>
                {Orders.map((order) => {
                    return (
                        <tr key={order.id} className='order-item' data-id={order.id}>
                            <td> {order.id}</td>
                            <td> {order.customer}</td>
                            <td>
                                <span className="status-text"><StatusBadge status={order.status} /></span>
                                
                            </td>
                            <td>
                            {UNCHANGEBLE_STATUSES.includes(order.status) ? null : <button className='ship-btn'>Mark as Shipped</button>}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )

}