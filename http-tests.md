1. Shipment creation
--------------------

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api\tests> curl.exe -i -X POST http://localhost:3000/orders/ORD-001/shipments `
    >>   -H "Content-Type: application/json" `
    >>   -d '{\"carrier\":\"DHL\",\"trackingNumber\":\"123456789\"}'
    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Location: /orders/ORD-001/shipments/SHP-001
    Content-Type: application/json; charset=utf-8
    Content-Length: 144
    ETag: W/"90-PKEUhFtgOvD8MkbVs5+aUVtlR3E"
    Date: Sat, 14 Nov 2026 16:33:52 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"success":true,"data":{"id":"SHP-001","orderId":"ORD-001","carrier":"DHL","trackingNumber":"123456789","createdAt":"2026-11-14T16:33:52.870Z"}}


2. Shipment creation with Idempotency
-------------------------------------

    1st call:

        PS D:\Wa\Plugin-hive-training\shiphub-capstone> curl.exe -i -X POST http://localhost:3000/orders/ORD-001/shipments `
        >>   -H "Content-Type: application/json" `
    ==> >>   -H "Idempotency-Key: 1234567810" `
        >>   -d '{\"carrier\":\"DHL\",\"trackingNumber\":\"123456789\"}'
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
    ==> Location: /orders/ORD-001/shipments/SHP-003
    ==> Idempotency-Replayed: false
        Content-Type: application/json; charset=utf-8
        Content-Length: 144
        ETag: W/"90-c5JfQItMLtVW5tVcmDLQdMkGyFA"
        Date: Sat, 14 Nov 2026 16:51:20 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"success":true,"data":{"id":"SHP-003","orderId":"ORD-001","carrier":"DHL","trackingNumber":"123456789","createdAt":"2026-11-14T16:51:20.284Z"}}
    
    2nd call:

        PS D:\Wa\Plugin-hive-training\shiphub-capstone> curl.exe -i -X POST http://localhost:3000/orders/ORD-001/shipments `
        >>   -H "Content-Type: application/json" `
    ==> >>   -H "Idempotency-Key: 1234567810" `
        >>   -d '{\"carrier\":\"DHL\",\"trackingNumber\":\"123456789\"}'
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
    ==> Idempotency-Replayed: true
    ==> Location: /orders/ORD-001/shipments/SHP-003
        Content-Type: application/json; charset=utf-8
        Content-Length: 144
        ETag: W/"90-c5JfQItMLtVW5tVcmDLQdMkGyFA"
        Date: Sat, 14 Nov 2026 16:51:24 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"success":true,"data":{"id":"SHP-003","orderId":"ORD-001","carrier":"DHL","trackingNumber":"123456789","createdAt":"2026-11-14T16:51:20.284Z"}} 


3. Check default Pagination Values
----------------------------------

    PS D:\Wa\Plugin-hive-training\shiphub-capstone> curl.exe -i "http://localhost:3000/orders/ORD-001/shipments"
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 538
    ETag: W/"21a-xmkQ7ySG7Bt1d/2u9hiJS1Bqc/M"
    Date: Sat, 14 Nov 2026 17:03:50 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
        "data":[{"id":"SHP-004","orderId":"ORD-001","carrier":"DHL","trackingNumber":"32523523","createdAt":"2026-11-14T16:59:25.439Z"},{"id":"SHP-003","orderId":"ORD-001","carrier":"DHL","trackingNumber":"123456789","createdAt":"2026-11-14T16:51:20.284Z"},{"id":"SHP-002","orderId":"ORD-001","carrier":"DHL","trackingNumber":"123456789","createdAt":"2026-11-14T16:50:14.557Z"},{"id":"SHP-001","orderId":"ORD-001","carrier":"DHL","trackingNumber":"123456789","createdAt":"2026-11-14T16:33:52.870Z"}],
    ==> "page":1,"limit":20,"total":4,"totalPages":1
    }

4. Check Pagination Valid values(page = 1, limit = 2)
-----------------------------------------------------

    PS D:\Wa\Plugin-hive-training\shiphub-capstone> curl.exe -i "http://localhost:3000/orders/ORD-001/shipments?page=1&limit=2"
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 295
    ETag: W/"127-iTe3bf0FPFF1Mhja+cprOLXRyVc"
    Date: Sat, 14 Nov 2026 17:07:51 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
        "data":[{"id":"SHP-004","orderId":"ORD-001","carrier":"DHL","trackingNumber":"32523523","createdAt":"2026-11-14T16:59:25.439Z"},{"id":"SHP-003","orderId":"ORD-001","carrier":"DHL","trackingNumber":"123456789","createdAt":"2026-11-14T16:51:20.284Z"}],
    ==> "page":1,"limit":2,"total":4,"totalPages":2
    }

5. Check Pagination Invalid values(page = 1, limit = 0)
-------------------------------------------------------

    PS D:\Wa\Plugin-hive-training\shiphub-capstone> curl.exe -i "http://localhost:3000/orders/ORD-001/shipments?page=1&limit=0"
    HTTP/1.1 400 Bad Request
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 70
    ETag: W/"46-bDzqXQ5MulVWqtAEal0dvvJUC1Y"
    Date: Sat, 14 Nov 2026 17:09:27 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"Invalid pagination parameters","details":null,"fields":null}