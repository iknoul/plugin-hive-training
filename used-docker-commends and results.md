Commands or documentation used to build and run containers.
-----------------------------------------------------------
  
    a. Create network named shiphub-net

        : docker my network create shiphub-net

        res id: 5aa9d9751d457f333fdab144b45b62298e0b7e3a74b2562d4a95679d1fa747a8

    b. Run Postgres container (PostgreSQL 17 is not available in docker hub)

        ==>    docker run -d --name pg -p 27017:5432 --network shiphub-net -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=postgres  -e POSTGRES_PASSWORD=password -v postgres_data:/var/lib/postgresql/data postgres:16-alpine

        res id: 29733672f87c7ed5e3500d0ede35282b03e38cdbc049b26e4d72adcff95df6c9

     c. Run Mongodb container

        ==>   docker run -d --name mongo --network shiphub-net -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -v mongo_data:/data/db mongo:8.0.38

        docker err:  Error response from daemon: driver failed programming external connectivity on endpoint mongo (11778bba3066246d39dc693e2d2e8a6d229cd974b47f84051420d79b3c75d06f): Bind for 0.0.0.0:27017 failed: port is already allocated.

    d. Change mongo exposed port to 27018

        ==>   docker run -d --name mongo --network shiphub-net -p 27018:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -v mongo_data:/data/db mongo:8.3.17

        docker err: Error response from daemon: Conflict. The container name "/mongo" is already in use by container "dda1c2ab47aefb0c06f37d4b1eb3242b937a19f16ef2ec1ce9ec64fdfd2183ad". You have to remove (or rename) that container to be able to reuse that name.
        See 'docker run --help'.

    e. Remove existing container

        ==>   docker container rm mongo
        
        res: mongo

    f. Run the container on port 27018 again

        ==>   docker run -d --name mongo --network shiphub-net -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -v mongo_data:/data/db mongo:8.3.17

        res id: 7e7245580d7524a78930d38be8e56b0bbebd3e50ca34d56a26bec7ba84b864d8

    g. Check our Docker file is valid

        ==>   docker build --check .

        res:failed to fetch metadata: fork/exec /usr/local/lib/     docker/cli-plugins/docker-buildx: no such file or directory

        DEPRECATED: The legacy builder is deprecated and will be removed in a future release.
            Install the buildx component to build images with BuildKit:
            https://docs.docker.com/go/buildx/

        unknown flag: --check

    g. Check our Docker file is valid using buildx kit

        ==>   docker buildx build --check .

        res:
            [+] Building 12.4s (6/6) FINISHED                                                                                                         docker:default
            => [internal] load build definition from Dockerfile                                                                                                0.2s
            => => transferring dockerfile: 327B                                                    ...                                                     ...
            => => transferring context: 129B                                                                                                                   0.1s
            Check complete, no warnings found.

    h.Build the Api image shiphub-api

        ==>   docker build -t shiphub-api .

        res:  failed to fetch metadata: fork/exec /usr/local/lib/docker/cli-plugins/docker-buildx: no such file or directory

        Sending build context to Docker daemon  14.22MB
        Step 1/11 : FROM node:22-alpine AS base
        ---> ae59e9992c6b
        Step 2/11 : WORKDIR /app
        ...
        ...
        Step 11/11 : CMD ["node", "server.js"]
        ---> Running in 08171ddf7af3
        ---> Removed intermediate container 08171ddf7af3
        ---> a12cb9457f6f
        Successfully built a12cb9457f6f
        Successfully tagged shiphub-api:latest

    i. Run the container from image shiphub-api

        ==>   docker run -d --name shiphub-api --network shiphub-net --env-file .env -p 3000:3000 shiphub-api 

        res:

    j.  Check running containers (failed to see shiphub-api)

        ==>   docker run --name shiphub-api --network shiphub-net --env-file .env -p 3000:3000 --restart unless-stopped  shiphub-api 

        res: 
            CONTAINER ID   IMAGE             COMMAND                  CREATED          STATUS          PORTS                                           NAMES
            c567f64b1ae5   mongo:8.3.17      "docker-entrypoint.s…"   54 minutes ago   Up 54 minutes   0.0.0.0:27017->27017/tcp, :::27017->27017/tcp   mongo
            a6925ec2b533   postgres:alpine   "docker-entrypoint.s…"   46 hours ago     Up 59 minutes   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp       pg

    k. Check stopped containers (saw shiphub-api)
        ==>    docker container list -al
        res: 
        CONTAINER ID   IMAGE         COMMAND                  CREATED       STATUS                            PORTS     NAMES
        5949b00225f2   shiphub-api   "docker-entrypoint.s…"   5 minutes ago   Exited (137) About a minute ago             shiphub-api


    l. Check Api logs
        ==>   docker logs shiphub-api

        res: ◇ injected env (0) from .env
        Failed to start server: MongoServerError: Authentication 
        ...
        code: 18,
        codeName: 'AuthenticationFailed',
        connectionGeneration: 0
        
    m. Remove stopped container
        ==>   docker rm shiphub-api

        res: shiphub-api

    n. Re-run in foreground with updated .env, 
        ==>   docker run --name shiphub-api --network shiphub-net --env-file .env -p 3000:3000 --restart unless-stopped  shiphub-api 

        res: ◇ injected env (0) from .env
            [INFO] 2026-11-18T05:58:40.180Z: mongoDB connected
            [INFO] 2026-11-18T05:58:40.201Z: ShipHub API running at http://localhost:3000
      