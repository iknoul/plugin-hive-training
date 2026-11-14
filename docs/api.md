SHIPHUB API
------------

List the Shipments:
    GET /orders/order-id/shipments       list shipments for the order

    Request
    page: number                       optional, default 1
    limit: number                      optional, default 20

    200       { data: [shipments], page, limit, total, totalPages }
    400       { error, details, fields }
    404       {"error":"Order not found","details":null,"fields":null}

Create Shipment:
    POST /orders/order-id/shipments        create one shipment for the order
    Request   Idempotency-Key: <uuid>      optional, makes retries safe

    {
    "carrier": "DHL" | "FedEx" | "UPS", required,
    "trackingNumber": string, 5-40 characters, required
    }
    any other field -> 400 "is not allowed"

    201       Location: /orders/ORD-003    { id, customer, product, status, createdAt }
    400       { error, details, fields }
    404       {"error":"Order not found","details":null,"fields":null}
    422       {"error":"Idempotency key reused with different request data","details":null,"fields":null}



Most challenging API design decision
------------------------------------

Most chanllenging API design decision was organizing shipment routes under the orders resource (/orders/:orderId/shipments). I had seperate the order routes and shipment routes for clean structure while keeping the relation visible. Also Using Idempotency key with fingerprint to distinguish the accidental retry and misuse of the key.
