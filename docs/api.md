# SHIPHUB API

**------------**

## 1. List Orders

`GET /orders`

List orders with optional filtering and pagination.

**Request Query Parameters:**
- `search`: string — optional, searches customer and product.
- `status`: string — optional, filters by order status.
- `priority`: `low` | `normal` | `high` — optional.
- `page`: number — optional, default `1`.
- `limit`: number — optional, default `20`.

**200 OK**
```json
{
  "data": [
    {
      "id": "ORD-001",
      "customer": "Alice Johnson",
      "product": "Smartphone",
      "status": "Pending",
      "priority": "high",
      "createdAt": "2026-11-15T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 50,
  "totalPages": 3
}
```

**400 Bad Request**
```json
{
  "error": "Invalid query parameters",
  "details": null,
  "fields": null
}
```

**503 Service Unavailable**
```json
{
  "error": "Database unavailable",
  "details": null,
  "fields": null
}
```

---

## 2. Get Order

`GET /orders/:orderId`

Retrieve a single order by its ID.

**Request Parameters:**
- `orderId`: string — required, order ID (e.g. `ORD-001`).

**200 OK**
```json
{
  "id": "ORD-001",
  "customer": "Alice Johnson",
  "product": "Smartphone",
  "status": "Pending",
  "priority": "high",
  "createdAt": "2026-11-15T10:00:00.000Z"
}
```

**404 Not Found**
```json
{
  "error": "Order not found",
  "details": null,
  "fields": null
}
```

**503 Service Unavailable**
```json
{
  "error": "Database unavailable",
  "details": null,
  "fields": null
}
```

---

## 3. Create Order

`POST /orders`

Create a new order.

**Request Headers:**
- `Idempotency-Key`: UUID — optional, makes retries safe.

**Request Body:**
```json
{
  "customer": "Alice Johnson",
  "product": "Smartphone",
  "priority": "high"
}
```

**Fields:**
- `customer`: string — required, maximum 100 characters.
- `product`: string — required, maximum 100 characters.
- `priority`: `low` | `normal` | `high` — optional, default `normal`.

Any other field is rejected with `400 Bad Request`.

**201 Created**

`Idempotency-Replayed: false`

```json
{
  "success": true,
  "data": {
    "id": "ORD-001",
    "customer": "Alice Johnson",
    "product": "Smartphone",
    "status": "Pending",
    "priority": "high",
    "createdAt": "2026-11-15T10:00:00.000Z"
  }
}
```

**200 OK** — existing order returned when the same idempotency key is reused with identical request data.

`Idempotency-Replayed: true`

Response body has the same structure as `201 Created`.

**400 Bad Request** — invalid request body or fields.

**422 Unprocessable Entity**
```json
{
  "error": "Idempotency key reused with different request data",
  "details": null,
  "fields": null
}
```

**503 Service Unavailable** — database unavailable.

---

## 4. Update Order

`PATCH /orders/:orderId`

Update selected fields of an existing order.

**Request Parameters:**
- `orderId`: string — required, order ID.

**Request Body:**
```json
{
  "customer": "Alice Smith",
  "product": "Laptop",
  "status": "Processing",
  "priority": "high"
}
```

**Fields:**
- `customer`: string — optional, maximum 100 characters.
- `product`: string — optional, maximum 100 characters.
- `status`: `Pending` | `Processing` | `Shipped` | `Delivered` | `Cancelled` — optional.
- `priority`: `low` | `normal` | `high` — optional.

At least one valid field must be supplied. Any other field is rejected with `400 Bad Request`.

**200 OK**
```json
{
  "success": true,
  "data": {
    "id": "ORD-001",
    "customer": "Alice Smith",
    "product": "Laptop",
    "status": "Processing",
    "priority": "high",
    "createdAt": "2026-11-15T10:00:00.000Z"
  }
}
```

**400 Bad Request** — invalid request body or fields.

**404 Not Found**
```json
{
  "error": "Order not found",
  "details": null,
  "fields": null
}
```

**503 Service Unavailable** — database unavailable.

---

## 5. List Shipments

`GET /orders/:orderId/shipments`

List shipments belonging to an order with pagination.

**Request Parameters:**
- `orderId`: string — required, order ID.

**Request Query Parameters:**
- `page`: number — optional, default `1`.
- `limit`: number — optional, default `20`.

**200 OK**
```json
{
  "data": [
    {
      "id": "SHP-001",
      "orderId": "ORD-001",
      "carrier": "DHL",
      "trackingNumber": "12345623789",
      "createdAt": "2026-11-15T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "totalPages": 1
}
```

**400 Bad Request** — invalid query parameters.

**404 Not Found**
```json
{
  "error": "Order not found",
  "details": null,
  "fields": null
}
```

**503 Service Unavailable** — database unavailable.

---

## 6. Create Shipment

`POST /orders/:orderId/shipments`

Create a shipment for an existing order.

**Request Parameters:**
- `orderId`: string — required, order ID.

**Request Headers:**
- `Idempotency-Key`: UUID — optional, makes retries safe.

**Request Body:**
```json
{
  "carrier": "DHL",
  "trackingNumber": "12345623789"
}
```

**Fields:**
- `carrier`: `DHL` | `FedEx` | `UPS` — required.
- `trackingNumber`: string — required, 5–40 characters.

Any other field is rejected with `400 Bad Request`.

**201 Created**

`Idempotency-Replayed: false`

`Location: /orders/ORD-001/shipments/SHP-001`

```json
{
  "success": true,
  "data": {
    "id": "SHP-001",
    "orderId": "ORD-001",
    "carrier": "DHL",
    "trackingNumber": "12345623789",
    "createdAt": "2026-11-15T10:00:00.000Z"
  }
}
```

**200 OK** — existing shipment returned when the same idempotency key is reused with identical request data.

`Idempotency-Replayed: true`

Response body has the same structure as `201 Created`.

**400 Bad Request** — invalid request body or fields.

**404 Not Found**
```json
{
  "error": "Order not found",
  "details": null,
  "fields": null
}
```

**422 Unprocessable Entity**
```json
{
  "error": "Idempotency key reused with different request data",
  "details": null,
  "fields": null
}
```

**503 Service Unavailable** — database unavailable.

---

## 7. Common Response Status Codes

| Status | Meaning |
|---|---|
| 200 OK | Request successful or existing resource returned |
| 201 Created | Resource successfully created |
| 400 Bad Request | Invalid request body, fields, or query parameters |
| 404 Not Found | Requested order or resource not found |
| 422 Unprocessable Entity | Idempotency key reused with different request data |
| 503 Service Unavailable | Database unavailable |
