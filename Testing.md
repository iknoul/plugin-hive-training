# Testing Evidence: ShipHub API

## 1. Invalid status

**Command**
```powershell
curl.exe -i -X PATCH "http://localhost:3000/orders/ORD-001" -H "Content-Type: application/json" -d '{\"status\":\"Sheeped\"}'
```

**Output**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"Invalid Status"}
```

## 2. Unknown order ID

**Command**
```powershell
curl.exe -i -X PATCH "http://localhost:3000/orders/ORD-031" -H "Content-Type: application/json" -d '{\"status\":\"Shipped\"}'
```

**Output**
```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"error":"Order not found"}
```

## 3. Malformed JSON

**Command**
```powershell
curl.exe -i -X PATCH "http://localhost:3000/orders/ORD-001" -H "Content-Type: application/json" -d '{\"status\":\"Shipped\"'
```

**Output**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"message":"Malformed JSON in request body"}
```

## 4. Missing `Content-Type`

**Command**
```powershell
curl.exe -i -X PATCH "http://localhost:3000/orders/ORD-001" -d '{\"status\":\"Shipped\"}'
```

**Output**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"Invalid request body"}
```

## 5. Response without `Content-Type` (curl)

The test route `/test/no-content-type` sends its body with `res.end()`, so no `Content-Type` header is set.

**Command**
```powershell
curl.exe -v http://localhost:3000/test/no-content-type
```

**Output**
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Length: 26

{"success":true,"data":[]}
```

**Observation:** the body is returned in full, but the response has no `Content-Type` header.

## 6. Response without `Content-Type` (browser)

**Request**
```
GET http://localhost:3000/orders
```

**Observation**
- The data displays correctly in the app, because `fetch` parses the body regardless of the header.
- The browser's Network tab cannot identify the type, so it shows the body as raw binary and gives no formatted JSON preview.

## 7. Empty body

**Command**
```powershell
curl.exe -i -X PATCH "http://localhost:3000/orders/ORD-001" -d "{}"
```

**Output**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"Invalid request body"}
```

## 8. Valid update

**Command**
```powershell
curl.exe -i -X PATCH "http://localhost:3000/orders/ORD-002" -H "Content-Type: application/json" -d '{\"status\":\"Pending\"}'
```

**Output**
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"success":true,"data":{"id":"ORD-002","customer":"John Doe","product":"Laptop","status":"Pending","createdAt":"2023-01-01T00:00:00Z"}}
```