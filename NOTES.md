fault 1
-------
    symptom: api didn't responds

    evidence: 
        ==> docker-compose ps - shows api exit with code 1

        Name                       Command               State                       Ports                    
        ---------------------------------------------------------------------------------------------------------------
        shiphub-api_api_1        docker-entrypoint.sh node  ...   Exit 1                                               
        shiphub-api_mongo_1      docker-entrypoint.sh mongod      Up       0.0.0.0:27017->27017/tcp,:::27017->27017/tcp
        shiphub-api_postgres_1   docker-entrypoint.sh postgres    Up       0.0.0.0:5432->5432/tcp,:::5432->5432/tcp 

    cause: wrong credentials
        ==> docker-compose logs api - shows mongodb auth failed and server fail fast

        api_1       | ◇ injected env (0) from .env
        api_1       | Failed to start server: MongoServerError: Authentication failed.
        api_1       |     at Connection.sendCommand (/app/node_modules/mongodb/lib/cmap/connection.js:322:27)
        ...
        api_1       |   code: 18,
        api_1       |   codeName: 'AuthenticationFailed',
        api_1       |   connectionGeneration: 0
        api_1       |

    fix: Provide correct auth variables in env and docker-compose down -v (to clear cached credentials by mongodb)

        ==>    docker-compose down -v
        
        Stopping shiphub-api_mongo_1    ... done
        Stopping shiphub-api_postgres_1 ... done
        Removing shiphub-api_api_1      ... done
        Removing shiphub-api_mongo_1    ... done
        Removing shiphub-api_postgres_1 ... done
        Removing network shiphub-api_default
        Removing volume shiphub-api_postgres_data
        Removing volume shiphub-api_mongo_data

        ==>   docker-compose up -d --build

        Creating network "shiphub-api_default" with the default driver
        ...
        Successfully tagged shiphub-api_api:latest
        Creating shiphub-api_postgres_1 ... done
        Creating shiphub-api_mongo_1    ... done
        Creating shiphub-api_api_1      ... done

    proof: 
        ==>   docker-compose logs -f api

        Attaching to shiphub-api_api_1
        api_1       | ◇ injected env (0) from .env
        api_1       | [INFO] 2026-11-18T18:06:20.219Z: mongoDB connected
        api_1       | [INFO] 2026-11-18T18:06:20.258Z: ShipHub API running at http://localhost:3000


        ==>     docker-compose ps

        CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS         PORTS                                           NAMES
        8c1293aa73e9   shiphub-api_api      "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp       shiphub-api_api_1
        a89dd2db223b   postgres:16-alpine   "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp       shiphub-api_postgres_1
        601a619e4d3a   mongo:8.3.17         "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   0.0.0.0:27017->27017/tcp, :::27017->27017/tcp   shiphub-api_mongo_1

fault 2
-------
    symptom: api didn't responds

    evidence: 
        ==> docker-compose ps - shows api exit with code 1

        Name                       Command               State                       Ports                    
        ---------------------------------------------------------------------------------------------------------------
        shiphub-api_api_1        docker-entrypoint.sh node  ...   Exit 1                                               
        shiphub-api_mongo_1      docker-entrypoint.sh mongod      Up       0.0.0.0:27017->27017/tcp,:::27017->27017/tcp
        shiphub-api_postgres_1   docker-entrypoint.sh postgres    Up       0.0.0.0:5432->5432/tcp,:::5432->5432/tcp 

    cause: wrong port
        ==> docker-compose logs api - shows connect ECONNREFUSED 172.25.0.3:27019

       ◇ injected env (0) from .env
        api_1       | Failed to start server: MongooseServerSelectionError: connect ECONNREFUSED 172.25.0.3:27019
        api_1       |     at _handleConnectionErrors (/app/node_modules/mongoose/lib/connection.js:1180:11)
        ...

    fix: Provide correct ports in env and docker-compose down

        ==>   docker-compose start api
        
        Starting api ... done

        ==>    docker-compose down -v

    proof: 
        ==>   docker-compose logs -f api

        Attaching to shiphub-api_api_1
        api_1       | ◇ injected env (0) from .env
        api_1       | [INFO] 2026-11-18T18:06:20.219Z: mongoDB connected
        api_1       | [INFO] 2026-11-18T18:06:20.258Z: ShipHub API running at http://localhost:3000


        ==>     docker-compose ps

                Name                       Command               State                      Ports                    
                --------------------------------------------------------------------------------------------------------------
                shiphub-api_api_1        docker-entrypoint.sh node  ...   Up      0.0.0.0:3000->3000/tcp,:::3000->3000/tcp    
                shiphub-api_mongo_1      docker-entrypoint.sh mongod      Up      0.0.0.0:27017->27017/tcp,:::27017->27017/tcp
                shiphub-api_postgres_1   docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp,:::5432->5432/tcp  

