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