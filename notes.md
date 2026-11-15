1. Seeded  50000 Orders:

    S D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> npm run db:seed

    > shiphub-api@1.0.0 db:seed
    > node --env-file=.env seeders/order-seeder.js

    ◇ injected env (0) from .env
    ◇ injected env (0) from .env
    Inserted 1000 / 50000
    ...
    Inserted 49000 / 50000
    Inserted 50000 / 50000


2. 1st time migrating priority

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> npm run db:migrate                                  
                                                                       
    > shiphub-api@1.0.0 db:migrate                                                                                  
    > node --env-file=.env  migrations/backfill-order-priority.js

    ◇ injected env (0) from .env
    [INFO] 2026-11-15T09:23:39.365Z: mongoDB connected
    Migration completed
    Matched documents: 5000
    Modified documents: 5000
    Normal priority documents: 5000


3. 2nd time migrating priority

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> npm run db:migrate

    > shiphub-api@1.0.0 db:migrate
    > node --env-file=.env  migrations/backfill-order-priority.js

    ◇ injected env (0) from .env
    [INFO] 2026-11-15T09:25:39.837Z: mongoDB connected
    Migration completed
==> Matched documents: 0
==> Modified documents: 0
    Normal priority documents: 5000


4. Invalid Priority filtering

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> curl.exe -i -X GET "http://localhost:3000/orders?priority=urgent"                                                                                                   
    HTTP/1.1 400 Bad Request                pstone\shiphub-api> 
    X-Powered-By: Express                                             
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 78
    ETag: W/"4e-j5mllb60K5KWO8DvfAhPIfciAFo"
    Date: Sun, 15 Nov 2026 08:20:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"Priority must be low, normal, or high","details":null,"fields":null}


5.  Valid Priority

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> curl.exe -i -X GET "http://localhost:3000/orders?priority=normal&limit=5"
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 1067
    ETag: W/"42b-mm8sGPYPKAKRRX/5Ir+XVkAk14Y"
    Date: Sun, 15 Nov 2026 09:30:41 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"success":true,"data":[{"id":"ORD-000001","customer":"Customer 1","product":"Product 1","status":"Pending","createdAt":"2026-11-15T09:22:49.986Z","channel":"web","updatedAt":"2026-11-15T09:22:50.102Z","priority":"normal"},{"id":"ORD-000002","customer":"Customer 2","product":"Product 2","status":"Processing","createdAt":"2026-11-15T09:21:49.986Z","channel":"web","updatedAt":"2026-11-15T09:22:50.103Z","priority":"normal"},{"id":"ORD-000003","customer":"Customer 3","product":"Product 3","status":"Shipped","createdAt":"2026-11-15T09:20:49.986Z","channel":"web","updatedAt":"2026-11-15T09:22:50.103Z","priority":"normal"},{"id":"ORD-000004","customer":"Customer 4","product":"Product 4","status":"Delivered","createdAt":"2026-11-15T09:19:49.986Z","channel":"web","updatedAt":"2026-11-15T09:22:50.103Z","priority":"normal"},{"id":"ORD-000005","customer":"Customer 5","product":"Product 5","status":"Cancelled","createdAt":"2026-11-15T09:18:49.986Z","channel":"web","updatedAt":"2026-11-15T09:22:50.103Z","priority":"normal"}],
    "page":1,"total":5000,"totalPages":1000}


6. Run explain('executionStats') after and before indexing

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> npm run db:explain

    > shiphub-api@1.0.0 db:explain
    > node --env-file=.env scripts/explain-query.js

    ◇ injected env (0) from .env
    [INFO] 2026-11-15T09:34:58.468Z: mongoDB connected

    --- BEFORE INDEX ---
    {
    winningPlan: {
        stage: 'SORT',
        sortPattern: { createdAt: -1, id: 1 },
        memLimit: 104857600,
        limitAmount: 20,
        type: 'simple',
        inputStage: { stage: 'COLLSCAN', filter: [Object], direction: 'forward' }
    },
    executionStats: {
        nReturned: 20,
        totalKeysExamined: 0,
        totalDocsExamined: 50000,
        executionTimeMillis: 49
    }
    }

    --- AFTER INDEX ---
    {
    winningPlan: {
        stage: 'LIMIT',
        limitAmount: 20,
        inputStage: { stage: 'FETCH', inputStage: [Object] }
    },
    executionStats: {
        nReturned: 20,
        totalKeysExamined: 20,
        totalDocsExamined: 20,
        executionTimeMillis: 12
    }
    }

