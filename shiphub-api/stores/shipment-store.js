// src/shipment-store.js

const shipments = [];
const idempotencyStore = new Map();

let nextShipmentId = 1;

// Create a shipment
export function createShipment(orderId, shipmentData) {
    const shipment = {
        id: `SHP-${String(nextShipmentId++).padStart(3, '0')}`,
        orderId,
        carrier: shipmentData.carrier,
        trackingNumber: shipmentData.trackingNumber,
        createdAt: new Date().toISOString(),
    };

    shipments.push(shipment);

    return { ...shipment };
}

// Get all shipments belonging to an order
export function getShipmentsByOrderId(orderId) {
    return shipments
        .filter(shipment => shipment.orderId === orderId)
        .map(shipment => ({ ...shipment }));
}

// Get an idempotency record
export function getIdempotencyRecord(key) {
    return idempotencyStore.get(key);
}

// Store an idempotency record
export function storeIdempotencyRecord({ key, data }) {
    idempotencyStore.set(key, data);
}