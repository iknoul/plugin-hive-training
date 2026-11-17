CREATE TABLE sellers (
    seller_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE

    CONSTRAINT chk_email
        CHECK (seller_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')

);

CREATE TABLE pickup_addresses (
    address_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    seller_id INTEGER NOT NULL,

    label VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,

    CONSTRAINT fk_pickup_seller
        FOREIGN KEY (seller_id)
        REFERENCES sellers(seller_id),

    CONSTRAINT chk_pincode
        CHECK (pincode ~ '^[0-9]{6}$'),

    CONSTRAINT uq_seller_pickup_label_city
        UNIQUE (seller_id, address_label, city)
);