Test: Test with PORT=abc and a changed valid port.
---------------------------------------------------
Output:
    [api] file:///D:/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api/config.js:7
    [api]     throw new Error(`Invalid PORT configuration: "${value}". Must be a valid integer between 1 and 65535.`);
    [api]           ^
    [api] 
    [api] Error: Invalid PORT configuration: "abc". Must be a valid integer between 1 and 65535.
    [api]     at validatePort (file:///D:/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api/config.js:7:11)
    [api]     at file:///D:/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api/config.js:21:9
    [api]     at ModuleJob.run (node:internal/modules/esm/module_job:271:25)
    [api]     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:547:26)
    [api]     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:116:5)
    [api] 
    [api] Node.js v22.12.0
    [api] [nodemon] app crashed - waiting for file changes before starting...


Test: Handle server listen errors with a non-zero exit.
------------------------------------------------------
Output: 
    [api] ◇ injected env (2) from .env
    [api] [INFO] 2026-11-04T02:47:34.429Z: ShipHub API running at http://localhost:80
    [api] [ERROR] 2026-11-04T02:47:34.431Z: Server failed to start, Exiting with code 1
    [api] [nodemon] app crashed - waiting for file changes before starting...


Test: Unknown order.
-------------------
Cmnd: 
    PS D:\Wa\Plugin-hive-training> curl.exe -i "http://localhost:3000/orders/ORD-0012"
    
Output: 
    HTTP/1.1 404 Not Found
    {"error":{"status":404,"message":"Order not found"}}


Test: Unknown route.
-------------------
Cmnd: 
    PS D:\Wa\Plugin-hive-training> curl.exe -i "http://localhost:3000/heart"
    
Output: 
    HTTP/1.1 404 Not Found
   {"error":{"status":404,"message":"Route not found: /heart"}}


Test: Malformed JSON.
-------------------
Cmnd: 
    PS D:\Wa\Plugin-hive-training>: curl.exe -i -X POST "http://localhost:3000/orders" -H "Content-Type: application/json" -d '{\"customer\":\"Customer\"'
    
Output: 
    HTTP/1.1 400 Not Found
    {"error":{"status": 400, "message":"Malformed JSON in request body"}} 


Test: Empty customer.
-------------------
Cmnd: 
    PS D:\Wa\Plugin-hive-training> curl.exe -i -X POST "http://localhost:3000/orders" -H "Content-Type: application/json" -d '{\"customer\":\"\",\"product\":\"Product1\"}'
    
Output: 
    HTTP/1.1 400 Bad Request
    {"error":{"status":400,"message":"Missing required fields"}} 


Test: a real bug to demonstrate a generic client-facing.
--------------------------------------------------------
Procedure: Made a syntax err in orders getting api and tried to fetch order from web

Output (server logs):
    [api] [INFO] 2026-11-04T03:37:52.561Z: [INFO] OPTIONS /orders 204
    [api] [ERROR] 2026-11-04T03:37:52.574Z: ReferenceError: filter is not defined
    [api] [ERROR] 2026-11-04T03:37:52.577Z: [ERROR] GET /orders 500


Test: Impliment LOG_LEVEL=debug and LOG_LEVEL=warn (assuming orderId is not sensitive).
--------------------------------------------------------------------------------------
Case 1: Log level = debug
    Console:
        [api] [DEBUG] 2026-11-04T04:07:47.206Z: Error with finding this orderORD-0012 with type string
        [api] [WARN] 2026-11-04T04:07:47.213Z: [WARN] GET /orders/ORD-0012 404

Case 1: Log level = debug
    Console:
        [api] [WARN] 2026-11-04T04:12:23.438Z: [WARN] GET /orders/ORD-0012 404


Build and TypeCheck result.
--------------------------

PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> npx tsc -b       
PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> npm run build    

> shiphub-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
✓ 27 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-BDuiCHH0.css    2.12 kB │ gzip:  0.67 kB
dist/assets/index-BHvc5ZZE.js   224.89 kB │ gzip: 70.33 kB

✓ built in 259ms
PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> 


Peer Review
-----------
Partner Cloned and ran the App in read only mode

    