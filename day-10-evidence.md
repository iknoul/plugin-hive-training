1. Add comments explaining the reason for every non-null (!) and nullable field choice:
    
[schema.graphql](graphql\schema\schema.graphql)

2. Add the resolver inside the Seller block.:

[order-resolver.js](graphql\resolvers\order-resolver.js)

3. why the resolver should not query the database directly:

    - Reusablility of code: for reusing queries we need it write it as
    seperate service helpers.

    - Readability: for maintaining clean code and seperating functionality 
    by meaningfull like resolvers handles graphql arguments and response, where
    service functions handles the db operations.

    - Safety measures: passing direct connection to graphql resolver not safe,
    we need to maintain consistent validation and measrues.

4. Test GraphQL Queries:

 a. up the containers
    mehere@LAPTOP-GMBC4TRO:/mnt/d/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api$ npm run up && npm run gql

    > shiphub-api@1.0.0 up
    > docker compose up -d --build
    ....
    Built                                                                    0.0s 
    ✔ migrate                       Built                                                                    0.0s 
    ✔ Container shiphub-postgres-1  Healthy                                                                  4.0s 
    ✔ Container shiphub-mongo-1     Healthy                                                                  4.0s 
    ✔ Container shiphub-migrate-1   Exited                                                                  15.7s 
    ✔ Container shiphub-api-1       Started  

 b. test the queries [graphql-test.mjs] (tests\graphql-test.mjs)
    
    mehere@LAPTOP-GMBC4TRO:/mnt/d/Wa/Plugin-hive-training/shiphub-capstone/shiphub-api$ npm run gql

    > shiphub-api@1.0.0 gql
    > node tests/graphql-test.mjs

    ◇ injected env (9) from .env
    [INFO] 2026-11-23T18:24:10.233Z: 

==> --- TEST 1: Aliases and Fragments ---

    [INFO] 2026-11-23T18:24:11.310Z: {
    "data": {
        "sellerOne": {
        "name": "Aron Jleventus",
        "email": "aronle@email.com",
        "shippedItems": {
            "data": [
            {
                "id": "ORD-000006-item-6373d7",
                "name": "Product 6-1"
            },
            {
                "id": "ORD-000006-item-6373d9",
                "name": "Product 6-2"
            }
            ]
        }
        },
        "sellerTwo": {
        "name": "Nooh Mespotamian",
        "email": "noohmesa@email.com",
        "shippedItems": {
            "data": [
            {
                "id": "ORD-000002-item-6373c1",
                "name": "Product 2-2"
            },
            {
                "id": "ORD-000002-item-6373bf",
                "name": "Product 2-1"
            },
            {
                "id": "ORD-000011-item-6373f8",
                "name": "Product 11-3"
            },
            {
                "id": "ORD-000012-item-6373fd",
                "name": "Product 12-2"
            },
            {
                "id": "ORD-000013-item-637404",
                "name": "Product 13-1"
            }
            ]
        }
        }
    }
    }
    [INFO] 2026-11-23T18:24:11.310Z: 

==> --- TEST 2: Variables ---

    [INFO] 2026-11-23T18:24:11.509Z: {
    "data": {
        "sellerOne": {
        "name": "Aron Jleventus",
        "email": "aronle@email.com",
        "shippedItems": {
            "data": [
            {
                "id": "ORD-000006-item-6373d7",
                "name": "Product 6-1"
            },
            {
                "id": "ORD-000006-item-6373d9",
                "name": "Product 6-2"
            }
            ]
        }
        },
        "sellerTwo": {
        "name": "Nooh Mespotamian",
        "email": "noohmesa@email.com",
        "shippedItems": {
            "data": [
            {
                "id": "ORD-000002-item-6373c1",
                "name": "Product 2-2"
            },
            {
                "id": "ORD-000002-item-6373bf",
                "name": "Product 2-1"
            },
            {
                "id": "ORD-000011-item-6373f8",
                "name": "Product 11-3"
            }
            ]
        }
        }
    }
    }

    [INFO] 2026-11-23T18:53:44.501Z: 

==> # GraphQL Invalid Request Tests
 
| Invalid request | Status | Message | Resolver reached? |
|---|---|---|---|
| Test 3: Non-existing field (`bloodGroup` on `Seller`) | 400 Bad Request | Cannot query field "bloodGroup" on type "Seller". | No. query validation rejected. |
| Test 4: Query with limit 500 | 200 OK | Limit must be between 1 and 100 | Yes.  resolver rejected the argument, so `shippedItems` is `null`. |
| Test 5: Mutation with GET | 405 Method Not Allowed | Cannot perform mutations over GET | No. Blocked at the HTTP layer. |