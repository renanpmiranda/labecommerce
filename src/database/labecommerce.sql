-- Active: 1673888150880@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

PRAGMA table_info ("users");

INSERT INTO users (id, email, password)
VALUES ("001", "fulano@gmail.com", "123456"),
("002", "ciclano@gmail.com", "654321"),
("003", "beltrano@gmail.com", "112233445566");

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

PRAGMA table_info ("products");

INSERT INTO products (id, name, price, category)
VALUES ("001", "The Last of Us - Part II", 199.99, "Games"),
("002", "Playstation 5", 5499.99, "Electronics"),
("003", "Headset JBL", 350.00, "Accessories"),
("004", "Samsung SMARTV UltraHD 4K HDR", 2700.00, "Electronics"),
("005", "Cadeira Gamer Thunder X3", 549.99, "Accessories");

SELECT * FROM products;

DROP TABLE products;

-- GET ALL PRODUCTS
SELECT * FROM products;

-- SEARCH PRODUCT BY NAME
SELECT * FROM products
WHERE name = "Playstation 5";

-- CREATE USER
INSERT INTO users (id, email, password)
VALUES ("004", "timpano@gmail.com", "02468");

-- CREATE PRODUCT
INSERT INTO products (id, name, price, category)
VALUES ("006", "God of War Ragnarok", 279.90, "Games");

-- GET PRODUCTS BY ID
SELECT * FROM products
WHERE id = "003";

-- DELETE USER BY ID
DELETE FROM users
WHERE id = "004";

-- DELETE PRODUCT BY ID
DELETE FROM products
WHERE id = "006";

-- EDIT USER BY ID
UPDATE users
SET password = "02468"
WHERE id = "003";

-- EDIT PRODUCT BY ID
UPDATE products
SET price = 275.00
WHERE id = "001";

-- GET ALL USERS
SELECT * FROM users
ORDER BY email ASC;

-- GET ALL PRODUCTS VERSÃO 1
SELECT * FROM products
ORDER BY price ASC
LIMIT 20;

-- GET ALL PRODUCTS VERSÃO 2
SELECT * FROM products
WHERE price > 100 AND price < 300
ORDER BY price ASC