fault 3
-------
    symptom: docker-compose build failed

    evidence: 
        ==> build logs shows

        ...
        Step 11/11 : CMD ["node", "server.js"]
        ---> Using cache
        ---> 64d17929db1c

        Successfully built 64d17929db1c
        Successfully tagged shiphub-api_api:latest
        Creating shiphub-api_mongo_1 ... 
        Creating shiphub-api_mongo_1    ... error
        WARNING: Host is already in use by another container

        ERROR: for shiphub-api_mongo_1  Cannot start service mongo: driver failed programming external connectivity on endpoint shiphub-api_mongo_1 (99bc951165b1e24e0a647eeb6662615028295d9623ac6253a55b9ff7fa513ab0): Bind for 0.0.0.0
        Creating shiphub-api_postgres_1 ... done

        ERROR: for mongo  Cannot start service mongo: driver failed programming external connectivity on endpoint shiphub-api_mongo_1 (99bc951165b1e24e0a647eeb6662615028295d9623ac6253a55b9ff7fa513ab0): Bind for 0.0.0.0:5432 failed: port is already allocated
        ERROR: Encountered errors while bringing up the project.

    cause: conflicting port, two containers trying publish on same port.

    fix: Provide distinct ports for external publishing

        ==>   docker-compose up --build
        
        Building api
        Step 1/11 : FROM node:22-alpine AS base
        ---> ae59e9992c6b
        ...

        Successfully built 64d17929db1c
        Successfully tagged shiphub-api_api:latest
        shiphub-api_postgres_1 is up-to-date
        Recreating shiphub-api_mongo_1 ... done
        Creating shiphub-api_api_1     ... done
    proof: 
        ==>   docker-compose logs -f api

        Attaching to shiphub-api_api_1
        api_1       | ◇ injected env (0) from .env
        api_1       | [INFO] 2026-11-18T18:06:20.219Z: mongoDB connected
        api_1       | [INFO] 2026-11-18T18:06:20.258Z: ShipHub API running at http://localhost:3000


        ==>     docker-compose ps

                Name                       Command               State                      Ports                    
                --------------------------------------------------------------------------------------------------------------
                shiphub-api_api_1        docker-entrypoint.sh node  ...   Up      0.0.0.0:3000->3000/tcp,:::3000->3000/tcp    
                shiphub-api_mongo_1      docker-entrypoint.sh mongod      Up      0.0.0.0:27017->27017/tcp,:::27017->27017/tcp
                shiphub-api_postgres_1   docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp,:::5432->5432/tcp  

fault 4
-------
    symptom: docker-compose build failed

    evidence: 
        ==> docker-compose config shows

        ERROR: The Compose file './docker-compose.yml' is invalid because:
        services.mongo.ports contains an invalid type, it should be a number, or an object

    cause: syntax bug in docker-compose.yml's mapping.

    fix:  Correct the mapping

        ==>   remove the extra space between coloumn and mapping key and value.
        
        ports:
        - "27017:27017"
        
    proof: 
        ==>   docker-compose config (returned the valid compose.yml file)

        services:
            api:
                ...
                - postgres_data:/var/lib/postgresql/data:rw
            version: '3.3'
            volumes:
            mongo_data: {}
            postgres_data: {}  

