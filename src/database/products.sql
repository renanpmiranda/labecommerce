-- Active: 1673888150880@@127.0.0.1@3306

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

PRAGMA table_info ("products");

INSERT INTO products (id, name, price, category)
VALUES ("p001", "The Last of Us - Part II", 199.99, "Games"),
("p002", "Playstation 5", 5499.99, "Electronics"),
("p003", "Headset JBL", 350.00, "Accessories"),
("p004", "Samsung SMARTV UltraHD 4K HDR", 2700.00, "Electronics"),
("p005", "Cadeira Gamer Thunder X3", 549.99, "Accessories");

SELECT * FROM products;

DROP TABLE products;

-- GET ALL PRODUCTS VERSÃO 1
SELECT * FROM products;

-- GET ALL PRODUCTS VERSÃO 2
SELECT * FROM products
ORDER BY price ASC
LIMIT 20;

-- GET ALL PRODUCTS VERSÃO 3
SELECT * FROM products
WHERE price > 100 AND price < 300
ORDER BY price ASC

-- CREATE PRODUCT
INSERT INTO products (id, name, price, category)
VALUES ("006", "God of War Ragnarok", 279.90, "Games");

-- GET PRODUCTS BY ID
SELECT * FROM products
WHERE id = "003";

-- GET PRODUCT BY NAME
SELECT * FROM products
WHERE name = "Playstation 5";

-- EDIT PRODUCT BY ID
UPDATE products
SET price = 275.00
WHERE id = "001";

-- DELETE PRODUCT BY ID
DELETE FROM products
WHERE id = "006";