import { type Shipment } from '../types.ts';


type ShipmentListProps = Readonly<{
    shipments: Shipment[];
}>

export default function ShipmentList({
    shipments
}:ShipmentListProps){

    
    
    return (
        <div className='table-content'>
            { shipments.length === 0 
                ?  <p> No Shipment found</p>

                :  <table className='order-list'>
                        <thead className='order-list-header'>
                            <tr>
                                <th>Shipment ID</th>
                                <th>Carrier</th>
                                <th>Tracking No</th>
                            </tr>
                        </thead>    
                        <tbody>
                            {shipments.map((shipment) => {
                                return (
                                    <tr key={shipment.id} className='order-item' data-id={shipment.id}>
                                        <td> {shipment.id}</td>
                                        <td> {shipment.carrier}</td>
                                        <td> {shipment.trackingNumber}</td>           
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
        </div>
    )

}