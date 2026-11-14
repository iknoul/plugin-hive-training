Intented bugs
-------------

1. Invalid limit (temporerly removed limit validation check):

    res header:    
        Request URL
        http://localhost:3000/orders/ORD-001/shipments?page=1&limit=0
        Request method
        GET
        Status code
        400 Bad Request
        Remote address
        [::1]:3000
        Referrer policy
        strict-origin-when-cross-origin

    res json:
        {"error":"Invalid pagination parameters","details":null,"fields":null}

2. Invalid Page ( page = 0, temporerly removed page validation check):

    res header:  
        Request URL
        http://localhost:3000/orders/ORD-001/shipments?page=0&limit=2
        Request method
        GET
        Status code
        400 Bad Request
        Remote address
        [::1]:3000
        Referrer policy
        strict-origin-when-cross-origin

    res json:
        {"error":"Invalid pagination parameters","details":null,"fields":null}

After resolved
--------------

    1. removed limit and page bugs:

        res.header:
            Request URL
            http://localhost:3000/orders/ORD-001/shipments?page=1&limit=1
            Request method
            GET
            Status code
            200 OK
            Remote address
            [::1]:3000
            Referrer policy
            strict-origin-when-cross-origin

        res.json:
            {
                "data": [
                    {
                        "id": "SHP-003",
                        "orderId": "ORD-001",
                        "carrier": "UPS",
                        "trackingNumber": "23092375",
                        "createdAt": "2026-11-14T16:09:11.817Z"
                    }
                ],
                "page": 1,
                "limit": 1,
                "total": 3,
                "totalPages": 3
            }