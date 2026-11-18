1. Api Dockerfile: (./shiphub-api/Dockerfile)

2. Running status

    mehere@LAPTOP-GMBC4TRO:/mnt/d/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api$ docker container list
    
    CONTAINER ID   IMAGE             COMMAND                  CREATED          STATUS          PORTS                                           NAMES
    02ae45bc7059   shiphub-api       "docker-entrypoint.s…"   53 minutes ago   Up 47 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp       shiphub-api
    c567f64b1ae5   mongo:8.3.17      "docker-entrypoint.s…"   2 hours ago      Up 2 hours      0.0.0.0:27017->27017/tcp, :::27017->27017/tcp   mongo
    a6925ec2b533   postgres:alpine   "docker-entrypoint.s…"   47 hours ago     Up 2 hours      0.0.0.0:5432->5432/tcp, :::5432->5432/tcp       pg

3. Data presistence after the docker container restart and rebuild

    a. Created new customer
        curl: .../shiphub-capstone/shiphub-api$ curl -i -X POST "http://localhost:3000/orders"   -H "Content-Type: application/json"   -d '{"customer":"new customer","product":"Product1"}'

        HTTP/1.1 201 Created
        ...

        {"success":true,"data":{"id":"ORD-005","customer":"new customer","product":"Product1","status":"Pending","priority":"normal","channel":"web","items":[],"createdAt":"2026-11-18T08:09:28.427Z","updatedAt":"2026-11-18T08:09:28.431Z"}}

    b. After restarting the server
        curl: .../shiphub-capstone/shiphub-api$ curl -i "http://localhost:3000/orders"

        HTTP/1.1 200 OK
        ...
        {"success":true,
    ==> "data":[{"id":"ORD-005","customer":"new customer", 
        "product":"Product1","status":"Pending",
        "priority":"normal","channel":"web","items":[],"createdAt":"2026-11-18T08:09:28.427Z","updatedAt":"2026-11-18T08:09:28.431Z"}],"page":1,"total":1,"totalPages":1}

4. 


