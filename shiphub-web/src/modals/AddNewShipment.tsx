import { useState } from "react";
import { createShipment } from "../http/order-apis";
import type { Shipment } from "../types";

type AddNewShipmentProps = {
    handleAddNewShipmentToggle:()=> void;
    hanldeCreateShipment: (newShipment: Shipment)=>void;
    orderId: string;
}
export function AddNewShipment({
    handleAddNewShipmentToggle, 
    hanldeCreateShipment,
    orderId}:   Readonly<AddNewShipmentProps>) 
{

    const [trackingNumber, setTrackingNumber] = useState<string>('');
    const [carrier, setCarrier] = useState<string>('');

    // const idempotencyKey = crypto.randomUUID();
    const idempotencyKey = crypto.randomUUID();



    const handleAddNewShipment = () => {
            const trackingNumberLength = trackingNumber.trim().length
            if (!trackingNumberLength || trackingNumberLength === 0 || !carrier.trim()) {
                alert('Please fill in both carrier and tracking number fields.');
                return;
            }

            if (trackingNumberLength < 5 || trackingNumberLength > 40) {
                alert(`Invalid tracking number length(must be between 5-40), now ${trackingNumber.length}`);
                return;
            }
            
            // handling creation of new order without refreshing the whole page.
            const newShipment = createShipment({ orderId, trackingNumber, carrier, idempotencyKey });
            newShipment.then(shipment => {
                hanldeCreateShipment(shipment.data);
                setTrackingNumber('');
            }).catch(err => {
                console.error('Error creating shipment:', err);
                alert('Failed to create shipment. Please try again.');
            });
        }

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h2 className="modal-title">Add New shipment</h2>

                <input
                    type="number"
                    className='input-field'
                    placeholder="Tracking number "
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                />

                <select 
                    name="carrier" 
                    id="" 
                    onChange={e => setCarrier(e.target.value)}
                >
                    <option value="">Select carrier</option>
                    <option value="FedEx">FedEx</option>
                    <option value="DHL">DHL</option>
                    <option value="UPS">UPS</option>
                </select>

                <div className="modal-actions">
                    <button  className='btn-primary' onClick={handleAddNewShipmentToggle}>
                        Cancel
                    </button>
                    <button  className='btn-primary' onClick={handleAddNewShipment}>
                        Add shipment
                    </button>
                </div>

            </div>
        </div>
    )
}