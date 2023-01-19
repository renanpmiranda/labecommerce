-- Active: 1673888150880@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);

PRAGMA table_info ("users");

INSERT INTO users (id, name, email, password, created_at)
VALUES ("u001", "Fulano", "fulano@gmail.com", "123456", DATETIME("now", "localtime")),
("u002", "Ciclano", "ciclano@gmail.com", "654321", DATETIME("now", "localtime")),
("u003", "Beltrano", "beltrano@gmail.com", "112233445566", DATETIME("now", "localtime"));

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url, TEXT NOT NULL
);

PRAGMA table_info ("products");

INSERT INTO products (id, name, price, category, description)
VALUES ("p001", "The Last of Us - Part II", 199.99, "Games", ""),
("p002", "Playstation 5", 5499.99, "Electronics"),
("p003", "Headset JBL", 350.00, "Accessories"),
("p004", "Samsung SMARTV UltraHD 4K HDR", 2700.00, "Electronics"),
("p005", "Cadeira Gamer Thunder X3", 549.99, "Accessories");

SELECT * FROM products;

DROP TABLE products;

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL UNIQUE NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES
    ("p001", 350.00, 0, "001"),
    ("p002", 2700.00, 0, "001"),
    ("p003", 5499.99, 0, "002"),
    ("p004", 549.99, 0, "002"),
    ("p005", 199.99, 0, "003");

SELECT * FROM purchases;

DROP TABLE purchases;

UPDATE purchases
SET delivered_at = DATETIME("now")
WHERE id = "p001";

SELECT * FROM users
INNER JOIN purchases
ON purchases.buyer_id = users.id
WHERE users.id = "003";

CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ("p001", "003", 1),
    ("p002", "004", 1),
    ("p003", "002", 1),
    ("p004", "005", 1),
    ("p005", "001", 1);

SELECT * FROM purchases_products;

SELECT * FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;

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