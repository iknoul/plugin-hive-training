1. Docker compose.yml: (./shiphub-api/docker-compose.yml)

2. Create .env using npm run setup;

    reflections:
        - added env-setup (./shiphub-api/scripts/env-setup.js) file that copy .env.example to create new .env. if already exists then skipp.
        - added "setup": "node scripts/env-setup.js" in package.json script

    `   .../shiphub-capstone/shiphub-api$ npm run setup

        > shiphub-api@1.0.0 setup
        > node scripts/env-setup.js

        Created .env from .env.example
    `

3. Docker compose down -v (remove & stops all containers, networks and permenanlty delete volumes )

    - docker-compose down -v

    res:
        Removing shiphub-api_api_1      ... done
        Removing shiphub-api_mongo_1    ... done
        Removing shiphub-api_postgres_1 ... done
        Removing network shiphub-api_default
        Removing volume shiphub-api_postgres_data

4. Docker compose up -d (create & starts all containers, networks and volumes in detached state )

    - docker-compose up -d

    res:
        Creating network "shiphub-api_default" with the default driver
        Creating shiphub-api_mongo_1    ... done
        Creating shiphub-api_postgres_1 ... done
        Creating shiphub-api_api_1      ... done


5. Service statuses
        
        <!-- i have legecy docker-compose, instead of docker compose -->
        - docker-compose ps        

        Name                       Command               State                       Ports                    
        ---------------------------------------------------------------------------------------------------------------
        shiphub-api_api_1        docker-entrypoint.sh node  ...   Exit 1                                               
        shiphub-api_mongo_1      docker-entrypoint.sh mongod      Up       0.0.0.0:27017->27017/tcp,:::27017->27017/tcp
        shiphub-api_postgres_1   docker-entrypoint.sh postgres    Up       0.0.0.0:5432->5432/tcp,:::5432->5432/tcp


6. Time-stapmed logs
        
    - docker-compose logs -f -t  api

    Attaching to shiphub-api_api_1
    api_1       | 2026-11-18T12:20:00.919464131Z ◇ injected env (0) from .env
    api_1       | 2026-11-18T12:20:06.367244694Z Failed to start server: MongoServerError: Authentication failed.
    api_1       | 2026-11-18T12:20:06.367557175Z     at Connection.sendCommand (/app/node_modules/mongodb/)
    ...
    api_1       | 2026-11-18T12:20:06.367695541Z   codeName: 'AuthenticationFailed',
    api_1       | 2026-11-18T12:20:06.367704899Z   connectionGeneration: 8
    api_1       | 2026-11-18T12:20:06.367709207Z 
    shiphub-api_api_1 exited with code 1

4. Compose.yml validation using docker-compose config --quiet

    ==> docker-compose config --quiet

    mehere@LAPTOP-GMBC4TRO:/mnt/d/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api$ docker-compose config --quiet
    mehere@LAPTOP-GMBC4TRO:/mnt/d/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api$ 