<!-- Update my docker-compose to v2, now i can use docker compose -->
fault 5
-------
    symptom:api fail fast

    evidence: 
        ==> docker-compose ps shows api down
        ==> docker-compose logs api shows
            Attaching to shiphub-api_api_1
            api_1       | 
            api_1       | > shiphub-api@1.0.0 db:migrate-pg
            ...  | 
            api_1       | Error: connect ECONNREFUSED 172.24.0.2:5432
            api_1       |     at /app/node_modules/pg-pool/index.js:45:11
            api_1       |     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
            api_1       |     at async file:///app/migrations/pg-migration.js:8:16 
            ...
            shiphub-api_api_1 exited with code 1

    cause: api container started and ran migration before psql container starts and accept connections.

    fix:  Add api service depends on condition healthy and restart when depedecies change
        docker-compose.yml
        depends_on:
            postgres:
                condition:  service_healthy
    proof: 
        ==>   docker compose up -d build show all container healthy

                [+] Running 6/6
        ✔ api                           Built                                                                                                              0.0s 
        ✔ migrate                       Built                                                                                                              0.0s 
        ✔ Container shiphub-mongo-1     Healthy                                                                                                            2.5s 
        ✔ Container shiphub-postgres-1  Healthy                                                                                                            2.5s 
        ✔ Container shiphub-migrate-1   Exited                                                                                                            14.0s 
        ✔ Container shiphub-api-1       Started   


Run docker compose up -d --build --wait
----------------------------------------

    before:
        mehere@LAPTOP-GMBC4TRO:/mnt/d/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api$ docker compose down -v
        [+] Running 7/7
        ✔ Container shiphub-api-1       Removed                                                                                                           10.9s 
        ✔ Container shiphub-mongo-1     Removed                                                                                                            1.3s 
        ✔ Container shiphub-migrate-1   Removed                                                                                                            0.0s 
        ✔ Container shiphub-postgres-1  Removed                                                                                                            1.0s 
        ✔ Volume shiphub_mongo_data     Removed                                                                                                            0.4s 
        ✔ Volume shiphub_postgres_data  Removed                                                                                                            0.4s 
        ✔ Network shiphub_default       Removed     

    1st Iteration:
        ==> docker compose up -d --build --wait
        Compose can now delegate builds to bake for better performance.
        ...
        [+] Running 9/9
        ✔ api                             Built                                                                                                            0.0s 
        ✔ migrate                         Built                                                                                                            0.0s 
        ✔ Network shiphub_default         Created                                                                                                          0.1s 
        ✔ Volume "shiphub_postgres_data"  Created                                                                                                          0.0s 
        ✔ Volume "shiphub_mongo_data"     Created                                                                                                          0.0s 
        ✔ Container shiphub-mongo-1       Healthy                                                                                                         20.3s 
        ✔ Container shiphub-postgres-1    Healthy                                                                                                         20.3s 
        ✔ Container shiphub-migrate-1     Exited                                                                                                          20.1s 
        ✔ Container shiphub-api-1         Healthy                               

    2nd Iteration:
        ==> docker compose up -d --build --wait
       ...                                           
        [+] Running 6/6
        ✔ api                           Built                                                                                                              0.0s 
        ✔ migrate                       Built                                                                                                              0.0s 
        ✔ Container shiphub-postgres-1  Healthy                                                                                                           12.8s 
        ✔ Container shiphub-mongo-1     Healthy                                                                                                           12.8s 
        ✔ Container shiphub-migrate-1   Exited                                                                                                            12.8s 
        ✔ Container shiphub-api-1       Healthy  

    3rd Iteration:
        ==> docker compose up -d --build --wait
       ...                                           
        [+] Running 6/6
        ✔ api                           Built                                                                                                              0.0s 
        ✔ migrate                       Built                                                                                                              0.0s 
        ✔ Container shiphub-mongo-1     Healthy                                                                                                           12.9s 
        ✔ Container shiphub-postgres-1  Healthy                                                                                                           12.9s 
        ✔ Container shiphub-migrate-1   Exited                                                                                                            12.9s 
        ✔ Container shiphub-api-1       Healthy                                                                                                           12.9s 
                          

Why service healthy
-------------------

Our api is hardly-depended on the other services like postgress and mongodb. Adding just postgres and mongodb inside dependecies only just look wheather service started or not.It doesnt check the service can accept the request or not. When we add health check, docker can ensure that, service can accept request and its healthy.

Why migration runs as a separate service
----------------------------------------

As we talked about postgres, the postgres is waste unless the schemas are migrated. So to ensure the data migrated succusfully and exited with status code 0, then api can run. Else fail fast api.
    