1. pickups.sql schema [along with 4 quries and responses]: (./shiphub-api/models/pg-schemas/pickups.sql)  

2. pickup-seeder.js seeder: (./shiphub-api/seeders/pickup-seeder.js)

3. Wrong insert attempt:

    a.
        q: `INSERT INTO sellers(name, email) VALUES('erry bounce', 'ereey');`
        res:
        ERROR:  new row for relation "sellers" violates check constraint "chk_email"
        DETAIL:  Failing row contains (9, erry bounce, ereey).

    b. 
        q: `INSERT INTO sellers(seller_id, name, email) VALUES(99, 'erry bounce', 'ereey');`
        res:
        ERROR:  cannot insert a non-DEFAULT value into column "seller_id"
        DETAIL:  Column "seller_id" is an identity column defined as GENERATED ALWAYS.
        HINT:  Use OVERRIDING SYSTEM VALUE to override.



    c. 
        q: `INSERT INTO pickup_addresses(seller_id, label, address, city, pincode) 
        VALUES(1, 'Home', 'house no: 32, str: 322', 'Calcutta', '21232');`
        res:
        ERROR:  new row for relation "pickup_addresses" violates check constraint "chk_pincode"
        DETAIL:  Failing row contains (65, 1, Home, house no: 32, str: 322, Calcutta, 21232).   