7. Created Order exists in db
    {
        "success": true,
        "data": {
            "id": "ORD-50001",
            "customer": "Test",
            "product": "Test Pro",
            "status": "Shipped",
            "priority": "normal",
            "channel": "web",
            "createdAt": "2026-11-15T09:38:42.940Z",
            "updatedAt": "2026-11-15T09:39:19.377Z"
        }
    }


8. Order creation with IdempotencyKey

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> curl.exe --% -i -X POST "http://localhost:3000/orders" -H "Content-Type: application/json" -H "Idempotency-Key: 12345678120" -d "{\"customer\":\"Alice Johnson\",\"product\":\"Smartphone\",\"priority\":\"high\"}"
    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
==> Idempotency-Replayed: false
    Content-Type: application/json; charset=utf-8
    Content-Length: 252
    ETag: W/"fc-JdkHh9gfPjfHIUpheeopZqJwWr0"
    Date: Sun, 15 Nov 2026 11:19:14 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"success":true,"data":{"id":"ORD-015","customer":"Alice Johnson","product":"Smartphone","status":"Pending","priority":"high","channel":"web","idempotencyKey":"12345678120","createdAt":"2026-11-15T11:19:14.755Z","updatedAt":"2026-11-15T11:19:14.763Z"}}


9. Order creation after service restart with IdempotencyKey

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-api> curl.exe --% -i -X POST "http://localhost:3000/orders" -H "Content-Type: application/json" -H "Idempotency-Key: 12345678120" -d "{\"customer\":\"Alice Johnson\",\"product\":\"Smartphone\",\"priority\":\"high\"}"
    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
==> Idempotency-Replayed: true
    Content-Type: application/json; charset=utf-8
    Content-Length: 252
    ETag: W/"fc-JdkHh9gfPjfHIUpheeopZqJwWr0"
    Date: Sun, 15 Nov 2026 11:22:54 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"success":true,"data":{"id":"ORD-015","customer":"Alice Johnson","product":"Smartphone","status":"Pending","priority":"high","channel":"web","idempotencyKey":"12345678120","createdAt":"2026-11-15T11:19:14.755Z","updatedAt":"2026-11-15T11:19:14.763Z"}}


10. npm run check

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> npm run check    

    > shiphub-web@0.0.0 check
    > eslint .


    D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web\src\components\Pagination.tsx
    50:8  warning  React Hook useEffect has a missing dependency: 'handlePageChange'. Either include it or removethe dependency array. If 'handlePageChange' changes too often, find the parent component that defines it and wrap that definition in useCallback  react-hooks/exhaustive-deps

    ✖ 1 problem (0 errors, 1 warning)

11. Stopped mongodb service while a req happening

    PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> curl.exe -i -X GET "http://localhost:3000/orders?priority=normal&limit=30"
==> HTTP/1.1 503 Service Unavailable
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 64
    ETag: W/"40-aBJ5l2irreF47J1tEtckVqU+I9s"
    Date: Sun, 15 Nov 2026 12:01:14 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"Please try again later.","details":null,"fields":null}
    

Reflection
----------

The best inference from this assinment is the finding of how the indexing fasten our api quries, the 
explain excution status given us the cleas picture, so we can easly decide do we need indexing or which
field should be indexed. Also i were unaware that the mongodb only put the defaults only  when the data
is readed, so i impplimented backfilling migration. It was nice pitfall catch.

Also for our custom id increment, i created a counter schema, that will give every req a unique counter sequential id using mongodb atomic incriment operation. This avoid race condition when multiple request 
simultaneously  fetch the latest order id to calculate. so there will be no replicated id chance. Even though mongoDb unique constrain handles it and throw error, we can avoid this vulerable chance.

fragile parts: The Counter schema shouldnt care of is the order creation succesfull or not, it incriment
the counter, so the sequence number in id may be skipped. Also now my service heavely depend on mongoDB,
when i migrate the 50000s data the  mongodb showed some 'can't connect error' and i couldnt ran the api
service due to it.


Q:  Do we need to store idempotency key inside the db for so long, is  it just need redis or some cache ?