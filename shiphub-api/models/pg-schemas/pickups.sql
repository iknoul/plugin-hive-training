CREATE TABLE IF NOT EXISTS pickup_addresses (
    address_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    seller_id INTEGER NOT NULL REFERENCES sellers(seller_id),

    pickup_label VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,

    CONSTRAINT fk_pickup_seller
        FOREIGN KEY (seller_id)
        REFERENCES sellers(seller_id),

    CONSTRAINT chk_pincode
        CHECK (pincode ~ '^[0-9]{6}$'),

    CONSTRAINT uq_seller_pickup_label_city
        UNIQUE (seller_id, pickup_label, city)
);

-- 1
-- predicted => change the coloumn name
-- response =>
--  returned 'ALTER TABLE' string and changed the coloumn name
-- ALTER TABLE pickup_addresses RENAME COLUMN address_label TO pickup_label;

-- 2
-- predicted => show sellers and their hub counts, except one seller ( only 3 seller should be there)
-- response:
--        name       | hubs
-- ------------------+------
--  Idris Habibi     |    5
--  Nooh Mespotamian |    4
--  Aron Jleventus   |    6
-- (3 rows)
SELECT s.name, COUNT(sa.address_id) as hubs
FROM SELLERS s LEFT JOIN PICKUP_ADDRESSES sa ON s.seller_id = sa.seller_id
GROUP BY s.seller_id
HAVING COUNT(sa.address_id) > 1;

-- 3
-- predicted result shop: count - 10, sellers - 10| warehouse: count - 6, sellers - 6
-- (3 coloumned table showing different pickup types counts and how much sellers has that type)
-- response:
--  pickup_types | count | sellers_count
-- --------------+-------+---------------
--  shop         |    10 |            10
--  warehouse    |     6 |             6
-- (2 rows)
SELECT pa.pickup_label as pickup_types, COUNT(pa.address_id) as count, COUNT(s.seller_id) as sellers_count
FROM pickup_addresses pa LEFT JOIN sellers s ON  pa.seller_id = s.seller_id
GROUP BY pa.pickup_label;


-- 4
-- predicted result each city having 
-- (3 coloumned table showing different city and pickup types counts   )
-- response:
--         city        | pickup_types | count
-- --------------------+--------------+-------
--  Chennai            | warehouse    |     1
--  Delhi              | shop         |     1
--  Kozhikode          | warehouse    |     1
--  Pune               | shop         |     1
--  Kochi              | warehouse    |     1
--  Bengaluru          | shop         |     1
--  Mumbai             | warehouse    |     1
--  Mumbai             | shop         |     1
--  Thiruvananthapuram | shop         |     1
--  Kochi              | shop         |     1
--  Ernakulam          | shop         |     1
--  Hyderabad          | shop         |     1
--  Bengaluru          | warehouse    |     1
--  Perambra           | shop         |     1
--  Pune               | warehouse    |     1
--  Thrissur           | shop         |     1
-- (16 rows)

SELECT pa.city as city, pa.pickup_label as pickup_types,  COUNT(pa.address_id) as count
FROM pickup_addresses pa LEFT JOIN sellers s ON  pa.seller_id = s.seller_id
GROUP BY pa.city, pa.pickup_label;






